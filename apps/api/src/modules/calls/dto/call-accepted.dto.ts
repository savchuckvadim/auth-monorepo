import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CallAcceptedDto {
    @ApiProperty({ type: String })
    @IsString()
    toUserId: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    callId?: string;

    @ApiPropertyOptional({ type: Object })
    ans: RTCSessionDescriptionInit;
}
