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
import { CreateMessageDto, MessageDto } from '../dto';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketStorageService } from './socket-storage.service';
import {
    MessagesWsClientEvent,
    MessagesWsServerEvent,
    chatRoomId,
} from './messages-socket.constants';
import { ChatReadEvent, MessageCreatedEvent } from '../events/message.events';
import { MessageEvent } from '../type/message-event.type';
import { getErrorMessage } from '../lib/get-error-message';

/** Retransmit persisted message; clients decrypt when isEncrypted. */
type BroadcastMessage = Pick<
    MessageDto,
    | 'id'
    | 'content'
    | 'sender'
    | 'isEncrypted'
    | 'toDeviceId'
    | 'senderDeviceId'
    | 'senderClientDeviceId'
    | 'signalMessageType'
    | 'registrationId'
    | 'chatId'
    | 'senderId'
    | 'createdAt'
>;

@Injectable()
@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    },
})
export class MessagesGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messagesService: MessagesService,
        private readonly chatsRepository: ChatsRepository,
        private readonly notificationsGateway: NotificationsGateway,
        private readonly socketStorage: SocketStorageService,
    ) {}

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        await this.socketStorage.setSocketUser(client.id, userId);
        await this.socketStorage.addUserSocket(userId, client.id);

        const chats = await this.chatsRepository.findByUserId(userId);
        chats.forEach(chat => {
            void client.join(chatRoomId(chat.id));
        });
    }

    async handleDisconnect(client: Socket) {
        await this.socketStorage.removeSocket(client.id);
    }

    @OnEvent(MessageEvent.CREATED)
    async handleMessageCreated(event: MessageCreatedEvent): Promise<void> {
        const { message, chatId, senderId } = event;
        await this.broadcastMessage(message, chatId, senderId);
    }

    @OnEvent(MessageEvent.CHAT_READ)
    handleChatRead(event: ChatReadEvent): void {
        if (!this.server?.sockets) return;
        this.server
            .to(chatRoomId(event.chatId))
            .emit(MessagesWsServerEvent.CHAT_READ, {
                chatId: event.chatId,
                readerUserId: event.readerUserId,
            });
    }

    private async broadcastMessage(
        message: BroadcastMessage,
        chatId: string,
        senderId: string,
    ): Promise<void> {
        if (!this.server?.sockets) {
            return;
        }

        const chat = await this.chatsRepository.findById(chatId);
        const chatMembers = chat.members || [];
        const roomName = chatRoomId(chatId);

        this.server
            .to(roomName)
            .emit(MessagesWsServerEvent.NEW_MESSAGE, message);

        if (this.server.sockets.sockets) {
            for (const member of chatMembers) {
                const memberSockets = await this.socketStorage.getUserSockets(
                    member.userId,
                );
                for (const socketId of memberSockets) {
                    const socket = this.server.sockets.sockets.get(socketId);
                    if (socket) {
                        socket.emit(MessagesWsServerEvent.NEW_MESSAGE, message);
                    }
                }
            }
        }

        chatMembers.forEach(member => {
            if (member.userId !== senderId) {
                this.notificationsGateway.notifyNewMessage(member.userId, {
                    id: message.id,
                    chatId,
                    content: message.isEncrypted
                        ? '[E2EE message]'
                        : message.content,
                    sender: message.sender || { name: 'Пользователь' },
                });
            }
        });
    }

    @SubscribeMessage(MessagesWsClientEvent.SEND)
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
            return { success: true, message };
        } catch (error) {
            return { error: getErrorMessage(error) };
        }
    }

    @SubscribeMessage(MessagesWsClientEvent.CHAT_JOIN)
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

            void client.join(chatRoomId(data.chatId));
            return { success: true, chatId: data.chatId };
        } catch (error) {
            return { error: getErrorMessage(error) };
        }
    }

    @SubscribeMessage(MessagesWsClientEvent.CHAT_LEAVE)
    handleChatLeave(
        @MessageBody() data: { chatId: string },
        @ConnectedSocket() client: Socket,
    ) {
        void client.leave(chatRoomId(data.chatId));
        return { success: true, chatId: data.chatId };
    }

    @SubscribeMessage(MessagesWsClientEvent.MESSAGE_TYPING)
    async handleTyping(
        @MessageBody() data: { chatId: string; isTyping: boolean },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = await this.socketStorage.getSocketUser(client.id);

        if (!userId) {
            return { error: 'Unauthorized' };
        }

        client
            .to(chatRoomId(data.chatId))
            .emit(MessagesWsServerEvent.USER_TYPING, {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping,
            });

        return { success: true };
    }
}
