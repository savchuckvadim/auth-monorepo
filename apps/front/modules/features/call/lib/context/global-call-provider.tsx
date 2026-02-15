'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
// import { useCall } from '../hook/call.hook'; // ✅ Отключен - используем только LiveKit
import { useLiveKitCall } from '../hook/livekit-call.hook';
import { CallErrorModal } from '../../ui/CallErrorModal';
import { useAppDispatch, useAppSelector } from '@/modules/app';
import { callActions } from '../../model/slice/CallSlice';
import { useAuth } from '@/modules/processes';
import { socketManager } from '@/modules/shared';
import { useEffect } from 'react';

interface GlobalCallContextValue {
    isInCall: boolean;
    callType: 'VIDEO' | 'AUDIO';
    myStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isAudioMute: boolean;
    isVideoOnHold: boolean;
    handleToggleAudio: () => void;
    handleToggleVideo: () => void;
    handleEndCall: () => void;
    handleCallUser: (otherUserId: string, chatId: string, type: 'VIDEO' | 'AUDIO') => Promise<void>;
    handleSaveHistory: () => void;
    isIncomingCall: boolean;
    acceptCall: () => void;
    rejectCall: () => void;
    incomingCallFromUserId: string | null; // ID звонящего пользователя (для входящих звонков)
    remoteUserId: string | null; // ID пользователя на другом конце звонка (для активных звонков)
    chatId: string | null; // ✅ ID чата для LiveKit комнаты
    // Все остальные значения из useCall
    [key: string]: any;
}

const GlobalCallContext = createContext<GlobalCallContextValue | null>(null);

interface GlobalCallProviderProps {
    children: ReactNode;
}

/**
 * Глобальный провайдер звонков для всего приложения
 * Слушает все входящие звонки независимо от того, где находится пользователь
 */
export const GlobalCallProvider: React.FC<GlobalCallProviderProps> = ({
    children,
}) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [activeOtherUserId, setActiveOtherUserId] = useState<string | null>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null); // ✅ chatId из входящего звонка или null
    const [isSocketReady, setIsSocketReady] = useState(false);

    // ✅ ВСЕГДА используем LiveKit для звонков (chatId всегда есть для звонков из чата)
    // WebRTC хук НЕ создаем вообще - полностью перешли на LiveKit

    // ✅ Используем упрощенный хук для LiveKit (БЕЗ WebRTC)
    const liveKitCall = useLiveKitCall({ chatId: activeChatId });

    // ✅ WebRTC хук НЕ создаем - полностью перешли на LiveKit
    // Если нужна обратная совместимость, можно раскомментировать:
    // const webRTCCall = useCall(null, 'AUDIO', activeChatId || 'temp-call');

    // ✅ ВСЕГДА используем LiveKit хук (БЕЗ WebRTC!)
    const call = liveKitCall;

    // Отслеживаем подключение сокета (оптимизировано - логируем только при изменении состояния)
    useEffect(() => {
        if (!isAuthenticated || !currentUser?.id) {
            setIsSocketReady(false);
            return;
        }

        // Проверяем подключение сокета
        const checkSocket = () => {
            const connected = socketManager.isConnected();
            setIsSocketReady(prev => {
                // Логируем только при изменении состояния
                if (prev !== connected && connected) {
                    console.log('✅ [GLOBAL CALL] Socket is ready');
                }
                return connected;
            });
        };

        // Проверяем сразу
        checkSocket();

        // Если сокет еще не подключен, проверяем периодически
        if (!socketManager.isConnected()) {
            const interval = setInterval(() => {
                checkSocket();
            }, 1000); // Увеличиваем интервал до 1 секунды

            // Очищаем интервал когда сокет подключится или через 10 секунд
            const timeout = setTimeout(() => {
                clearInterval(interval);
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [currentUser?.id, isAuthenticated]);

    const dispatch = useAppDispatch();
    const callState = useAppSelector((state) => state.call);

    // Слушаем все входящие звонки глобально
    // useEffect(() => {
    //     if (!currentUser?.id) {
    //         return;
    //     }

    //     // Проверяем подключение сокета
    //     if (!socketManager.isConnected()) {
    //         console.log('⚠️ [GLOBAL CALL] Socket not connected yet, waiting...');
    //         return;
    //     }

    // const socket = socketManager.getSocket();

    // const handleIncomingCall = (data: IncomingCallData) => {
    //     console.log('📞 [GLOBAL CALL] Received incoming call', data);
    //     // Устанавливаем otherUserId и chatId для активного звонка
    //     debugger
    //     setActiveOtherUserId(data.fromUserId);
    //     setIncomingCallFromUserId(data.fromUserId);
    //     debugger;
    //     if (data.chatId) {
    //         setActiveChatId(data.chatId);
    //     }
    // };

    // socket.on(CallEvent.INCOMING, handleIncomingCall);

    // return () => {
    //     socket.off(CallEvent.INCOMING, handleIncomingCall);
    // };
    // }, [currentUser?.id]);

    const handleCloseError = () => {
        dispatch(callActions.clearError());
    };

    const handleCallUser = async (otherUserId: string, chatId: string, type: 'VIDEO' | 'AUDIO') => {
        // ✅ ВСЕГДА используем LiveKit (БЕЗ WebRTC!)
        // chatId всегда есть для звонков из чата

        // ✅ Устанавливаем otherUserId и chatId для UI состояния
        setActiveOtherUserId(otherUserId);
        setActiveChatId(chatId);

        // ✅ Используем LiveKit хук (БЕЗ WebRTC!)
        console.log('📞 [GLOBAL CALL] Using LiveKit for call', { otherUserId, chatId, type });
        await liveKitCall.handleCallUser(otherUserId, chatId, type);

    };

    const handleEndCall = () => {
        // ✅ Используем правильный метод в зависимости от режима
        call.handleEndCall();

        // ✅ Сбрасываем после завершения звонка
        setActiveOtherUserId(null);
        setActiveChatId(null);
    };

    const acceptCall = () => {
        // ✅ КРИТИЧНО: Устанавливаем chatId и otherUserId ПЕРЕД вызовом call.acceptCall()
        // чтобы useLiveKitCall получил правильный chatId
        if (liveKitCall.incomingCallFromUserId) {
            // Получаем chatId из incomingCallData
            const incomingData = (liveKitCall as any).incomingCallData;
            if (incomingData?.chatId) {
                setActiveChatId(incomingData.chatId);
                console.log('✅ [GLOBAL CALL] Set chatId from incoming call BEFORE accept', {
                    chatId: incomingData.chatId,
                    fromUserId: incomingData.fromUserId
                });
            }
            // ✅ Устанавливаем otherUserId для UI
            if (incomingData?.fromUserId) {
                setActiveOtherUserId(incomingData.fromUserId);
            }
        }

        // ✅ Теперь вызываем acceptCall - chatId уже установлен
        call.acceptCall();
    };

    const rejectCall = () => {
        call.rejectCall();
        setActiveOtherUserId(null);
        setActiveChatId(null);
    };

    // ✅ Используем только LiveKit хук
    // Добавляем недостающие поля для совместимости с интерфейсом
    const contextValue: GlobalCallContextValue = {
        ...liveKitCall,
        // Добавляем недостающие поля для совместимости
        myStream: null, // LiveKit управляет медиа сам
        remoteStream: null, // LiveKit управляет медиа сам
        isAudioMute: false, // Управляется через LiveKitRoom (обновляется в CallOverlay)
        isVideoOnHold: false, // Управляется через LiveKitRoom (обновляется в CallOverlay)
        handleToggleAudio: () => { }, // Управляется через LiveKitRoom (в CallOverlay)
        handleToggleVideo: () => { }, // Управляется через LiveKitRoom (в CallOverlay)
        handleSaveHistory: () => { }, // TODO: реализовать для LiveKit
        chatId: activeChatId,
        handleCallUser,
        handleEndCall,
        acceptCall,
        rejectCall,
    };

    return (
        <GlobalCallContext.Provider value={contextValue}>
            {children}
            <CallErrorModal error={callState.error} onClose={handleCloseError} />
        </GlobalCallContext.Provider>
    );
};

export const useGlobalCallContext = () => {
    const context = useContext(GlobalCallContext);
    if (!context) {
        throw new Error('useGlobalCallContext must be used within GlobalCallProvider');
    }
    return context;
};

