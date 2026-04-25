'use client';

import { Heart } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useToggleMessageLike } from '../../lib/hooks/useMessages';

interface MessageLikeButtonProps {
    messageId: string;
    isLiked: boolean;
}

/**
 * Кнопка лайка сообщения. Использует оптимистичное обновление из
 * `useToggleMessageLike`: UI меняется мгновенно, а onSuccess перезатирает
 * флаги финальным значением с сервера.
 */
export function MessageLikeButton({
    messageId,
    isLiked,
}: MessageLikeButtonProps) {
    const toggle = useToggleMessageLike();

    return (
        <button
            type="button"
            className='p-0 m-0'
            onClick={(e) => {
                e.stopPropagation();
                toggle.mutate(messageId);
            }}
        >
            <Heart

                className={cn(
                    'inline-flex',
                    'cursor-pointer',
                    'h-3.5 w-3.5 transition-transform',
                    isLiked && 'fill-current scale-110',
                )}
                aria-hidden="true"
            />
        </button>
    );
}
