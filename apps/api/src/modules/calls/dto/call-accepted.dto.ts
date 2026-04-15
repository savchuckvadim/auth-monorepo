import { IsOptional, IsString } from 'class-validator';

export class CallAcceptedDto {
    @IsString()
    toUserId: string;

    @IsOptional()
    @IsString()
    callId?: string;

    ans: RTCSessionDescriptionInit;
}
