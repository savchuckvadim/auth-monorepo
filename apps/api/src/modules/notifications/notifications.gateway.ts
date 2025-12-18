import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: '/notifications',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly socketToUserId = new Map<string, string>();
    private readonly userIdToSockets = new Map<string, Set<string>>();

    async handleConnection(client: Socket) {
        // TODO: Получить userId из токена аутентификации
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        this.socketToUserId.set(client.id, userId);

        if (!this.userIdToSockets.has(userId)) {
            this.userIdToSockets.set(userId, new Set());
        }
        this.userIdToSockets.get(userId)!.add(client.id);

        // Подключаемся к комнате пользователя для уведомлений
        client.join(`user:${userId}`);

        console.log(`Notification socket connected: ${client.id} (user: ${userId})`);
    }

    handleDisconnect(client: Socket) {
        const userId = this.socketToUserId.get(client.id);

        if (userId) {
            const sockets = this.userIdToSockets.get(userId);
            if (sockets) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.userIdToSockets.delete(userId);
                }
            }
            this.socketToUserId.delete(client.id);
        }

        console.log(`Notification socket disconnected: ${client.id}`);
    }

    // Метод для отправки уведомления о новом подписчике
    notifyNewFollower(userId: string, follower: { id: string; name: string; email: string }) {
        this.server.to(`user:${userId}`).emit('notification:new-follower', {
            type: 'new-follower',
            follower,
            timestamp: new Date().toISOString(),
        });
    }

    // Метод для отправки уведомления о новом сообщении (если чат не открыт)
    notifyNewMessage(userId: string, message: { id: string; chatId: string; content: string; sender: { name: string } }) {
        this.server.to(`user:${userId}`).emit('notification:new-message', {
            type: 'new-message',
            message,
            timestamp: new Date().toISOString(),
        });
    }
}

