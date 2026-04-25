import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessagesRepository } from '../repositories/messages.repository';
import { S3Service } from '@/core/s3';
import { RedisService } from '@/core/redis/redis.service';

const LOCK_KEY = 'locks:messages:attachments-cleanup';
const LOCK_TTL_SECONDS = 10 * 60;

/** Orphan-ом считаем вложение старше этого возраста без привязки к message. */
const ORPHAN_MAX_AGE_MS = 60 * 60 * 1000;

@Injectable()
export class MessageAttachmentsCleanupService {
    private readonly logger = new Logger(MessageAttachmentsCleanupService.name);

    constructor(
        private readonly messagesRepository: MessagesRepository,
        private readonly s3Service: S3Service,
        private readonly redisService: RedisService,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async cleanupOrphanAttachments(): Promise<void> {
        const acquired = await this.acquireLock();
        if (!acquired) {
            this.logger.debug(
                'Attachments cleanup skipped: another instance is running',
            );
            return;
        }

        const startedAt = Date.now();
        try {
            const { deletedCount, deletedUrls } =
                await this.messagesRepository.deleteOrphanAttachments(
                    ORPHAN_MAX_AGE_MS,
                );
            // Сначала стираем БД-записи, только потом пытаемся удалить файлы
            // из S3. Если S3 упадёт — ничего страшного: запись уже ушла,
            // а S3-ошибки фиксируем и идём дальше.
            if (deletedUrls.length > 0) {
                await this.s3Service.deleteFiles(deletedUrls).catch(error => {
                    this.logger.warn(
                        `Failed to delete ${deletedUrls.length} S3 objects: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`,
                    );
                });
            }
            const duration = Date.now() - startedAt;
            if (deletedCount > 0) {
                this.logger.log(
                    `Orphan attachments removed: ${deletedCount} (in ${duration}ms)`,
                );
            }
        } catch (error) {
            this.logger.error(
                'Failed to cleanup orphan attachments',
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
                LOCK_TTL_SECONDS,
                'NX',
            );
            return result === 'OK';
        } catch (error) {
            this.logger.warn(
                `Attachments cleanup lock acquisition failed, running anyway: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            return true;
        }
    }

    private async releaseLock(): Promise<void> {
        try {
            await this.redisService.getClient().del(LOCK_KEY);
        } catch {
            // ignore
        }
    }
}
