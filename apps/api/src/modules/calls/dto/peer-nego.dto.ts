import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PeerNegoNeededDto {
    @ApiProperty({ type: String })
    @IsString()
    toUserId: string;

    @ApiPropertyOptional({ type: Object })
    offer: RTCSessionDescriptionInit;
}

export class PeerNegoDoneDto {
    @ApiProperty({ type: String })
    @IsString()
    toUserId: string;

    @ApiPropertyOptional({ type: Object })
    ans: RTCSessionDescriptionInit;
}
