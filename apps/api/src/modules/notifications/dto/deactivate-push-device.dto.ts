import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeactivatePushDeviceDto {
    @ApiProperty({ type: String, example: 'fcm-or-apns-token' })
    @IsString()
    token: string;
}
