import type { Chat } from '@/modules/entities/chats';

export function parseScheduledDeletionAt(iso?: string): Date | null {
    if (!iso) return null;
    const x = new Date(iso);
    return Number.isNaN(x.getTime()) ? null : x;
}

export function isChatDeletionScheduled(chat: Pick<Chat, 'scheduledDeletionAt'>): boolean {
    return !!parseScheduledDeletionAt(chat.scheduledDeletionAt);
}

export function formatScheduledDeletionRu(iso?: string): string | undefined {
    const d = parseScheduledDeletionAt(iso);
    return d?.toLocaleString('ru-RU');
}

export function defaultHoursMinutesForChatDeletion(): { h: number; m: number } {
    return { h: 1, m: 0 };
}
