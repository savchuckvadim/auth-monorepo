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
import { OnlineUsersService } from './services/room-storage.service';
import { CallsService } from './services/calls.service';
import { ChatsRepository } from '../chats/repositories/chats.repository';
import { CallRoomJoinDto } from './dto/room-join.dto';
import { UserCallDto } from './dto/user-call.dto';
import { CallAcceptedDto } from './dto/call-accepted.dto';
import { PeerNegoNeededDto, PeerNegoDoneDto } from './dto/peer-nego.dto';
import { CallEndDto } from './dto/call-end.dto';
import { CallInitiatedDto } from './dto/call-initiated.dto';
import { CallType, CallStatus } from 'generated/prisma';

@WebSocketGateway({
    namespace: '/calls',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class CallsGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly callIdMap = new Map<string, string>(); // socketId -> callId

    constructor(
        private readonly onlineUsersService: OnlineUsersService,
        private readonly callsService: CallsService,
        private readonly chatsRepository: ChatsRepository,
    ) { }

    async handleConnection(client: Socket) {
        // TODO: Получить userId из токена аутентификации
        // Пока используем query параметр для тестирования
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        this.onlineUsersService.setUser(userId, client.id);
        console.log(`Socket Connected: ${client.id} (user: ${userId})`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket Disconnected: ${client.id}`);
        this.onlineUsersService.removeUser(client.id);
        const callId = this.callIdMap.get(client.id);
        if (callId) {
            this.callIdMap.delete(client.id);
            // TODO: Обновить статус звонка в БД
        }
    }

    @SubscribeMessage('room:join')
    async handleRoomJoin(
        @MessageBody() data: CallRoomJoinDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            // Проверяем, что пользователь является участником чата
            const isMember = await this.chatsRepository.isMember(data.chatId, userId);
            if (!isMember) {
                return { error: 'You are not a member of this chat' };
            }

            client.join(`chat:${data.chatId}`);
            this.server.to(`chat:${data.chatId}`).emit('user:joined', { userId, socketId: client.id });

            return { success: true, chatId: data.chatId };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('user:call')
    async handleUserCall(
        @MessageBody() data: UserCallDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            // Создаём запись о звонке в БД
            const call = await this.callsService.createCall({
                chatId: data.chatId,
                initiatorId: userId,
                receiverId: data.toUserId,
                type: data.type || CallType.VIDEO,
            });

            this.callIdMap.set(client.id, call.id);

            // Находим socketId получателя (если не передан, ищем через userId)
            const receiverSocketId = data.toSocketId ||
                (data.toUserId ? this.onlineUsersService.getSocketIdByUserId(data.toUserId) : undefined);

            console.log('Finding receiver socket:', {
                toSocketId: data.toSocketId,
                toUserId: data.toUserId,
                foundSocketId: receiverSocketId,
            });

            if (receiverSocketId) {
                this.callIdMap.set(receiverSocketId, call.id);

                // Отправляем событие получателю
                this.server.to(receiverSocketId).emit('incoming:call', {
                    from: client.id,
                    fromUserId: userId,
                    callId: call.id,
                    chatId: data.chatId,
                    offer: data.offer,
                    type: data.type,
                });

                console.log(`Call event sent to socket: ${receiverSocketId}`);
            } else {
                console.warn(`Receiver socket not found for userId: ${data.toUserId}`);
                // Возвращаем ошибку, чтобы клиент знал
                return {
                    error: `User ${data.toUserId} is not online or not connected to calls namespace`,
                    callId: call.id
                };
            }

            return { success: true, callId: call.id };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('call:accepted')
    async handleCallAccepted(
        @MessageBody() data: CallAcceptedDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            const callId = this.callIdMap.get(data.toSocketId) || data.callId;
            if (callId) {
                await this.callsService.updateCallStatus(callId, CallStatus.ACCEPTED, new Date());
            }

            this.server.to(data.toSocketId).emit('call:accepted', {
                from: client.id,
                fromUserId: userId,
                callId,
                ans: data.ans,
            });

            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('peer:nego:needed')
    handlePeerNegoNeeded(
        @MessageBody() data: PeerNegoNeededDto,
        @ConnectedSocket() client: Socket,
    ) {
        const { to, offer } = data;
        this.server.to(to).emit('peer:nego:needed', { from: client.id, offer });
    }

    @SubscribeMessage('peer:nego:done')
    handlePeerNegoDone(
        @MessageBody() data: PeerNegoDoneDto,
        @ConnectedSocket() client: Socket,
    ) {
        const { to, ans } = data;
        this.server.to(to).emit('peer:nego:final', { from: client.id, ans });
    }

    @SubscribeMessage('call:end')
    async handleCallEnd(
        @MessageBody() data: CallEndDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            const callId = this.callIdMap.get(client.id) || data.callId;
            if (callId && data.duration) {
                await this.callsService.endCall(callId, data.duration);
                this.callIdMap.delete(client.id);
                if (data.toSocketId) {
                    this.callIdMap.delete(data.toSocketId);
                }
            }

            if (data.toSocketId) {
                this.server.to(data.toSocketId).emit('call:end', {
                    from: client.id,
                    fromUserId: userId,
                    callId,
                });
            }

            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage('call:initiated')
    handleCallInitiated(
        @MessageBody() data: CallInitiatedDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        if (data.toSocketId) {
            this.server.to(data.toSocketId).emit('call:initiated', {
                from: client.id,
                fromUserId: userId,
            });
        }

        return { success: true };
    }
}

