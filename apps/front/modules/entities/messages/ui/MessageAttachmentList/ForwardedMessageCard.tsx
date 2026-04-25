'use client';

import { Forward } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { MessageAttachment } from '../../lib/types/messages.types';

interface ForwardedMessageCardProps {
    attachment: MessageAttachment;
    tone: 'own' | 'incoming';
}

type Snapshot = {
    sourceMessageId?: string;
    sourceChatId?: string;
    senderId?: string;
    senderName?: string;
    content?: string;
    type?: string;
    createdAt?: string;
};

function getSnapshot(attachment: MessageAttachment): Snapshot | null {
    const meta = attachment.metadata;
    if (!meta || typeof meta !== 'object') return null;
    return meta as Snapshot;
}

/**
 * Визуал пересланного сообщения: тонкая левая полоска + «Пересланное от …»,
 * автор, текст (3 строки max). Без sender-аватарки, как в Telegram.
 */
export function ForwardedMessageCard({
    attachment,
    tone,
}: ForwardedMessageCardProps) {
    const snap = getSnapshot(attachment);
    if (!snap) return null;
    return (
        <div
            className={cn(
                'flex max-w-[320px] gap-2 rounded-md border-l-2 px-3 py-2 text-sm',
                tone === 'own'
                    ? 'border-primary-foreground/60 bg-primary-foreground/10'
                    : 'border-primary bg-background/60',
            )}
        >
            <Forward
                className={cn(
                    'mt-0.5 h-3.5 w-3.5 shrink-0',
                    tone === 'own'
                        ? 'text-primary-foreground/80'
                        : 'text-primary',
                )}
            />
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        'text-[11px] font-medium',
                        tone === 'own'
                            ? 'text-primary-foreground/80'
                            : 'text-primary',
                    )}
                >
                    Пересланное от {snap.senderName || 'Пользователь'}
                </p>
                {snap.content ? (
                    <p className="mt-0.5 line-clamp-3 break-words [overflow-wrap:anywhere]">
                        {snap.content}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
