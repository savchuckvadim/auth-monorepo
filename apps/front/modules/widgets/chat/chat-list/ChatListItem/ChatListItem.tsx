'use client';

import { ChatDtoEncryptionMode } from '@workspace/nest-api';
import { Check, CheckCheck, Lock } from 'lucide-react';
import { FC } from 'react';

import type { Chat } from '@/modules/entities/chats';
import { ChatType } from '@/modules/entities/chats';
import { UnreadCountBadge } from '@/modules/entities/messages';
import { Avatar } from '@/modules/shared';
import { cn } from '@workspace/ui/lib/utils';

import { useChatListItem } from '../lib/hooks/useChatListItem';

export type ChatListItemProps = {
    chat: Chat;
    currentUserId: string;
};

export const ChatListItem: FC<ChatListItemProps> = ({
    chat,
    currentUserId,
}) => {
    const {
        chatName,
        isOnline,
        timeLabel,
        preview,
        showOutgoingTicks,
        lastMessageOutgoingRead,
        handleChatSelect,
    } = useChatListItem(chat, currentUserId);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleChatSelect}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChatSelect();
                }
            }}
            className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl bg-card p-4 transition-colors hover:bg-foreground/10',
            )}
        >
            <div className="relative">
                <Avatar
                    src=""
                    name={chatName}
                    size="md"
                    isOnline={isOnline}
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-medium">
                        {chat.type === ChatType.PRIVATE &&
                            chat.encryptionMode ===
                                ChatDtoEncryptionMode.SIGNAL && (
                                <Lock
                                    className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                                    aria-hidden
                                />
                            )}
                        <span className="truncate">{chatName}</span>
                    </p>
                    {timeLabel ? (
                        <span className="shrink-0 tabular-nums text-[11px] text-muted-foreground">
                            {timeLabel}
                        </span>
                    ) : null}
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-1">
                    {showOutgoingTicks && (
                        <span
                            className="inline-flex shrink-0 text-muted-foreground"
                            title={
                                lastMessageOutgoingRead
                                    ? 'Прочитано'
                                    : 'Доставлено'
                            }
                            aria-hidden
                        >
                            {lastMessageOutgoingRead ? (
                                <CheckCheck className="h-3.5 w-3.5" />
                            ) : (
                                <Check className="h-3.5 w-3.5" />
                            )}
                        </span>
                    )}
                    {preview ? (
                        <p className="truncate text-xs text-muted-foreground">
                            {preview}
                        </p>
                    ) : null}
                </div>
            </div>
            <UnreadCountBadge
                variant="list"
                count={chat.unreadCount ?? 0}
            />
        </div>
    );
};
