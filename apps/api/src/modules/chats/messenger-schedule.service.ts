import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/core';

/**
 * Удаление чатов по scheduledDeletionAt и пометка сообщений с истёкшим expiresAt.
 */
@Injectable()
export class MessengerScheduleService {
    private readonly logger = new Logger(MessengerScheduleService.name);

    constructor(private readonly prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async runScheduledCleanup(): Promise<void> {
        const now = new Date();
        try {
            await this.softDeleteExpiredMessages(now);
            await this.deleteScheduledChats(now);
        } catch (e) {
            this.logger.warn(
                `Messenger schedule cleanup failed: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }

    private async softDeleteExpiredMessages(now: Date): Promise<void> {
        const res = await this.prisma.message.updateMany({
            where: {
                deletedAt: null,
                expiresAt: { lte: now },
            },
            data: { deletedAt: now },
        });
        if (res.count > 0) {
            this.logger.log(`Marked ${res.count} expired messages as deleted`);
        }
    }

    private async deleteScheduledChats(now: Date): Promise<void> {
        const due = await this.prisma.chat.findMany({
            where: {
                scheduledDeletionAt: { lte: now },
            },
            select: { id: true },
        });
        for (const row of due) {
            await this.prisma.$transaction(async tx => {
                await tx.invitation.updateMany({
                    where: { resolvedChatId: row.id },
                    data: { resolvedChatId: null },
                });
                await tx.chat.delete({ where: { id: row.id } });
            });
            this.logger.log(`Deleted chat ${row.id} (scheduled)`);
        }
    }
}
