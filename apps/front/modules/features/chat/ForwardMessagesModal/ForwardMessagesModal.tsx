'use client';

import { useMemo, useState } from 'react';
import { AppDialog } from '@/modules/shared/ui/AppDialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Avatar, useAppToast } from '@/modules/shared/ui';
import { useEnsurePrivateChat } from '@/modules/entities/chats';
import { useAllUsers } from '@/modules/entities/followers';
import { useForwardMessages } from '@/modules/entities/messages';
import { ChatDtoEncryptionMode, type UserWithFollowStatusDto } from '@workspace/nest-api';

interface ForwardMessagesModalProps {
    open: boolean;
    onClose: () => void;
    /** ID сообщений, которые пересылаем. */
    messageIds: string[];
}

/**
 * Выбор 1..N подписчиков для пересылки. Для каждого выбранного пользователя
 * находим или создаём обычный private-chat и уже в него форвардим сообщение.
 */
export function ForwardMessagesModal({
    open,
    onClose,
    messageIds,
}: ForwardMessagesModalProps) {
    const { data: users, isLoading: usersLoading } = useAllUsers();
    const { ensurePrivateChat, isPending: ensureChatPending } =
        useEnsurePrivateChat();
    const forwardMutation = useForwardMessages();
    const { showToast } = useAppToast();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        return ((users ?? []) as UserWithFollowStatusDto[])
            .filter((user) => user.isFollower)
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((user) => {
                if (!query.trim()) return true;
                const q = query.trim().toLowerCase();
                return (
                    user.name.toLowerCase().includes(q) ||
                    user.email.toLowerCase().includes(q)
                );
            });
    }, [users, query]);

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const forwardInBackground = async (userIds: string[]) => {
        let successCount = 0;
        let failedCount = 0;

        for (const userId of userIds) {
            try {
                const chat = await ensurePrivateChat(
                    userId,
                    ChatDtoEncryptionMode.NONE,
                );
                if (!chat?.id) {
                    failedCount += 1;
                    continue;
                }
                await forwardMutation.mutateAsync({
                    messageIds,
                    targetChatIds: [chat.id],
                });
                successCount += 1;
            } catch (error) {
                failedCount += 1;
                console.error('Forward failed', error);
            }
        }

        if (failedCount > 0) {
            showToast({
                variant: 'error',
                title: 'Не всё удалось переслать',
                description: `Успешно: ${successCount}. Ошибок: ${failedCount}.`,
            });
            return;
        }

        showToast({
            variant: 'success',
            title: 'Сообщение переслано',
            description: `Получателей: ${successCount}.`,
        });
    };

    const handleSend = () => {
        if (selected.size === 0) return;
        const userIds = Array.from(selected);
        setSelected(new Set());
        setQuery('');
        onClose();
        showToast({
            variant: 'info',
            title: 'Пересылаем в фоне',
            description: `Получателей: ${userIds.length}. Можно продолжать работу.`,
        });
        void forwardInBackground(userIds);
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={(v) => !v && onClose()}
            title="Переслать"
            description={`Выберите чаты, куда переслать ${messageIds.length} сообщ.`}
            contentClassName="sm:max-w-lg"
            footer={
                <>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSend}
                        disabled={
                            selected.size === 0 ||
                            forwardMutation.isPending ||
                            ensureChatPending
                        }
                    >
                        {forwardMutation.isPending || ensureChatPending
                            ? 'Отправка…'
                            : `Переслать в ${selected.size}`}
                    </Button>
                </>
            }
        >
            <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск подписчика…"
            />
            <div className="mt-3 max-h-[50vh] overflow-auto">
                {usersLoading ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Загружаем подписчиков…
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Ничего не найдено
                    </p>
                ) : (
                    <ul className="flex flex-col gap-1">
                        {filtered.map((user) => {
                            const isSelected = selected.has(user.id);
                            return (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(user.id)}
                                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onClick={(e) => e.stopPropagation()}
                                            onCheckedChange={() => toggle(user.id)}
                                        />
                                        <Avatar
                                            src={null}
                                            name={user.name}
                                            size="sm"
                                            className="shrink-0"
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium">
                                                {user.name || 'Пользователь'}
                                            </span>
                                            <span className="block truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </AppDialog>
    );
}
