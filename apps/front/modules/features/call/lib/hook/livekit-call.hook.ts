// useLiveKitCall.ts
// Упрощенный хук для LiveKit звонков (БЕЗ WebRTC)
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/modules/processes';
import { socketManager } from '@/modules/shared';
import { CallEvent } from '../type/call-event.type';
import { IncomingCallData } from '@/modules/features/call/lib/type/webrtc.types';

interface UseLiveKitCallOptions {
    chatId: string | null;
}

/**
 * Упрощенный хук для LiveKit звонков
 * НЕ использует WebRTC - только управление состоянием и socket события
 */
export const useLiveKitCall = ({ chatId }: UseLiveKitCallOptions) => {
    const { currentUser } = useAuth();
    const [isInCall, setIsInCall] = useState(false);
    const [callType, setCallType] = useState<'VIDEO' | 'AUDIO'>('AUDIO');
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);
    const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
    const [activeOtherUserId, setActiveOtherUserId] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);

    // Инициализация сокета
    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const initSocket = () => {
            if (!socketManager.isConnected()) {
                return false;
            }

            const s = socketManager.getSocket();
            setSocket(s);
            return true;
        };

        if (!initSocket()) {
            const interval = setInterval(() => {
                if (initSocket()) {
                    clearInterval(interval);
                }
            }, 100);

            const timeout = setTimeout(() => {
                clearInterval(interval);
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [currentUser?.id]);

    // Обработка входящих звонков
    useEffect(() => {
        if (!socket || !currentUser?.id) {
            return;
        }

        const handleIncomingCall = (data: IncomingCallData) => {
            console.log('📞 [LIVEKIT CALL] Incoming call received', {
                fromUserId: data.fromUserId,
                type: data.type,
                chatId: data.chatId,
                from: data.from
            });

            setIncomingCallData(data);
            setIsIncomingCall(true);
            setActiveOtherUserId(data.fromUserId);
            setCallType(data.type);

            // ✅ chatId будет установлен в GlobalCallProvider через acceptCall
        };

        socket.on(CallEvent.INCOMING, handleIncomingCall);

        return () => {
            socket.off(CallEvent.INCOMING, handleIncomingCall);
        };
    }, [socket, currentUser?.id]);

    // Обработка завершения звонка
    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleCallEnd = ({ from }: { from: string }) => {
            console.log('🔌 [LIVEKIT CALL] Call ended', { from });

            // Проверяем, что это наш звонок
            if (incomingCallData?.from === from || activeOtherUserId) {
                setIsInCall(false);
                setIsIncomingCall(false);
                setIncomingCallData(null);
                setRemoteUserId(null);
                setActiveOtherUserId(null);
            }
        };

        socket.on(CallEvent.END, handleCallEnd);

        return () => {
            socket.off(CallEvent.END, handleCallEnd);
        };
    }, [socket, incomingCallData, activeOtherUserId]);

    // Инициирование звонка
    const handleCallUser = useCallback(async (
        otherUserId: string,
        chatId: string,
        type: 'VIDEO' | 'AUDIO'
    ) => {
        console.log('📞 [LIVEKIT CALL] Initiating call', {
            otherUserId,
            chatId,
            type
        });

        setActiveOtherUserId(otherUserId);
        setRemoteUserId(otherUserId);
        setCallType(type);
        setIsInCall(true);
        setIsIncomingCall(false);

        // Отправляем событие инициации звонка через socket (для уведомления другого пользователя)
        if (socket) {
            socket.emit(CallEvent.INITIATE, {
                toUserId: otherUserId,
                chatId,
                type,
                // НЕ отправляем offer - LiveKit сам все сделает
            });
        }
    }, [socket]);

    // Принятие звонка
    const acceptCall = useCallback(() => {
        if (!incomingCallData) {
            console.warn('⚠️ [LIVEKIT CALL] No incoming call to accept');
            return;
        }

        console.log('✅ [LIVEKIT CALL] Accepting call', {
            fromUserId: incomingCallData.fromUserId,
            chatId: incomingCallData.chatId
        });

        // ✅ Устанавливаем все состояния ПЕРЕД установкой isInCall
        setRemoteUserId(incomingCallData.fromUserId);
        setActiveOtherUserId(incomingCallData.fromUserId); // ✅ Убеждаемся, что activeOtherUserId установлен
        setCallType(incomingCallData.type); // ✅ Устанавливаем тип звонка
        setIsIncomingCall(false);
        setIsInCall(true); // ✅ Устанавливаем isInCall в последнюю очередь

        // Отправляем событие принятия звонка
        if (socket) {
            socket.emit(CallEvent.ACCEPTED, {
                toUserId: incomingCallData.fromUserId,
                // НЕ отправляем answer - LiveKit сам все сделает
            });
        }
    }, [incomingCallData, socket]);

    // Отклонение звонка
    const rejectCall = useCallback(() => {
        if (!incomingCallData) {
            console.warn('⚠️ [LIVEKIT CALL] No incoming call to reject');
            return;
        }

        console.log('❌ [LIVEKIT CALL] Rejecting call', {
            fromUserId: incomingCallData.fromUserId
        });

        // Отправляем событие отклонения (через call:end)
        if (socket) {
            socket.emit(CallEvent.END, {
                toUserId: incomingCallData.fromUserId
            });
        }

        setIsIncomingCall(false);
        setIncomingCallData(null);
        setActiveOtherUserId(null);
    }, [incomingCallData, socket]);

    // Завершение звонка
    const handleEndCall = useCallback(() => {
        console.log('🔌 [LIVEKIT CALL] Ending call');

        // Отправляем событие завершения звонка
        if (socket && (activeOtherUserId || remoteUserId)) {
            const targetUserId = remoteUserId || activeOtherUserId;
            socket.emit(CallEvent.END, {
                toUserId: targetUserId
            });
        }

        setIsInCall(false);
        setIsIncomingCall(false);
        setIncomingCallData(null);
        setRemoteUserId(null);
        setActiveOtherUserId(null);
    }, [socket, activeOtherUserId, remoteUserId]);

    return {
        isInCall,
        callType,
        isIncomingCall,
        incomingCallFromUserId: incomingCallData?.fromUserId || null,
        remoteUserId: remoteUserId || activeOtherUserId,
        incomingCallData, // ✅ Экспортируем для доступа к chatId
        handleCallUser,
        acceptCall,
        rejectCall,
        handleEndCall,
    };
};
