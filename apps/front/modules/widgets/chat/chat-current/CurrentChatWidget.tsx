'use client';

import type { RefObject } from 'react';
import { CurrentChatHeader } from './components/CurrentChatHeader';
import { CurrentChatMessages } from './components/CurrentChatMessages';
import { NoChatSelectedPlaceholder } from './components/NoChatSelectedPlaceholder';
import { useCurrentChatSession } from './lib/hooks';

export type CurrentChatWidgetProps = {
    messagesEndRef: RefObject<HTMLDivElement | null>;
    /** When not under `/network/chats/[chatId]` (e.g. legacy `/network/chats`). */
    chatId?: string | null;
    onRetryFailed?: (tempMessageId: string) => void;
};

/**
 * Активный диалог: шапка + область сообщений (без поля ввода).
 * Поле ввода — отдельно {@link ChatInputWidget}.
 */
export function CurrentChatWidget({
    messagesEndRef,
    chatId: chatIdProp,
    onRetryFailed,
}: CurrentChatWidgetProps) {
    const {
        chatId,
        currentUserId,
        selectedChat,
        messages,
        messagesLoading,
    } = useCurrentChatSession({ chatId: chatIdProp });

    if (!chatId) {
        return <NoChatSelectedPlaceholder />;
    }

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden   bg-card">
            <CurrentChatHeader
                chatId={chatId}
                currentUserId={currentUserId}
                selectedChat={selectedChat}
            />
            <CurrentChatMessages
                messages={messages}
                messagesLoading={messagesLoading}
                currentUserId={currentUserId}
                chatId={chatId}
                messagesEndRef={messagesEndRef}
                onRetryFailed={onRetryFailed}
            />
        </div>
    );
}
