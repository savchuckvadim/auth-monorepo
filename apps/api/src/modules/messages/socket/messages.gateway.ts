import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../services/messages.service';
import { ChatsRepository } from '../../chats/repositories/chats.repository';
import { CreateMessageDto } from '../dto';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SocketStorageService } from './socket-storage.service';

@Injectable()
@WebSocketGateway({
    namespace: '/messages',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class MessagesGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject(forwardRef(() => MessagesService))
        private readonly messagesService: MessagesService,
        private readonly chatsRepository: ChatsRepository,
        private readonly notificationsGateway: NotificationsGateway,
        private readonly socketStorage: SocketStorageService,
    ) {}

    async handleConnection(client: Socket) {
        // TODO: Получить userId из токена аутентификации
        // Пока используем query параметр для тестирования
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        // Сохраняем маппинги в Redis
        await this.socketStorage.setSocketUser(client.id, userId);
        await this.socketStorage.addUserSocket(userId, client.id);

        // Подключаемся ко всем чатам пользователя
        const chats = await this.chatsRepository.findByUserId(userId);
        chats.forEach(chat => {
            client.join(`chat:${chat.id}`);
            console.log(`✅ User ${userId} joined chat:${chat.id}`);
        });

        console.log(
            `Socket connected: ${client.id} (user: ${userId}), joined ${chats.length} chats`,
        );
    }

    async handleDisconnect(client: Socket) {
        // Удаляем маппинги из Redis
        const userId = await this.socketStorage.removeSocket(client.id);

        if (userId) {
            console.log(`Socket disconnected: ${client.id} (user: ${userId})`);
        } else {
            console.log(`Socket disconnected: ${client.id} (user not found)`);
        }
    }

    /**
     * Отправляет сообщение всем участникам чата через WebSocket
     * Вызывается после создания сообщения (через REST API или WebSocket)
     */
    async broadcastMessage(
        message: any,
        chatId: string,
        senderId: string,
    ): Promise<void> {
        // Проверяем, что WebSocket сервер инициализирован
        if (!this.server || !this.server.sockets) {
            console.warn(
                '⚠️ WebSocket server is not initialized, skipping broadcast',
            );
            return;
        }

        // Получаем участников чата для отправки уведомлений
        const chat = await this.chatsRepository.findById(chatId);
        const chatMembers = chat.members || [];

        // Отправляем сообщение всем участникам чата
        console.log(`📤 Sending message:new to room chat:${chatId}`);
        console.log(`📤 Message data:`, JSON.stringify(message, null, 2));

        // Получаем список сокетов в комнате для отладки
        const room = this.server.sockets.adapter?.rooms?.get(`chat:${chatId}`);
        console.log(`📤 Clients in room chat:${chatId}:`, room?.size || 0);

        // Отправляем в комнату чата
        this.server.to(`chat:${chatId}`).emit('message:new', message);

        // Также отправляем напрямую всем участникам чата (на случай если они не в комнате)
        if (this.server.sockets.sockets) {
            for (const member of chatMembers) {
                const memberSockets = await this.socketStorage.getUserSockets(
                    member.userId,
                );
                for (const socketId of memberSockets) {
                    const socket = this.server.sockets.sockets.get(socketId);
                    if (socket) {
                        console.log(
                            `📤 Sending directly to socket ${socketId} (user: ${member.userId})`,
                        );
                        socket.emit('message:new', message);
                    }
                }
            }
        }

        // Отправляем уведомления участникам, которые не в чате
        chatMembers.forEach(member => {
            if (member.userId !== senderId) {
                this.notificationsGateway.notifyNewMessage(member.userId, {
                    id: message.id,
                    chatId: chatId,
                    content: message.content,
                    sender: message.sender || { name: 'Пользователь' },
                });
            }
        });
    }

    @SubscribeMessage('message:send')
    async handleMessage(
        @MessageBody() data: CreateMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = await this.socketStorage.getSocketUser(client.id);

        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            const message = await this.messagesService.createMessage(
                userId,
                data,
            );

            // Отправляем сообщение через WebSocket
            // Примечание: createMessage уже вызывает broadcastMessage, но это не проблема
            // так как мы проверяем дубликаты на клиенте
            await this.broadcastMessage(message, data.chatId, userId);

            return { success: true, message };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('chat:join')
    async handleChatJoin(
        @MessageBody() data: { chatId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = await this.socketStorage.getSocketUser(client.id);

        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            const isMember = await this.chatsRepository.isMember(
                data.chatId,
                userId,
            );
            if (!isMember) {
                return { error: 'You are not a member of this chat' };
            }

            client.join(`chat:${data.chatId}`);
            console.log(
                `✅ User ${userId} (socket ${client.id}) joined chat:${data.chatId}`,
            );

            // Проверяем, что клиент действительно в комнате
            const room = this.server.sockets.adapter?.rooms?.get(
                `chat:${data.chatId}`,
            );
            console.log(
                `📊 Clients in room chat:${data.chatId} after join:`,
                room?.size || 0,
            );

            return { success: true, chatId: data.chatId };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('chat:leave')
    async handleChatLeave(
        @MessageBody() data: { chatId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(`chat:${data.chatId}`);
        return { success: true, chatId: data.chatId };
    }

    @SubscribeMessage('message:typing')
    async handleTyping(
        @MessageBody() data: { chatId: string; isTyping: boolean },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = await this.socketStorage.getSocketUser(client.id);

        if (!userId) {
            return { error: 'Unauthorized' };
        }

        // Отправляем событие всем участникам чата, кроме отправителя
        client.to(`chat:${data.chatId}`).emit('user:typing', {
            userId,
            chatId: data.chatId,
            isTyping: data.isTyping,
        });

        return { success: true };
    }
}
