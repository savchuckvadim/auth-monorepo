import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CallEndedReason, CallStatus, CallType } from 'generated/prisma';

class CallHistoryUserDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    name: string;
}

export class CallHistoryItemDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    chatId: string;

    @ApiProperty({ enum: CallType, enumName: 'CallType' })
    type: CallType;

    @ApiProperty({ enum: CallStatus, enumName: 'CallStatus' })
    status: CallStatus;

    @ApiPropertyOptional({
        enum: CallEndedReason,
        enumName: 'CallEndedReason',
    })
    endedReason?: CallEndedReason | null;

    @ApiProperty({ type: String })
    initiatorId: string;

    @ApiPropertyOptional({ type: String })
    receiverId?: string | null;

    @ApiPropertyOptional({ type: Number })
    duration?: number | null;

    @ApiPropertyOptional({ type: Date })
    startedAt?: Date | null;

    @ApiPropertyOptional({ type: Date })
    endedAt?: Date | null;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: () => CallHistoryUserDto })
    initiator: CallHistoryUserDto;

    @ApiPropertyOptional({ type: () => CallHistoryUserDto })
    receiver?: CallHistoryUserDto | null;
}
