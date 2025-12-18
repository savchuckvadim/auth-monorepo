export class CallAcceptedDto {
    toSocketId: string;
    callId?: string;
    ans: RTCSessionDescriptionInit;
}

