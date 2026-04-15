import { IsString } from 'class-validator';

export class PeerNegoNeededDto {
    @IsString()
    toUserId: string;

    offer: RTCSessionDescriptionInit;
}

export class PeerNegoDoneDto {
    @IsString()
    toUserId: string;

    ans: RTCSessionDescriptionInit;
}
