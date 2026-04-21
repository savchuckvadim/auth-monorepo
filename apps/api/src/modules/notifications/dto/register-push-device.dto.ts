import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PushPlatform, PushProvider } from 'generated/prisma';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterPushDeviceDto {
    @ApiProperty({ enum: PushPlatform, enumName: 'PushPlatform' })
    @IsEnum(PushPlatform)
    platform: PushPlatform;

    @ApiProperty({ enum: PushProvider, enumName: 'PushProvider' })
    @IsEnum(PushProvider)
    provider: PushProvider;

    @ApiProperty({ type: String, example: 'fcm-or-apns-token' })
    @IsString()
    token: string;

    @ApiPropertyOptional({ type: String, example: 'ios-voip-token' })
    @IsOptional()
    @IsString()
    voipToken?: string;
}
