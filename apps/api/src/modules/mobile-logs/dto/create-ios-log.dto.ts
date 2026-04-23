import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateIosLogDto {
    @ApiProperty({ example: 'error', description: 'Log level from iOS app' })
    @IsString()
    @MaxLength(32)
    level: string;

    @ApiProperty({ example: 'Push registration failed' })
    @IsString()
    @MaxLength(4000)
    message: string;

    @ApiPropertyOptional({ example: 'PushManager' })
    @IsOptional()
    @IsString()
    @MaxLength(128)
    scope?: string;

    @ApiPropertyOptional({ example: 'ios' })
    @IsOptional()
    @IsString()
    @MaxLength(32)
    platform?: string;

    @ApiPropertyOptional({ example: '1.2.3' })
    @IsOptional()
    @IsString()
    @MaxLength(64)
    appVersion?: string;

    @ApiPropertyOptional({ example: 'iPhone15,3' })
    @IsOptional()
    @IsString()
    @MaxLength(128)
    deviceModel?: string;

    @ApiPropertyOptional({ example: '17.5.1' })
    @IsOptional()
    @IsString()
    @MaxLength(64)
    osVersion?: string;

    @ApiPropertyOptional({
        type: [String],
        example: ['push', 'apns', 'register'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Additional context for debugging',
        example: { requestId: 'abc-123', endpoint: '/auth-mobile/refresh' },
    })
    @IsOptional()
    @IsObject()
    context?: Record<string, unknown>;
}
