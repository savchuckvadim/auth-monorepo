import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core';
import { PushPlatform, PushProvider } from 'generated/prisma';
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
            `registerDevice:start userId=${userId} provider=${dto.provider} platform=${dto.platform} tokenPrefix=${this.tokenPrefix(dto.token)} voipTokenPrefix=${this.tokenPrefix(dto.voipToken)} installationId=${dto.installationId ?? 'none'}`,
        );

        if (dto.installationId) {
            const byInstallation = await this.prisma.pushDevice.findFirst({
                where: { userId, installationId: dto.installationId },
            });
            if (byInstallation) {
                this.logger.log(
                    `registerDevice:mode=updateByInstallation userId=${userId} pushDeviceId=${byInstallation.id}`,
                );
                const updated = await this.prisma.pushDevice.update({
                    where: { id: byInstallation.id },
                    data: {
                        platform: dto.platform,
                        provider: dto.provider,
                        token: dto.token,
                        voipToken: dto.voipToken,
                        installationId: dto.installationId,
                        isActive: true,
                        lastSeenAt: new Date(),
                    },
                });
                this.logger.log(
                    `registerDevice:done mode=updateByInstallation userId=${userId} pushDeviceId=${updated.id}`,
                );
                return updated;
            }
        }

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
                    installationId: dto.installationId ?? undefined,
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
                installationId: dto.installationId ?? null,
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

    /**
     * Hard-deletes a push device by its database id, scoped to the owning user.
     *
     * Called by the mobile client on logout so the backend stops dispatching
     * pushes to that installation immediately, instead of waiting for APNS/FCM
     * to report the token as unregistered (410 / NotRegistered) on next send.
     *
     * Idempotent: returns `{ success: true }` even if no row matches.
     */
    async removeDevice(userId: string, installationId: string) {
        const result = await this.prisma.pushDevice.deleteMany({
            where: { id: installationId, userId },
        });
        this.logger.log(
            `removeDevice userId=${userId} installationId=${installationId} deleted=${result.count}`,
        );
        return { success: true, deleted: result.count };
    }

    async getActiveDevicesForUser(userId: string) {
        return this.prisma.pushDevice.findMany({
            where: { userId, isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * All active mobile push devices (iOS + Android).
     *
     * Used for incoming-call delivery: a registered mobile device must
     * always receive a push (regardless of whether the user is online on web),
     * because mobile clients never receive incoming-call signaling via WS.
     */
    async getActiveMobilePushDevicesForUser(userId: string) {
        const devices = await this.prisma.pushDevice.findMany({
            where: {
                userId,
                isActive: true,
                platform: { in: [PushPlatform.IOS, PushPlatform.ANDROID] },
            },
            orderBy: { updatedAt: 'desc' },
        });
        this.logger.log(
            `getActiveMobilePushDevicesForUser userId=${userId} count=${devices.length} platforms=[${devices.map(d => d.platform).join(',')}] providers=[${devices.map(d => d.provider).join(',')}]`,
        );
        return devices;
    }

    async getActiveVoipDevicesForUser(userId: string) {
        const devices = await this.prisma.pushDevice.findMany({
            where: {
                userId,
                isActive: true,
                OR: [
                    { provider: PushProvider.APNS_VOIP },
                    // Some clients register APNS provider but pass dedicated voipToken.
                    { voipToken: { not: null } },
                ],
            },
            orderBy: { updatedAt: 'desc' },
        });
        this.logger.log(
            `getActiveVoipDevicesForUser userId=${userId} count=${devices.length} providers=[${devices.map(d => d.provider).join(',')}] voipTokenPresent=${devices.filter(d => Boolean(d.voipToken)).length}`,
        );
        return devices;
    }

    async deactivateToken(token: string) {
        await this.deactivateByPushCredential(token);
    }

    /**
     * Marks push device rows inactive when either the primary `token` or the
     * optional `voip_token` matches the credential that failed at APNS/FCM.
     */
    async deactivateByPushCredential(credential: string): Promise<void> {
        const result = await this.prisma.pushDevice.updateMany({
            where: {
                OR: [{ token: credential }, { voipToken: credential }],
            },
            data: { isActive: false },
        });
        this.logger.log(
            `deactivateByPushCredential tokenPrefix=${this.tokenPrefix(credential)} updated=${result.count}`,
        );
    }

    /**
     * Soft-deactivates push devices whose lastSeenAt is older than `maxAgeDays`.
     * Used by a daily cron so stale installations stop receiving pushes.
     */
    async deactivateStalePushDevices(maxAgeDays: number): Promise<number> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - maxAgeDays);
        const result = await this.prisma.pushDevice.updateMany({
            where: {
                isActive: true,
                lastSeenAt: { lt: cutoff },
            },
            data: { isActive: false },
        });
        if (result.count > 0) {
            this.logger.log(
                `deactivateStalePushDevices maxAgeDays=${maxAgeDays} cutoff=${cutoff.toISOString()} deactivated=${result.count}`,
            );
        }
        return result.count;
    }
}
