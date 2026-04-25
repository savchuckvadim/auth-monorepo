'use client';

import Link from 'next/link';
import { usePost } from '@/modules/entities/post/lib/hook/post.hook';
import { MessageAttachment } from '../../lib/types/messages.types';
import { cn } from '@workspace/ui/lib/utils';

interface SharedPostCardProps {
    attachment: MessageAttachment;
    tone: 'own' | 'incoming';
}

/**
 * Карточка расшаренного поста: автор, 3 строки текста, 1 thumbnail.
 * При клике — переход на страницу поста. Если пост удалён — показываем
 * заглушку.
 */
export function SharedPostCard({ attachment, tone }: SharedPostCardProps) {
    const postId = attachment.postId ?? undefined;
    const { post, isLoading } = usePost(postId ?? '');

    if (!postId) return null;

    if (isLoading) {
        return (
            <div
                className={cn(
                    'flex max-w-[360px] flex-col gap-2 rounded-md border px-3 py-2 text-sm',
                    tone === 'own'
                        ? 'border-primary-foreground/25 bg-primary-foreground/10'
                        : 'border-border bg-background/60',
                )}
            >
                <p className="h-3 w-32 animate-pulse rounded bg-muted-foreground/30" />
                <p className="h-3 w-full animate-pulse rounded bg-muted-foreground/20" />
            </div>
        );
    }

    if (!post) {
        return (
            <div
                className={cn(
                    'max-w-[360px] rounded-md border border-dashed px-3 py-2 text-xs',
                    tone === 'own'
                        ? 'border-primary-foreground/30 text-primary-foreground/70'
                        : 'border-border text-muted-foreground',
                )}
            >
                Пост недоступен или удалён
            </div>
        );
    }

    const thumb = post.image;
    const authorName = post.author?.name ?? 'Пользователь';

    return (
        <Link
            href={`/network/posts/${postId}`}
            className={cn(
                'flex max-w-[360px] items-start gap-3 rounded-md border px-3 py-2 text-sm transition hover:bg-background',
                tone === 'own'
                    ? 'border-primary-foreground/25 bg-primary-foreground/10 hover:bg-primary-foreground/15'
                    : 'border-border bg-background/60',
            )}
        >
            {thumb ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={thumb}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                />
            ) : null}
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        'text-[11px] font-medium',
                        tone === 'own'
                            ? 'text-primary-foreground/80'
                            : 'text-primary',
                    )}
                >
                    Пост · {authorName}
                </p>
                {post.text ? (
                    <p className="mt-0.5 line-clamp-3 break-words [overflow-wrap:anywhere]">
                        {post.text}
                    </p>
                ) : null}
            </div>
        </Link>
    );
}
