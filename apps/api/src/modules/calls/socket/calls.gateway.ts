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
import { CallType, CallStatus, CallEndedReason } from 'generated/prisma';
import { CallEvent } from '../type/call-event.type';
import { PushDispatchService } from '@/modules/notifications/push/push-dispatch.service';
import { MessagesService } from '@/modules/messages/services/messages.service';

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);
const MISSED_REASON: CallEndedReason = 'MISSED';
const ACCEPTED_REASON: CallEndedReason = 'ACCEPTED';
const REJECTED_REASON: CallEndedReason = 'REJECTED';
const CANCELED_REASON: CallEndedReason = 'CANCELED';
const FAILED_REASON: CallEndedReason = 'FAILED';
const TIMEOUT_REASON: CallEndedReason = 'TIMEOUT';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly callIdMap = new Map<string, string>(); // socketId -> callId
    private readonly callTimeoutMap = new Map<string, NodeJS.Timeout>();

    constructor(
        private readonly onlineUsersService: OnlineUsersService,
        private readonly callsService: CallsService,
        private readonly pushDispatchService: PushDispatchService,
        private readonly messagesService: MessagesService,
    ) {}

    handleConnection(client: Socket): void {
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
            void client.join(`user:${userId}`);
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

            if (!this.onlineUsersService.isUserOnline(data.toUserId)) {
                await this.pushDispatchService.sendIncomingCallVoip(
                    data.toUserId,
                    {
                        title: 'Incoming call',
                        body: 'You have an incoming call',
                        data: {
                            type: 'incoming_call',
                            callId: call.id,
                            chatId: data.chatId,
                            fromUserId: userId,
                            callType: data.type || CallType.VIDEO,
                        },
                    },
                );
            }

            const timer = setTimeout(() => {
                void (async () => {
                    try {
                        await this.callsService.markMissed(call.id);
                        await this.createCallHistorySystemMessage(
                            call.chatId,
                            call.initiatorId,
                            MISSED_REASON,
                            undefined,
                            call.id,
                        );
                    } finally {
                        this.callTimeoutMap.delete(call.id);
                    }
                })();
            }, 45000);
            this.callTimeoutMap.set(call.id, timer);

            console.log(
                `Call event sent to user:${data.toUserId} (callId: ${call.id})`,
            );

            return { success: true, callId: call.id };
        } catch (error) {
            return { error: getErrorMessage(error) };
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
                const receiverSocketId =
                    this.onlineUsersService.getSocketIdByUserId(data.toUserId);
                if (receiverSocketId) {
                    callId = this.callIdMap.get(receiverSocketId);
                }
            }

            if (callId) {
                // const call = await this.callsService.getCallById(callId);
                const timeout = this.callTimeoutMap.get(callId);
                if (timeout) {
                    clearTimeout(timeout);
                    this.callTimeoutMap.delete(callId);
                }
                await this.callsService.updateCallStatus(
                    callId,
                    CallStatus.ACCEPTED,
                    new Date(),
                );
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
            return { error: getErrorMessage(error) };
        }
    }

    @SubscribeMessage(CallEvent.PEER_NEGO_NEEDED)
    handlePeerNegoNeeded(
        @MessageBody() data: PeerNegoNeededDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.server
            .to(`user:${data.toUserId}`)
            .emit(CallEvent.PEER_NEGO_NEEDED, {
                from: client.id,
                offer: data.offer,
            });
    }

    @SubscribeMessage(CallEvent.PEER_NEGO_FINAL)
    handlePeerNegoDone(
        @MessageBody() data: PeerNegoDoneDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.server
            .to(`user:${data.toUserId}`)
            .emit(CallEvent.PEER_NEGO_FINAL, {
                from: client.id,
                ans: data.ans,
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
            if (callId) {
                const call = await this.callsService.getCallById(callId);
                const timeout = this.callTimeoutMap.get(callId);
                if (timeout) {
                    clearTimeout(timeout);
                    this.callTimeoutMap.delete(callId);
                }
                const resolvedReason: CallEndedReason = this.resolveEndedReason(
                    data.endedReason,
                    call?.status,
                );
                await this.callsService.endCallWithReason(
                    callId,
                    resolvedReason,
                    data.duration,
                );
                await this.createCallHistorySystemMessage(
                    call?.chatId,
                    userId,
                    resolvedReason,
                    data.duration,
                    callId,
                );
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
            return { error: getErrorMessage(error) };
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
        @MessageBody()
        data: { toUserId: string; candidate: RTCIceCandidateInit },
        @ConnectedSocket() client: Socket,
    ) {
        const userId = this.onlineUsersService.getUserIdBySocketId(client.id);
        if (!userId) {
            return { error: 'Unauthorized' };
        }

        // Пересылаем ICE candidate другому пиру
        this.server
            .to(`user:${data.toUserId}`)
            .emit(CallEvent.PEER_ICE_CANDIDATE, {
                from: client.id,
                candidate: data.candidate,
            });

        return { success: true };
    }

    private async createCallHistorySystemMessage(
        chatId: string | undefined,
        actorUserId: string,
        reason: CallEndedReason,
        duration?: number,
        callId?: string,
    ): Promise<void> {
        if (!chatId) return;
        if (await this.callsService.isSecretChat(chatId)) return;

        let initiatorId = actorUserId;
        let callType: 'audio' | 'video' = 'video';
        if (callId) {
            try {
                const call = await this.callsService.getCallById(callId);
                if (call) {
                    initiatorId = call.initiatorId;
                    callType = call.type === CallType.AUDIO ? 'audio' : 'video';
                }
            } catch {
                /* ignore */
            }
        }

        const reasonMap: Record<
            CallEndedReason,
            | 'missed'
            | 'accepted'
            | 'rejected'
            | 'canceled'
            | 'timeout'
            | 'failed'
        > = {
            MISSED: 'missed',
            ACCEPTED: 'accepted',
            REJECTED: 'rejected',
            CANCELED: 'canceled',
            TIMEOUT: 'timeout',
            FAILED: 'failed',
        };

        const time = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const durationLabel =
            typeof duration === 'number' && duration > 0
                ? `, длительность ${duration}с`
                : '';
        const fallbackText = (() => {
            switch (reason) {
                case ACCEPTED_REASON:
                    return `Звонок состоялся в ${time}${durationLabel}`;
                case REJECTED_REASON:
                    return `Звонок отклонен в ${time}`;
                case MISSED_REASON:
                    return `Пропущенный звонок в ${time}`;
                case CANCELED_REASON:
                    return `Недозвонились в ${time}`;
                case FAILED_REASON:
                    return `Звонок не удался в ${time}`;
                case TIMEOUT_REASON:
                    return `Звонок завершен по таймауту в ${time}`;
                default:
                    return `Звонок завершен в ${time}`;
            }
        })();

        const metadata: Record<string, unknown> = {
            reason: reasonMap[reason] ?? 'failed',
            callType,
            initiatorId,
            ...(callId ? { callId } : {}),
            ...(typeof duration === 'number' && duration > 0
                ? { durationMs: duration * 1000 }
                : {}),
        };

        try {
            await this.messagesService.createCallEventMessage({
                userId: actorUserId,
                chatId,
                content: fallbackText,
                metadata,
            });
        } catch (error) {
            console.error(error);
            // Do not fail signaling if timeline write fails.
        }
    }

    private resolveEndedReason(
        payloadReason: unknown,
        currentStatus?: CallStatus | null,
    ): CallEndedReason {
        if (this.isCallEndedReason(payloadReason)) {
            return payloadReason;
        }

        if (currentStatus === CallStatus.ACCEPTED) {
            return ACCEPTED_REASON;
        }

        return CANCELED_REASON;
    }

    private isCallEndedReason(value: unknown): value is CallEndedReason {
        if (typeof value !== 'string') {
            return false;
        }

        return Object.values(CallEndedReason).includes(
            value as CallEndedReason,
        );
    }
}
