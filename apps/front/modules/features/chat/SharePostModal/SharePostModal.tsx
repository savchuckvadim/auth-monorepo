'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AppDialog } from '@/modules/shared/ui/AppDialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
    usePostsByUserId,
    usePostsFeed,
} from '@/modules/entities/post/lib/hook/posts.hook';
import { cn } from '@workspace/ui/lib/utils';
import type { ComposerSharedPost } from '@/modules/widgets/chat/chat-current/lib/context/CurrentChatComposerContext';

interface SharePostModalProps {
    open: boolean;
    onClose: () => void;
    currentUserId: string | null;
    onSelect: (post: ComposerSharedPost) => void;
}

/**
 * Модалка выбора поста, который прикрепится к сообщению как POST_SHARE.
 * Две вкладки: «Мои» и «Лента».
 */
export function SharePostModal({
    open,
    onClose,
    currentUserId,
    onSelect,
}: SharePostModalProps) {
    const [tab, setTab] = useState<'mine' | 'feed'>('mine');
    const [query, setQuery] = useState('');

    const { posts: myPosts, isLoading: myLoading } = usePostsByUserId(
        currentUserId ?? '',
    );
    const { posts: feedPosts, isLoading: feedLoading } = usePostsFeed();

    const posts = tab === 'mine' ? myPosts : feedPosts;
    const isLoading = tab === 'mine' ? myLoading : feedLoading;

    const filtered = useMemo(() => {
        if (!posts) return [];
        if (!query.trim()) return posts;
        const q = query.toLowerCase();
        return posts.filter((p) => (p.text ?? '').toLowerCase().includes(q));
    }, [posts, query]);

    return (
        <AppDialog
            open={open}
            onOpenChange={(v) => !v && onClose()}
            title="Прикрепить пост"
            description="Выберите пост, чтобы поделиться им в сообщении"
            contentClassName="sm:max-w-md"
            footer={
                <Button variant="outline" onClick={onClose}>
                    Отмена
                </Button>
            }
        >
            <div className="mb-3 flex gap-1 rounded-md bg-muted p-1">
                <button
                    type="button"
                    onClick={() => setTab('mine')}
                    className={cn(
                        'flex-1 rounded px-3 py-1.5 text-sm transition',
                        tab === 'mine'
                            ? 'bg-background shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    Мои
                </button>
                <button
                    type="button"
                    onClick={() => setTab('feed')}
                    className={cn(
                        'flex-1 rounded px-3 py-1.5 text-sm transition',
                        tab === 'feed'
                            ? 'bg-background shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    Лента
                </button>
            </div>

            <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="pl-8"
                    placeholder="Поиск по тексту"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
                {isLoading ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Загрузка…
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Нет постов
                    </p>
                ) : (
                    <ul className="flex flex-col gap-1">
                        {filtered.map((p) => (
                            <li key={p.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect({
                                            postId: p.id,
                                            authorName:
                                                p.author?.name ?? undefined,
                                            text: p.text ?? undefined,
                                            thumbnail: p.image ?? undefined,
                                        });
                                        onClose();
                                    }}
                                    className="flex w-full items-start gap-3 rounded-md p-2 text-left transition hover:bg-muted"
                                >
                                    {p.image ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={p.image}
                                            alt=""
                                            className="h-12 w-12 shrink-0 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 shrink-0 rounded bg-muted" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-primary">
                                            {p.author?.name ?? 'Пост'}
                                        </p>
                                        <p className="line-clamp-2 text-sm">
                                            {p.text ?? '—'}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppDialog>
    );
}
