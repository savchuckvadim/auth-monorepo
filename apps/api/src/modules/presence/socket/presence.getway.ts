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
        await this.service.refresh(userId);
    }

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (!userId) {
            client.disconnect();
            return;
        }

        // Помечаем пользователя как онлайн
        const becameOnline = await this.service.markOnline(userId);

        if (becameOnline) {
            // Отправляем событие только если пользователь стал онлайн (был offline)
            this.server.emit('presence:online', { userId });
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
