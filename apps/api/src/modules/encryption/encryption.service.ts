import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core';
import { RegisterDeviceDto } from './dto/register-device.dto';
import {
    UpdateDeviceKeysDto,
    UploadOneTimePreKeysDto,
} from './dto/update-device-keys.dto';
import { createHash } from 'crypto';

@Injectable()
export class EncryptionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {}

    private assertE2eeEnabled(): void {
        const v = this.config.get<string>('E2EE_ENABLED');
        if (v === 'false' || v === '0') {
            throw new BadRequestException('E2EE is disabled on this server');
        }
    }

    /** Used when sending or registering keys for Signal messenger E2EE. */
    assertServerAllowsE2eeMessaging(): void {
        this.assertE2eeEnabled();
    }

    async registerDevice(userId: string, dto: RegisterDeviceDto) {
        this.assertE2eeEnabled();
        const existing = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId: dto.clientDeviceId },
        });
        if (existing) {
            throw new BadRequestException('Device already registered');
        }

        const device = await this.prisma.device.create({
            data: {
                userId,
                clientDeviceId: dto.clientDeviceId,
                name: dto.name ?? null,
                type: dto.type,
                registrationId: dto.registrationId,
                identityKey: dto.identityKey,
                signedPreKey: dto.signedPreKey,
                signedPreKeySig: dto.signedPreKeySig,
                preKeys: {
                    create: dto.preKeys.map(pk => ({
                        keyId: pk.keyId,
                        publicKey: pk.publicKey,
                    })),
                },
                otPreKeys: {
                    create: dto.oneTimePreKeys.map(pk => ({
                        keyId: pk.keyId,
                        publicKey: pk.publicKey,
                    })),
                },
            },
        });

        return {
            success: true,
            id: device.id,
            clientDeviceId: device.clientDeviceId,
        };
    }

    async listMyDevices(userId: string) {
        return this.prisma.device.findMany({
            where: { userId },
            select: {
                id: true,
                clientDeviceId: true,
                name: true,
                type: true,
                lastSeenAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async deleteDevice(userId: string, clientDeviceId: string) {
        const device = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId },
        });
        if (!device) {
            throw new NotFoundException('Device not found');
        }
        await this.prisma.device.delete({ where: { id: device.id } });
        return { success: true };
    }

    async updateDeviceKeys(
        userId: string,
        clientDeviceId: string,
        dto: UpdateDeviceKeysDto,
    ) {
        this.assertE2eeEnabled();
        const device = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId },
        });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        await this.prisma.$transaction(async tx => {
            if (dto.signedPreKey && dto.signedPreKeySig) {
                await tx.device.update({
                    where: { id: device.id },
                    data: {
                        signedPreKey: dto.signedPreKey,
                        signedPreKeySig: dto.signedPreKeySig,
                    },
                });
            }
            if (dto.preKeys?.length) {
                await tx.preKey.createMany({
                    data: dto.preKeys.map(pk => ({
                        deviceId: device.id,
                        keyId: pk.keyId,
                        publicKey: pk.publicKey,
                    })),
                    skipDuplicates: true,
                });
            }
            if (dto.oneTimePreKeys?.length) {
                await tx.oneTimePreKey.createMany({
                    data: dto.oneTimePreKeys.map(pk => ({
                        deviceId: device.id,
                        keyId: pk.keyId,
                        publicKey: pk.publicKey,
                    })),
                    skipDuplicates: true,
                });
            }
        });

        return { success: true };
    }

    async uploadOneTimePreKeys(
        userId: string,
        clientDeviceId: string,
        dto: UploadOneTimePreKeysDto,
    ) {
        this.assertE2eeEnabled();
        const device = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId },
        });
        if (!device) {
            throw new NotFoundException('Device not found');
        }
        await this.prisma.oneTimePreKey.createMany({
            data: dto.oneTimePreKeys.map(pk => ({
                deviceId: device.id,
                keyId: pk.keyId,
                publicKey: pk.publicKey,
            })),
            skipDuplicates: true,
        });
        return { success: true, count: dto.oneTimePreKeys.length };
    }

    async getOneTimePreKeyCount(userId: string, clientDeviceId: string) {
        const device = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId },
        });
        if (!device) {
            throw new NotFoundException('Device not found');
        }
        const count = await this.prisma.oneTimePreKey.count({
            where: { deviceId: device.id, usedAt: null },
        });
        return { count };
    }

    /**
     * Bundles for all devices of a user (multi-device).
     */
    async getPreKeyBundlesForUser(targetUserId: string, requesterId: string) {
        if (targetUserId !== requesterId) {
            // Public key material; still require authenticated user
            void requesterId;
        }
        const devices = await this.prisma.device.findMany({
            where: { userId: targetUserId },
            include: {
                preKeys: true,
                otPreKeys: { where: { usedAt: null }, take: 1 },
            },
        });

        const result: Array<{
            id: string;
            clientDeviceId: string;
            identityKey: string;
            registrationId: number;
            signedPreKey: {
                keyId: number;
                publicKey: string;
                signature: string;
            };
            preKey?: { keyId: number; publicKey: string };
        }> = [];

        for (const d of devices) {
            const signedKeyId = 1;
            const ot = d.otPreKeys[0];
            let preKey: { keyId: number; publicKey: string } | undefined;
            if (ot) {
                await this.prisma.oneTimePreKey.update({
                    where: { id: ot.id },
                    data: { usedAt: new Date() },
                });
                preKey = { keyId: ot.keyId, publicKey: ot.publicKey };
            } else {
                const fallback = d.preKeys[0];
                if (fallback) {
                    preKey = {
                        keyId: fallback.keyId,
                        publicKey: fallback.publicKey,
                    };
                }
            }

            result.push({
                id: d.id,
                clientDeviceId: d.clientDeviceId,
                identityKey: d.identityKey,
                registrationId: d.registrationId,
                signedPreKey: {
                    keyId: signedKeyId,
                    publicKey: d.signedPreKey,
                    signature: d.signedPreKeySig,
                },
                ...(preKey ? { preKey } : {}),
            });
        }

        return result;
    }

    async getPreKeyBundleForDevice(
        targetUserId: string,
        clientDeviceId: string,
        requesterId: string,
    ) {
        void requesterId;
        const d = await this.prisma.device.findFirst({
            where: { userId: targetUserId, clientDeviceId },
            include: {
                preKeys: true,
                otPreKeys: { where: { usedAt: null }, take: 1 },
            },
        });
        if (!d) {
            throw new NotFoundException('Device not found');
        }

        const signedKeyId = 1;
        const ot = d.otPreKeys[0];
        let preKey: { keyId: number; publicKey: string } | undefined;
        if (ot) {
            await this.prisma.oneTimePreKey.update({
                where: { id: ot.id },
                data: { usedAt: new Date() },
            });
            preKey = { keyId: ot.keyId, publicKey: ot.publicKey };
        } else {
            const fallback = d.preKeys[0];
            if (fallback) {
                preKey = {
                    keyId: fallback.keyId,
                    publicKey: fallback.publicKey,
                };
            }
        }

        return {
            id: d.id,
            clientDeviceId: d.clientDeviceId,
            identityKey: d.identityKey,
            registrationId: d.registrationId,
            signedPreKey: {
                keyId: signedKeyId,
                publicKey: d.signedPreKey,
                signature: d.signedPreKeySig,
            },
            ...(preKey ? { preKey } : {}),
        };
    }

    async getFingerprints(userId: string) {
        const devices = await this.prisma.device.findMany({
            where: { userId },
            select: { clientDeviceId: true, identityKey: true },
        });
        return devices.map(d => ({
            clientDeviceId: d.clientDeviceId,
            fingerprint: createHash('sha256')
                .update(d.identityKey, 'utf8')
                .digest('hex')
                .slice(0, 32),
        }));
    }

    async touchDevice(userId: string, clientDeviceId: string) {
        const device = await this.prisma.device.findFirst({
            where: { userId, clientDeviceId },
        });
        if (!device) {
            throw new ForbiddenException();
        }
        await this.prisma.device.update({
            where: { id: device.id },
            data: { lastSeenAt: new Date() },
        });
    }

    /**
     * Ensures ciphertext target device belongs to a chat member (sender may target own devices).
     */
    async assertDeviceIsAllowedMessageTarget(
        chatId: string,
        toDeviceId: string,
    ): Promise<void> {
        const device = await this.prisma.device.findUnique({
            where: { id: toDeviceId },
        });
        if (!device) {
            throw new BadRequestException('Unknown target device');
        }
        const member = await this.prisma.chatMember.findFirst({
            where: {
                chatId,
                userId: device.userId,
                leftAt: null,
            },
        });
        if (!member) {
            throw new ForbiddenException(
                'Target device owner is not a member of this chat',
            );
        }
    }

    /** Ensures the device row belongs to the sender (outgoing E2EE metadata). */
    async assertSenderDeviceBelongsToUser(
        userId: string,
        senderDeviceId: string,
    ): Promise<void> {
        const device = await this.prisma.device.findFirst({
            where: { id: senderDeviceId, userId },
        });
        if (!device) {
            throw new ForbiddenException(
                'senderDeviceId must refer to one of your registered devices',
            );
        }
    }
}
