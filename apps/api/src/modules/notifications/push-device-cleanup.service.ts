import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';

const DEFAULT_STALE_DAYS = 30;
const ENV_STALE_DAYS = 'PUSH_DEVICE_STALE_DAYS';

/**
 * Periodically soft-deactivates push device rows that have not been refreshed
 * (lastSeenAt) for longer than the configured threshold.
 */
@Injectable()
export class PushDeviceCleanupService {
    private readonly logger = new Logger(PushDeviceCleanupService.name);

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly configService: ConfigService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async deactivateStaleDevices(): Promise<void> {
        const maxAgeDays = this.getStaleDays();
        try {
            const count =
                await this.notificationsService.deactivateStalePushDevices(
                    maxAgeDays,
                );
            if (count > 0) {
                this.logger.log(
                    `Push device stale cleanup: deactivated ${count} rows (>${maxAgeDays}d since lastSeenAt)`,
                );
            }
        } catch (error) {
            this.logger.error(
                'Push device stale cleanup failed',
                error instanceof Error ? error.stack : String(error),
            );
        }
    }

    private getStaleDays(): number {
        const raw = this.configService.get<string>(ENV_STALE_DAYS);
        if (!raw) return DEFAULT_STALE_DAYS;
        const n = Number.parseInt(raw, 10);
        return Number.isFinite(n) && n > 0 ? n : DEFAULT_STALE_DAYS;
    }
}
