import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core';
import { PushProvider } from 'generated/prisma';
import { RegisterPushDeviceDto } from './dto/register-push-device.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly prisma: PrismaService) {}

    private tokenPrefix(token?: string | null): string {
        return token ? token.slice(0, 12) : 'none';
    }

    async registerDevice(userId: string, dto: RegisterPushDeviceDto) {
        this.logger.log(
            `registerDevice:start userId=${userId} provider=${dto.provider} platform=${dto.platform} tokenPrefix=${this.tokenPrefix(dto.token)} voipTokenPrefix=${this.tokenPrefix(dto.voipToken)}`,
        );

        const existing = await this.prisma.pushDevice.findUnique({
            where: { token: dto.token },
        });

        if (existing) {
            this.logger.log(
                `registerDevice:mode=update userId=${userId} provider=${dto.provider} platform=${dto.platform} tokenPrefix=${this.tokenPrefix(dto.token)}`,
            );
            const updated = await this.prisma.pushDevice.update({
                where: { token: dto.token },
                data: {
                    userId,
                    platform: dto.platform,
                    provider: dto.provider,
                    voipToken: dto.voipToken,
                    isActive: true,
                    lastSeenAt: new Date(),
                },
            });
            this.logger.log(
                `registerDevice:done mode=update userId=${userId} pushDeviceId=${updated.id}`,
            );
            return updated;
        }

        this.logger.log(
            `registerDevice:mode=create userId=${userId} provider=${dto.provider} platform=${dto.platform} tokenPrefix=${this.tokenPrefix(dto.token)}`,
        );
        const created = await this.prisma.pushDevice.create({
            data: {
                userId,
                platform: dto.platform,
                provider: dto.provider,
                token: dto.token,
                voipToken: dto.voipToken,
                isActive: true,
            },
        });
        this.logger.log(
            `registerDevice:done mode=create userId=${userId} pushDeviceId=${created.id}`,
        );
        return created;
    }

    async deactivateDevice(userId: string, token: string) {
        await this.prisma.pushDevice.updateMany({
            where: { userId, token, isActive: true },
            data: { isActive: false },
        });
        return { success: true };
    }

    async getActiveDevicesForUser(userId: string) {
        return this.prisma.pushDevice.findMany({
            where: { userId, isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getActiveVoipDevicesForUser(userId: string) {
        return this.prisma.pushDevice.findMany({
            where: {
                userId,
                isActive: true,
                provider: PushProvider.APNS_VOIP,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async deactivateToken(token: string) {
        await this.prisma.pushDevice.updateMany({
            where: { token },
            data: { isActive: false },
        });
    }
}
