'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { useCall } from '../hook/call.hook';
import { CallErrorModal } from '../../ui/CallErrorModal';
import { useAppDispatch, useAppSelector } from '@/modules/app';
import { callActions } from '../../model/slice/CallSlice';
import { useAuth } from '@/modules/processes';
import { socketManager } from '@/modules/shared';
import { CallEvent } from '../type/call-event.type';
import { IncomingCallData } from '@/modules/features/call/lib/type/webrtc.types';
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
    const [activeChatId, setActiveChatId] = useState<string>(''); // chatId из входящего звонка или пустая строка
    const [isSocketReady, setIsSocketReady] = useState(false);

    // Отслеживаем подключение сокета
    useEffect(() => {
        if (!isAuthenticated || !currentUser?.id) {
            setIsSocketReady(false);
            return;
        }

        // Проверяем подключение сокета
        const checkSocket = () => {
            const connected = socketManager.isConnected();
            setIsSocketReady(connected);
            if (connected) {
                console.log('✅ [GLOBAL CALL] Socket is ready');
            }
        };

        // Проверяем сразу
        checkSocket();

        // Если сокет еще не подключен, проверяем периодически
        if (!socketManager.isConnected()) {
            const interval = setInterval(() => {
                checkSocket();
            }, 100);

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

    // Используем useCall с null для глобального режима, но chatId обязателен
    // Создаем useCall только когда сокет готов, чтобы избежать проблем с инициализацией
    const call = useCall(
        activeOtherUserId,
        'AUDIO',
        activeChatId || 'temp-call'
    );

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
        // Устанавливаем otherUserId и chatId для UI состояния
        setActiveOtherUserId(otherUserId);
        setActiveChatId(chatId);

        // Используем прямой доступ к методам через call объект
        // Пересоздаем peer connection
        call.peerService.recreate();

        // Получаем медиа стрим - call содержит ...media, поэтому getMedia доступен
        const stream = await (call as any).getMedia(type);

        // Добавляем треки в peer connection
        stream.getTracks().forEach((track: MediaStreamTrack) => {
            call.peerService.addTrack(track, stream);
        });

        // Создаем offer
        const offer = await call.peerService.getOffer();

        // Вызываем callUser с параметрами напрямую (otherUserId и chatId передаются как параметры)
        await call.callUser(offer, type, otherUserId, chatId);
    };

    const handleEndCall = () => {
        call.handleEndCall();
        // Сбрасываем после завершения звонка
        setActiveOtherUserId(null);
        setActiveChatId('');
    };

    const acceptCall = () => {
        call.acceptCall();
        // otherUserId уже установлен из incoming call
    };

    const rejectCall = () => {
        call.rejectCall();
        setActiveOtherUserId(null);
        setActiveChatId('');
    };

    return (
        <GlobalCallContext.Provider value={{
            ...call,
            handleCallUser,
            handleEndCall,
            acceptCall,
            rejectCall,
            // incomingCallFromUserId и remoteUserId уже включены в ...call
        }}>
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

