'use client';

import { cn } from '@workspace/ui/lib/utils';

interface TypingDotsProps {
    /**
     * Визуальный тон. `muted` — нейтральный серый (для футера списка сообщений).
     */
    tone?: 'muted' | 'primary';
    className?: string;
    /** Опциональная текстовая подпись, например имя печатающего пользователя. */
    label?: string;
}

/**
 * Три прыгающие точки в стиле Telegram — визуальный индикатор typing.
 *
 * Анимация построена на `animate-bounce` из tailwind + задержка через
 * `animationDelay` на каждой точке. Не завязано ни на какую доп. библиотеку.
 */
export function TypingDots({ tone = 'muted', className, label }: TypingDotsProps) {
    const dotColor = tone === 'primary' ? 'bg-primary' : 'bg-muted-foreground';

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn('flex items-center gap-1.5', className)}
        >
            {label ? (
                <span className="text-xs text-muted-foreground">{label}</span>
            ) : null}
            <span className="flex items-end gap-1">
                <span
                    className={cn('h-1.5 w-1.5 animate-bounce rounded-full', dotColor)}
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className={cn('h-1.5 w-1.5 animate-bounce rounded-full', dotColor)}
                    style={{ animationDelay: '150ms' }}
                />
                <span
                    className={cn('h-1.5 w-1.5 animate-bounce rounded-full', dotColor)}
                    style={{ animationDelay: '300ms' }}
                />
            </span>
        </div>
    );
}
