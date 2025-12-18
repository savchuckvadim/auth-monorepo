/**
 * Типы для WebRTC секретных чатов
 */

export interface IncomingCallData {
    from: string;
    fromUserId: string;
    callId: string;
    chatId: string;
    offer: RTCSessionDescriptionInit;
    type: 'VIDEO' | 'AUDIO';
}

export interface CallAcceptedData {
    from: string;
    ans: RTCSessionDescriptionInit;
}

export interface PeerNegoNeededData {
    from: string;
    offer: RTCSessionDescriptionInit;
}

export interface PeerNegoDoneData {
    from: string;
    ans: RTCSessionDescriptionInit;
}

export interface CallEndData {
    from: string;
}

export interface CallInitiatedData {
    from: string;
}

export interface UserCallData {
    toSocketId: string;
    toUserId: string;
    chatId: string;
    offer: RTCSessionDescriptionInit;
    type: 'VIDEO' | 'AUDIO';
}

export interface CallAcceptedEmitData {
    to: string;
    ans: RTCSessionDescriptionInit;
}

export interface PeerNegoNeededEmitData {
    to: string;
    offer: RTCSessionDescriptionInit;
}

export interface PeerNegoDoneEmitData {
    to: string;
    ans: RTCSessionDescriptionInit;
}

export interface CallEndEmitData {
    to: string;
}

export interface CallInitiatedEmitData {
    to: string;
}

export interface SecretChatMessage {
    id: string;
    content: string;
    senderId: string;
    timestamp: Date;
    encrypted?: boolean;
}

