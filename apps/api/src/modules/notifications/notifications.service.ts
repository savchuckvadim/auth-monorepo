import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core';
import { PushProvider } from 'generated/prisma';
import { RegisterPushDeviceDto } from './dto/register-push-device.dto';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async registerDevice(userId: string, dto: RegisterPushDeviceDto) {
        const existing = await this.prisma.pushDevice.findUnique({
            where: { token: dto.token },
        });

        if (existing) {
            return this.prisma.pushDevice.update({
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
        }

        return this.prisma.pushDevice.create({
            data: {
                userId,
                platform: dto.platform,
                provider: dto.provider,
                token: dto.token,
                voipToken: dto.voipToken,
                isActive: true,
            },
        });
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
