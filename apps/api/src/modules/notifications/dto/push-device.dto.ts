import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PushPlatform, PushProvider } from 'generated/prisma';

export class PushDeviceDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    userId: string;

    @ApiPropertyOptional({ type: String })
    installationId?: string;

    @ApiProperty({ enum: PushPlatform, enumName: 'PushPlatform' })
    platform: PushPlatform;

    @ApiProperty({ enum: PushProvider, enumName: 'PushProvider' })
    provider: PushProvider;

    @ApiProperty({ type: String })
    token: string;

    @ApiPropertyOptional({ type: String })
    voipToken?: string;

    @ApiProperty({ type: Boolean })
    isActive: boolean;

    @ApiProperty({ type: Date })
    lastSeenAt: Date;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}
