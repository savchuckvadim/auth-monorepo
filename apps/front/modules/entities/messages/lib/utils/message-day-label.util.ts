import { formatRelativeDate } from '@/modules/shared';

function startOfDay(d: Date): number {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Подпись между группами сообщений (как в мессенджерах): «Сегодня», «Вчера», дата;
 * для давних дат — доп. строка с относительным временем (как в постах).
 */
export function formatChatDaySeparatorLabel(iso: string | Date): string {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    const today = new Date();
    const diffDays = Math.round(
        (startOfDay(today) - startOfDay(d)) / 86_400_000,
    );

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) {
        return d.toLocaleDateString('ru-RU', { weekday: 'long' });
    }

    const sameYear = d.getFullYear() === today.getFullYear();
    if (sameYear) {
        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
        });
    }
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/** Вторая строка под датой для старых переписок (month ago и т.д.). */
export function formatChatDayRelativeLine(iso: string | Date): string | null {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    const today = new Date();
    const diffDays = Math.round(
        (startOfDay(today) - startOfDay(d)) / 86_400_000,
    );
    if (diffDays < 14) return null;
    return formatRelativeDate(d);
}

export function dayKeyForMessage(iso: string | Date): string {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
