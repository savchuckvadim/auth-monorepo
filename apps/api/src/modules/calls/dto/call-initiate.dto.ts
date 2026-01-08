import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CallType } from 'generated/prisma';

export class CallInitiateDto {
    @IsString()
    chatId: string; // Обязательный - звонок всегда из чата

    @IsString()
    toUserId: string; // Обязательный

    offer: RTCSessionDescriptionInit;

    @IsOptional()
    @IsEnum(CallType)
    type?: CallType;
}

