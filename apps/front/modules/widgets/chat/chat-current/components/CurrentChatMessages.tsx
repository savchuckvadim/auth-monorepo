'use client';

import type { RefObject } from 'react';
import { MessageList, NO_MESSAGES_MESSAGE } from '@/modules/entities/messages';
import type { Message } from '@/modules/entities/messages';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { Empty } from '@/modules/shared';

export type CurrentChatMessagesProps = {
    messages: Message[];
    messagesLoading: boolean;
    currentUserId: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
    onRetryFailed?: (tempMessageId: string) => void;
};

export function CurrentChatMessages({
    messages,
    messagesLoading,
    currentUserId,
    messagesEndRef,
    onRetryFailed,
}: CurrentChatMessagesProps) {
    if (messages.length === 0) {
        return (
            <div className="flex min-h-0 flex-1 items-center justify-center bg-background">
                <Empty text={NO_MESSAGES_MESSAGE} />
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
                <MessageList
                    messages={messages}
                    currentUserId={currentUserId}
                    messagesEndRef={messagesEndRef}
                    onRetryFailed={onRetryFailed}
                />
            )}
        </div>
    );
}
