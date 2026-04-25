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

    @ApiPropertyOptional({
        description:
            'Stable id of this app installation (e.g. UUID in SecureStore). ' +
            'When set, register upserts by (userId, installationId) so the same ' +
            'physical device keeps one PushDevice row when FCM/APNS tokens rotate.',
        example: '7b2c9f1a-4e3d-4c1b-9f0a-1234567890ab',
    })
    @IsOptional()
    @IsString()
    installationId?: string;
}
