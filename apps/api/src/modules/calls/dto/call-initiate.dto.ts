import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CallType } from 'generated/prisma';

export class CallInitiateDto {
    @ApiProperty({ type: String })
    @IsString()
    chatId: string; // Обязательный - звонок всегда из чата

    @ApiProperty({ type: String })
    @IsString()
    toUserId: string; // Обязательный

    @ApiPropertyOptional({ type: Object })
    offer: RTCSessionDescriptionInit;

    @ApiPropertyOptional({ enum: CallType, enumName: 'CallType' })
    @IsOptional()
    @IsEnum(CallType)
    type?: CallType;
}
