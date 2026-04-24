import { Injectable } from '@nestjs/common';
import { PasswordResetToken } from 'generated/prisma';
import { PrismaService } from '@/core';
import {
    PasswordResetRepository,
    SavePasswordResetTokenInput,
} from './password-reset.repository';

@Injectable()
export class PasswordResetPrismaRepository implements PasswordResetRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createForUser(
        input: SavePasswordResetTokenInput,
    ): Promise<PasswordResetToken> {
        // В транзакции, чтобы не было окна, где у пользователя одновременно
        // существуют два активных токена (старый и новый).
        return await this.prisma.$transaction(async tx => {
            await tx.passwordResetToken.deleteMany({
                where: { userId: input.userId },
            });
            return await tx.passwordResetToken.create({
                data: {
                    userId: input.userId,
                    tokenHash: input.tokenHash,
                    expiresAt: input.expiresAt,
                    ipAddress: input.ipAddress,
                    userAgent: input.userAgent,
                },
            });
        });
    }

    async findByTokenHash(
        tokenHash: string,
    ): Promise<PasswordResetToken | null> {
        return await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
    }

    async markConsumed(id: string): Promise<PasswordResetToken> {
        return await this.prisma.passwordResetToken.update({
            where: { id },
            data: { consumedAt: new Date() },
        });
    }

    async deleteAllForUser(userId: string): Promise<number> {
        const result = await this.prisma.passwordResetToken.deleteMany({
            where: { userId },
        });
        return result.count;
    }

    async removeStaleTokens(batchSize = 1000): Promise<number> {
        // Удаляем истёкшие и уже потреблённые — хранить их бессмысленно.
        // Чанкуем по тем же соображениям, что и в cleanup для refresh-токенов.
        let total = 0;
        const now = new Date();
        for (let i = 0; i < 1000; i++) {
            const stale = await this.prisma.passwordResetToken.findMany({
                where: {
                    OR: [
                        { expiresAt: { lt: now } },
                        { consumedAt: { not: null } },
                    ],
                },
                select: { id: true },
                take: batchSize,
            });
            if (stale.length === 0) break;
            const removed = await this.prisma.passwordResetToken.deleteMany({
                where: { id: { in: stale.map(t => t.id) } },
            });
            total += removed.count;
            if (stale.length < batchSize) break;
        }
        return total;
    }
}
