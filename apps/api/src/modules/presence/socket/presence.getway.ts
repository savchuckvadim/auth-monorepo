import { Injectable, OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PresenceService } from "../service/presence.service";

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    },
})
@Injectable()
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    @WebSocketServer()
    server: Server;

    constructor(private readonly service: PresenceService) { }

    onModuleInit() {
        // Настраиваем callback для обработки истечения TTL
        this.service.setExpiredCallback((userId: string) => {
            console.log(`🔴 Presence key expired for user: ${userId}, sending offline event`);
            // Когда ключ истекает в Redis, отправляем событие offline
            this.server.emit('presence:offline', { userId });
        });
    }

    @SubscribeMessage('presence:ping')
    async handlePing(client: Socket) {
        const userId = client.handshake.query.userId as string;
        console.log('🔵 Presence PING event received from user: ', userId);
        if (!userId) return;

        // Продлеваем TTL при получении ping
        const wasOnline = await this.service.isOnline(userId);
        await this.service.refresh(userId);

        // Если пользователь стал online (ключ был создан), отправляем событие
        // Это важно для случаев, когда ключ истек, но пользователь все еще подключен
        const isOnlineNow = await this.service.isOnline(userId);
        if (isOnlineNow && !wasOnline) {
            console.log(`🟢 User ${userId} became online after ping (key was expired)`);
            this.server.emit('presence:online', { userId });
        }
    }

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (!userId) {
            client.disconnect();
            return;
        }

        // Помечаем пользователя как онлайн
        const becameOnline = await this.service.markOnline(userId);

        // Всегда отправляем событие online при подключении
        // Это гарантирует, что все клиенты получат актуальное состояние
        console.log(`📤 Sending presence:online event for user: ${userId} to all clients`);
        this.server.emit('presence:online', { userId });

        // Отправляем новому клиенту список всех онлайн пользователей
        // Это гарантирует, что новый клиент получит актуальное состояние всех пользователей
        const allOnlineUsers = await this.service.getAllOnlineUsers();
        if (allOnlineUsers.length > 0) {
            console.log(`📤 Sending ${allOnlineUsers.length} online users to new client: ${userId}`);
            client.emit('presence:bulk-online', { users: allOnlineUsers });
        }

        if (becameOnline) {
            console.log(`🟢 User ${userId} became online (was offline)`);
        } else {
            console.log(`🟢 User ${userId} is already online, refreshing connection`);
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (!userId) return;

        // Помечаем пользователя как оффлайн
        const wasOnline = await this.service.markOffline(userId);

        if (wasOnline) {
            // Отправляем событие только если пользователь был online
            this.server.emit('presence:offline', { userId });
        }
    }
}
