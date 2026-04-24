import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '@/core';
import { TokenService } from '@/modules/token';
import {
    AUTH_DEFAULT_TTL,
    EnumAuthErrorCode,
    EnumAuthTtlEnv,
} from '@/modules/token/token.type';
import { parseDurationToMs, AuthRequestInfo } from '@/lib';
import { SendMailPasswordResetUseCase } from '@/modules/mail';
import { PasswordResetRepository } from './password-reset.repository';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class PasswordResetService {
    private readonly logger = new Logger(PasswordResetService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly repository: PasswordResetRepository,
        private readonly tokenService: TokenService,
        private readonly mailUseCase: SendMailPasswordResetUseCase,
    ) {}

    /**
     * TTL reset-токена. По умолчанию 30 минут; переопределяется через env.
     */
    public getResetTtlMs(): number {
        const fallback = parseDurationToMs(AUTH_DEFAULT_TTL.PASSWORD_RESET);
        return parseDurationToMs(
            this.configService.get<string>(EnumAuthTtlEnv.PASSWORD_RESET),
            fallback,
        );
    }

    /**
     * Начало reset-флоу. Важно: отвечаем одинаково при любом email —
     * не раскрываем, зарегистрирован ли пользователь (защита от user enumeration).
     *
     * Если пользователь найден и активирован, генерируем токен (plaintext →
     * клиенту в письме, хеш → в БД), складываем ссылку и отправляем в очередь.
     */
    public async requestReset(
        email: string,
        context?: AuthRequestInfo,
    ): Promise<void> {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user || !user.isAcivated) {
            // Делаем псевдо-работу, чтобы время ответа не выдавало отсутствие юзера.
            // Хешируем случайный мусор тем же bcrypt'ом.
            await hash(randomBytes(32).toString('hex'), BCRYPT_ROUNDS).catch(
                () => null,
            );
            return;
        }

        const plaintextToken = this.generatePlaintextToken();
        const tokenHash = this.hashToken(plaintextToken);
        const expiresAt = new Date(Date.now() + this.getResetTtlMs());

        await this.repository.createForUser({
            userId: user.id,
            tokenHash,
            expiresAt,
            ipAddress: context?.ipAddress,
            userAgent: context?.userAgent,
        });

        const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
        const resetLink = `${clientUrl}/auth/reset-password?token=${encodeURIComponent(plaintextToken)}`;

        await this.mailUseCase.passwordReset({
            email: user.email,
            name: user.name,
            resetLink,
            expiresInMinutes: Math.max(
                1,
                Math.round(this.getResetTtlMs() / 60_000),
            ),
        });
    }

    /**
     * Потребление токена + смена пароля. Ревокает все refresh-сессии пользователя —
     * стандартная практика: после сброса все устройства должны перелогиниться.
     */
    public async resetPassword(
        plaintextToken: string,
        newPassword: string,
    ): Promise<void> {
        const tokenHash = this.hashToken(plaintextToken);
        const record = await this.repository.findByTokenHash(tokenHash);

        // Постоянное время сравнения на случай time-based oracle.
        // findUnique по хешу и так быстр, но лишним не будет.
        if (!record || !this.verifyHash(record.tokenHash, tokenHash)) {
            throw new UnauthorizedException(
                EnumAuthErrorCode.PASSWORD_RESET_TOKEN_INVALID,
            );
        }
        if (record.consumedAt) {
            throw new UnauthorizedException(
                EnumAuthErrorCode.PASSWORD_RESET_TOKEN_USED,
            );
        }
        if (record.expiresAt.getTime() < Date.now()) {
            throw new UnauthorizedException(
                EnumAuthErrorCode.PASSWORD_RESET_TOKEN_EXPIRED,
            );
        }

        const newPasswordHash = await hash(newPassword, BCRYPT_ROUNDS);

        // В транзакции: обновляем пароль, помечаем токен, дропаем все прочие
        // токены этого пользователя (включая тот же, если останется черновик).
        await this.prisma.$transaction(async tx => {
            await tx.user.update({
                where: { id: record.userId },
                data: { password: newPasswordHash },
            });
            await tx.passwordResetToken.update({
                where: { id: record.id },
                data: { consumedAt: new Date() },
            });
            await tx.passwordResetToken.deleteMany({
                where: {
                    userId: record.userId,
                    id: { not: record.id },
                },
            });
        });

        // Ревок всех refresh-сессий: безопасность важнее UX.
        // Вне транзакции — `tokens` не в той же Prisma-транзакции по смыслу.
        await this.tokenService
            .removeAllUserTokens(record.userId)
            .catch(err => {
                this.logger.error(
                    `Failed to revoke sessions after password reset for user ${record.userId}`,
                    err instanceof Error ? err.stack : undefined,
                );
            });
    }

    /**
     * Смена пароля авторизованным пользователем. Проверяем старый пароль и
     * не даём поставить тот же самый (иначе флоу превращается в no-op).
     * Возвращает количество ревокнутых чужих сессий — контроллер использует
     * его для логов/аналитики.
     */
    public async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string,
        currentRefreshToken?: string | null,
    ): Promise<{ revokedSessions: number }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_FOUND);
        }

        const oldOk = await compare(oldPassword, user.password);
        if (!oldOk) {
            throw new UnauthorizedException(EnumAuthErrorCode.INVALID_PASSWORD);
        }

        if (oldPassword === newPassword) {
            throw new BadRequestException(
                EnumAuthErrorCode.PASSWORD_SAME_AS_OLD,
            );
        }

        const newPasswordHash = await hash(newPassword, BCRYPT_ROUNDS);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: newPasswordHash },
        });

        const revoked =
            await this.tokenService.removeAllUserTokensExceptRefreshToken(
                userId,
                currentRefreshToken ?? null,
            );
        return { revokedSessions: revoked };
    }

    private generatePlaintextToken(): string {
        // 32 байта ≈ 43 символа base64url. Достаточно для криптостойкости.
        return randomBytes(32).toString('base64url');
    }

    private hashToken(plaintext: string): string {
        return createHash('sha256').update(plaintext).digest('hex');
    }

    private verifyHash(storedHex: string, candidateHex: string): boolean {
        if (storedHex.length !== candidateHex.length) return false;
        return timingSafeEqual(
            Buffer.from(storedHex, 'hex'),
            Buffer.from(candidateHex, 'hex'),
        );
    }
}
