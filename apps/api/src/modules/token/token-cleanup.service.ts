import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from './token.service';
import { RedisService } from '@/core/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { parseDurationToMs } from '@/lib/utils/duration.util';
import {
    AUTH_DEFAULT_TTL,
    EnumAuthTtlEnv,
} from '@/lib/auth/auth-token-lifetime.config';

const LOCK_KEY = 'locks:token-cleanup';

@Injectable()
export class TokenCleanupService {
    private readonly logger = new Logger(TokenCleanupService.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleExpiredTokens(): Promise<void> {
        // Распределённый лок: если API запущен в несколько инстансов / подов,
        // @Cron сработает на каждом. Первый успевший берёт лок, остальные
        // молча пропускают запуск.
        const acquired = await this.acquireLock();
        if (!acquired) {
            this.logger.debug(
                'Token cleanup skipped: another instance is running',
            );
            return;
        }

        const startedAt = Date.now();
        try {
            // Пачковое удаление внутри repository — не держим длинную
            // транзакцию и даём БД дышать между батчами.
            const removed = await this.tokenService.removeExpiredTokens();
            const duration = Date.now() - startedAt;
            if (removed > 0) {
                this.logger.log(
                    `Expired refresh tokens removed: ${removed} (in ${duration}ms)`,
                );
            }
        } catch (error) {
            this.logger.error(
                'Failed to remove expired refresh tokens',
                error instanceof Error ? error.stack : String(error),
            );
        } finally {
            await this.releaseLock();
        }
    }

    private async acquireLock(): Promise<boolean> {
        try {
            const client = this.redisService.getClient();
            const result = await client.set(
                LOCK_KEY,
                String(Date.now()),
                'EX',
                this.getLockTtlSeconds(),
                'NX',
            );
            return result === 'OK';
        } catch (error) {
            // Redis недоступен — fail-open: лучше выполнить чистку
            // (в крайнем случае дважды), чем пропустить её навсегда.
            this.logger.warn(
                `Token cleanup lock acquisition failed, running anyway: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            return true;
        }
    }

    private getLockTtlSeconds(): number {
        const fallbackMs = parseDurationToMs(
            AUTH_DEFAULT_TTL.TOKEN_CLEANUP_LOCK,
        );
        const ttlMs = parseDurationToMs(
            this.configService.get<string>(EnumAuthTtlEnv.TOKEN_CLEANUP_LOCK),
            fallbackMs,
        );
        return Math.max(1, Math.floor(ttlMs / 1000));
    }

    private async releaseLock(): Promise<void> {
        try {
            await this.redisService.getClient().del(LOCK_KEY);
        } catch {
            // ignore — лок сам истечёт по TTL
        }
    }
}
