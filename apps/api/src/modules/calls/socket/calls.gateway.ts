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
import { OnlineUsersService } from '../services/online-users.service';
import { CallsService } from '../services/calls.service';
import { CallInitiateDto } from '../dto/call-initiate.dto';
import { CallAcceptedDto } from '../dto/call-accepted.dto';
import { PeerNegoNeededDto, PeerNegoDoneDto } from '../dto/peer-nego.dto';
import { CallEndDto } from '../dto/call-end.dto';
import { CallInitiatedDto } from '../dto/call-initiated.dto';
import { CallType, CallStatus } from 'generated/prisma';
import { CallEvent } from '../type/call-event.type';

@WebSocketGateway({
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
    ) { }

    async handleConnection(client: Socket) {
        // TODO: Получить userId из токена аутентификации
        // Пока используем query параметр для тестирования
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        // Сохраняем маппинг userId <-> socketId
        this.onlineUsersService.setUser(userId, client.id);

        // Добавляем в персональную комнату (как в PostGateway)
        if (userId) {
            client.join(`user:${userId}`);
        }

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

    @SubscribeMessage(CallEvent.INITIATE)
    async handleCallInitiate(
        @MessageBody() data: CallInitiateDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        if (!data.toUserId) {
            return { error: 'toUserId is required' };
        }

        try {
            // Создаём запись о звонке в БД (chatId опциональный для истории)
            const call = await this.callsService.createCall({
                chatId: data.chatId,
                initiatorId: userId,
                receiverId: data.toUserId,
                type: data.type || CallType.VIDEO,
            });

            this.callIdMap.set(client.id, call.id);

            // Отправляем в комнату пользователя (Socket.IO сам проверит онлайн статус)
            this.server.to(`user:${data.toUserId}`).emit(CallEvent.INCOMING, {
                from: client.id,
                fromUserId: userId,
                callId: call.id,
                chatId: data.chatId,
                offer: data.offer,
                type: data.type,
            });

            console.log(`Call event sent to user:${data.toUserId} (callId: ${call.id})`);

            return { success: true, callId: call.id };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage(CallEvent.ACCEPTED)
    async handleCallAccepted(
        @MessageBody() data: CallAcceptedDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        try {
            // Ищем callId по toUserId
            let callId = data.callId;
            if (!callId) {
                const receiverSocketId = this.onlineUsersService.getSocketIdByUserId(data.toUserId);
                if (receiverSocketId) {
                    callId = this.callIdMap.get(receiverSocketId);
                }
            }

            if (callId) {
                await this.callsService.updateCallStatus(callId, CallStatus.ACCEPTED, new Date());
            }

            // Отправляем в комнату пользователя
            this.server.to(`user:${data.toUserId}`).emit(CallEvent.ACCEPTED, {
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

    @SubscribeMessage(CallEvent.PEER_NEGO_NEEDED)
    handlePeerNegoNeeded(
        @MessageBody() data: PeerNegoNeededDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.server.to(`user:${data.toUserId}`).emit(CallEvent.PEER_NEGO_NEEDED, {
            from: client.id,
            offer: data.offer
        });
    }

    @SubscribeMessage(CallEvent.PEER_NEGO_FINAL)
    handlePeerNegoDone(
        @MessageBody() data: PeerNegoDoneDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.server.to(`user:${data.toUserId}`).emit(CallEvent.PEER_NEGO_FINAL, {
            from: client.id,
            ans: data.ans
        });
    }

    @SubscribeMessage(CallEvent.END)
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
            }

            // Отправляем в комнату пользователя
            this.server.to(`user:${data.toUserId}`).emit(CallEvent.END, {
                from: client.id,
                fromUserId: userId,
                callId,
            });

            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    @SubscribeMessage(CallEvent.INITIATED)
    handleCallInitiated(
        @MessageBody() data: CallInitiatedDto,
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        // Отправляем в комнату пользователя
        this.server.to(`user:${data.toUserId}`).emit(CallEvent.INITIATED, {
            from: client.id,
            fromUserId: userId,
        });

        return { success: true };
    }

    @SubscribeMessage(CallEvent.PEER_ICE_CANDIDATE)
    handlePeerIceCandidate(
        @MessageBody() data: { toUserId: string; candidate: RTCIceCandidateInit },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        // Пересылаем ICE candidate другому пиру
        this.server.to(`user:${data.toUserId}`).emit(CallEvent.PEER_ICE_CANDIDATE, {
            from: client.id,
            candidate: data.candidate,
        });

        return { success: true };
    }
}

