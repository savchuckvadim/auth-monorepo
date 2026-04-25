'use client';

import { Reply } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

export interface ReplyQuoteProps {
    senderName?: string;
    snippet: string;
    /** Тема бабла — меняет цвета акцентной полоски и текста. */
    tone: 'own' | 'incoming';
    onClick?: () => void;
    className?: string;
}

/**
 * Мини-превью сообщения-первоисточника над телом реплая.
 * Показывается и в баббле-ответе, и в reply-бар над инпутом.
 */
export function ReplyQuote({
    senderName,
    snippet,
    tone,
    onClick,
    className,
}: ReplyQuoteProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={cn(
                'mb-1 block w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                tone === 'own'
                    ? 'bg-primary-foreground/20 text-primary-foreground/95 hover:bg-primary-foreground/30'
                    : 'bg-foreground/10 text-foreground/90 hover:bg-foreground/15',
                !onClick && 'cursor-default hover:bg-inherit',
                'border-l-2',
                tone === 'own'
                    ? 'border-primary-foreground/80'
                    : 'border-primary/80',
                className,
            )}
        >
            <div
                className={cn(
                    'mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide',
                    tone === 'own'
                        ? 'text-primary-foreground/80'
                        : 'text-primary',
                )}
            >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
            </div>
            {senderName ? (
                <p className="mb-0.5 truncate font-medium">{senderName}</p>
            ) : null}
            <p className="line-clamp-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                {snippet}
            </p>
        </button>
    );
}
