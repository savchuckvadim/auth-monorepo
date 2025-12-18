import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CallType } from 'generated/prisma';

export class UserCallDto {
    chatId: string;
    toUserId?: string;
    toSocketId?: string;
    offer: RTCSessionDescriptionInit;
    type?: CallType;
}

