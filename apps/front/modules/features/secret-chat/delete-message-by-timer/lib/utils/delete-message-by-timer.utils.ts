import type { Chat } from '@/modules/entities/chats';

export function isDisappearingMessagesOn(
    chat: Pick<Chat, 'disappearingMessageSeconds'>,
): boolean {
    return (chat.disappearingMessageSeconds ?? 0) > 0;
}

export function formatDisappearingDetail(seconds: number): string {
    return `через ${Math.max(1, Math.round(seconds / 60))} мин`;
}

export function defaultHoursMinutesForDisappearing(): { h: number; m: number } {
    return { h: 0, m: 30 };
}
