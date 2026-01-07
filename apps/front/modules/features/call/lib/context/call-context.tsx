'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useCall } from '../hook/call.hook';
import { CallErrorModal } from '../../ui/CallErrorModal';
import { useAppDispatch, useAppSelector } from '@/modules/app';
import { callActions } from '../../model/slice/CallSlice';

interface CallContextValue {
    isInCall: boolean;
    callType: 'VIDEO' | 'AUDIO';
    myStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isAudioMute: boolean;
    isVideoOnHold: boolean;
    handleToggleAudio: () => void;
    handleToggleVideo: () => void;
    handleEndCall: () => void;
    handleCallUser: (type: 'VIDEO' | 'AUDIO') => Promise<void>;
    handleSaveHistory: () => void;
    // Все остальные значения из useCall
    [key: string]: any;
}

const CallContext = createContext<CallContextValue | null>(null);

interface CallProviderProps {
    chatId: string;
    otherUserId: string;
    defaultType?: 'VIDEO' | 'AUDIO';
    children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({
    chatId,
    otherUserId,
    defaultType = 'AUDIO',
    children,
}) => {
    const call = useCall(chatId, otherUserId, defaultType);
    const dispatch = useAppDispatch();
    const callState = useAppSelector((state) => state.call);

    const handleCloseError = () => {
        dispatch(callActions.clearError());
    };

    return (
        <CallContext.Provider value={call}>
            {children}
            <CallErrorModal error={callState.error} onClose={handleCloseError} />
        </CallContext.Provider>
    );
};

export const useCallContext = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCallContext must be used within CallProvider');
    }
    return context;
};

