import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CallInitiatedDto {
    @ApiProperty({ type: String })
    @IsString()
    toUserId: string;
}
