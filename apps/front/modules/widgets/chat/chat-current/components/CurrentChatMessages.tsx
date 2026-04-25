'use client';

import type { RefObject } from 'react';
import {
    MessageList,
    NO_MESSAGES_MESSAGE,
    TypingDots,
    useTypingListener,
} from '@/modules/entities/messages';
import type { Message } from '@/modules/entities/messages';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { Empty } from '@/modules/shared';

export type CurrentChatMessagesProps = {
    messages: Message[];
    messagesLoading: boolean;
    currentUserId: string;
    chatId?: string | null;
    messagesEndRef: RefObject<HTMLDivElement | null>;
    onRetryFailed?: (tempMessageId: string) => void;
};

export function CurrentChatMessages({
    messages,
    messagesLoading,
    currentUserId,
    chatId,
    messagesEndRef,
    onRetryFailed,
}: CurrentChatMessagesProps) {
    const typingUsers = useTypingListener({
        chatId: chatId ?? null,
        currentUserId,
    });

    const typingIndicator = typingUsers.length > 0 ? (
        <div className="mt-2 flex items-center gap-2 pl-2">
            <TypingDots />
            <span className="text-xs text-muted-foreground">
                {typingUsers.length === 1
                    ? 'печатает…'
                    : 'печатают…'}
            </span>
        </div>
    ) : null;

    if (messages.length === 0) {
        return (
            <div className="flex min-h-0 flex-1 items-center justify-center bg-card">
                {typingUsers.length > 0 ? (
                    <TypingDots label="печатает…" />
                ) : (
                    <Empty text={NO_MESSAGES_MESSAGE} />
                )}
            </div>
        );
    }

    return (
        <div
            className="min-h-0 flex-1 overflow-y-auto p-4"
            data-messages-scroll-root
        >
            {messagesLoading ? (
                <LoadingComponent />
            ) : (
                <>
                    <MessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        messagesEndRef={messagesEndRef}
                        onRetryFailed={onRetryFailed}
                    />
                    {typingIndicator}
                </>
            )}
        </div>
    );
}
