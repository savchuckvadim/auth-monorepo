import { Token } from 'generated/prisma';
import { SaveTokenInput, TokenRepository } from './token.repository';
import { PrismaService } from '@/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenPrismaRepository implements TokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveToken(input: SaveTokenInput): Promise<Token> {
        return await this.prisma.token.create({
            data: {
                userId: input.userId,
                refreshToken: input.refreshToken,
                expiresAt: input.expiresAt,
                deviceId: input.deviceId,
                userAgent: input.userAgent,
                ipAddress: input.ipAddress,
            },
        });
    }

    async findTokenByRefreshToken(refreshToken: string): Promise<Token | null> {
        return await this.prisma.token.findUnique({
            where: { refreshToken },
        });
    }

    async findTokensByUserId(userId: string): Promise<Token[]> {
        return await this.prisma.token.findMany({
            where: {
                userId,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async removeToken(refreshToken: string): Promise<Token | null> {
        const token = await this.prisma.token.findUnique({
            where: { refreshToken },
        });
        if (!token) return null;
        // deleteMany чтобы не кидать P2025, если гонка уже забрала строку.
        const deleted = await this.prisma.token.deleteMany({
            where: { id: token.id },
        });
        return deleted.count === 1 ? token : null;
    }

    async claimRefreshToken(refreshToken: string): Promise<boolean> {
        // Один атомарный DELETE в БД. Уникальный индекс по `refresh_token`
        // гарантирует, что только один из параллельных запросов получит count===1.
        const result = await this.prisma.token.deleteMany({
            where: { refreshToken },
        });
        return result.count === 1;
    }

    async removeAllUserTokens(userId: string): Promise<number> {
        const result = await this.prisma.token.deleteMany({
            where: { userId },
        });
        return result.count;
    }

    async removeTokenByIdForUser(
        id: string,
        userId: string,
    ): Promise<Token | null> {
        // Сначала читаем, чтобы потом вернуть данные удалённой строки.
        // `userId` в `where` — защита от удаления чужой сессии.
        const token = await this.prisma.token.findFirst({
            where: { id, userId },
        });
        if (!token) return null;
        const deleted = await this.prisma.token.deleteMany({
            where: { id, userId },
        });
        return deleted.count === 1 ? token : null;
    }

    async removeAllUserTokensExceptRefreshToken(
        userId: string,
        exceptRefreshToken: string | null | undefined,
    ): Promise<number> {
        const result = await this.prisma.token.deleteMany({
            where: {
                userId,
                ...(exceptRefreshToken
                    ? { refreshToken: { not: exceptRefreshToken } }
                    : {}),
            },
        });
        return result.count;
    }

    async removeExpiredTokens(batchSize = 1000): Promise<number> {
        let total = 0;
        // Чанковое удаление: не держим длинный lock и даём нормальную работу БД.
        // Выходим, как только очередной проход ничего не удалил.
        for (let i = 0; i < 1000; i++) {
            const expired = await this.prisma.token.findMany({
                where: { expiresAt: { lt: new Date() } },
                select: { id: true },
                take: batchSize,
            });
            if (expired.length === 0) break;
            const removed = await this.prisma.token.deleteMany({
                where: { id: { in: expired.map(t => t.id) } },
            });
            total += removed.count;
            if (expired.length < batchSize) break;
        }
        return total;
    }
}
