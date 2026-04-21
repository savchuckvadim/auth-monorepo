import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CallEndedReason } from 'generated/prisma';

export class CallEndDto {
    @ApiProperty({ type: String })
    @IsString()
    toUserId: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    callId?: string;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsNumber()
    duration?: number;

    @ApiPropertyOptional({
        enum: CallEndedReason,
        enumName: 'CallEndedReason',
    })
    @IsOptional()
    @IsEnum(CallEndedReason)
    endedReason?: CallEndedReason;
}
