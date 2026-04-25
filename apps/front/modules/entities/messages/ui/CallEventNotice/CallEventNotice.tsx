'use client';

import { cn } from '@workspace/ui/lib/utils';
import { Phone, PhoneIncoming, PhoneMissed, PhoneOff, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CallEventMetadata } from '../../lib/types/messages.types';

interface CallEventNoticeProps {
    /** Метаданные CALL_EVENT с бэка. */
    metadata: CallEventMetadata | Record<string, unknown> | undefined;
    /** ID текущего пользователя — нужен для вычисления direction. */
    currentUserId: string | undefined;
    /** Fallback-текст на случай, если `metadata` пуста / битая. */
    fallbackContent: string;
    /** Время события; рендерится справа от текста. */
    timeLabel?: string;
    className?: string;
}

const REASON_LABEL: Record<CallEventMetadata['reason'], string> = {
    missed: 'Пропущенный звонок',
    accepted: 'Звонок',
    rejected: 'Отклонённый звонок',
    canceled: 'Отменённый звонок',
    timeout: 'Нет ответа',
    failed: 'Не удалось дозвониться',
};

function formatDuration(durationMs: number | undefined): string | null {
    if (!durationMs || durationMs <= 0) return null;
    const totalSeconds = Math.round(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds} с`;
    return `${minutes} мин ${seconds.toString().padStart(2, '0')} с`;
}

function isCallEventMetadata(
    value: unknown,
): value is CallEventMetadata {
    return (
        typeof value === 'object' &&
        value !== null &&
        'reason' in value &&
        'callType' in value
    );
}

/**
 * Рендер карточки CALL_EVENT. Направление (incoming/outgoing) считается
 * прямо в UI: сервер хранит только `initiatorId`, чтобы одна запись
 * одинаково отображалась обоим собеседникам с их собственной точки зрения.
 */
export function CallEventNotice({
    metadata,
    currentUserId,
    fallbackContent,
    timeLabel,
    className,
}: CallEventNoticeProps) {
    if (!isCallEventMetadata(metadata)) {
        return (
            <div
                className={cn(
                    'my-2 flex w-full justify-center px-3 text-center',
                    className,
                )}
            >
                <p className="max-w-[min(100%,28rem)] rounded-full bg-muted px-3 py-1 text-xs leading-snug text-muted-foreground">
                    {fallbackContent}
                </p>
            </div>
        );
    }

    const direction: 'incoming' | 'outgoing' = metadata.initiatorId
        ? metadata.initiatorId === currentUserId
            ? 'outgoing'
            : 'incoming'
        : 'incoming';

    const isMissed =
        metadata.reason === 'missed' ||
        metadata.reason === 'timeout' ||
        (metadata.reason === 'canceled' && direction === 'incoming');

    const icon: ReactNode = (() => {
        if (isMissed)
            return <PhoneMissed className="h-3.5 w-3.5" aria-hidden="true" />;
        if (metadata.reason === 'rejected' || metadata.reason === 'failed')
            return <PhoneOff className="h-3.5 w-3.5" aria-hidden="true" />;
        if (metadata.callType === 'video')
            return <Video className="h-3.5 w-3.5" aria-hidden="true" />;
        if (direction === 'incoming')
            return <PhoneIncoming className="h-3.5 w-3.5" aria-hidden="true" />;
        return <Phone className="h-3.5 w-3.5" aria-hidden="true" />;
    })();

    const label = REASON_LABEL[metadata.reason] ?? 'Звонок';
    const duration = formatDuration(metadata.durationMs);
    const directionLabel = direction === 'outgoing' ? 'Исходящий' : 'Входящий';
    const callTypeLabel = metadata.callType === 'video' ? 'видео' : 'аудио';

    return (
        <div
            className={cn(
                'my-2 flex w-full justify-center px-3',
                className,
            )}
        >
            <div
                className={cn(
                    'flex max-w-[min(100%,28rem)] items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs leading-snug',
                    isMissed
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                )}
                aria-label={`${label}, ${directionLabel.toLowerCase()} ${callTypeLabel}${
                    duration ? `, длительность ${duration}` : ''
                }`}
            >
                {icon}
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground/80">
                    · {directionLabel.toLowerCase()} {callTypeLabel}
                </span>
                {duration && (
                    <span className="text-muted-foreground/80">· {duration}</span>
                )}
                {timeLabel && (
                    <span className="text-muted-foreground/60">· {timeLabel}</span>
                )}
            </div>
        </div>
    );
}
