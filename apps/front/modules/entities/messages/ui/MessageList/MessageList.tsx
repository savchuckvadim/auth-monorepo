'use client';

import { useMemo } from 'react';
import { Message } from '../../lib/types/messages.types';
import { MessageItem } from '../MessageItem';

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onRetryFailed?: (tempMessageId: string) => void;
}

export const MessageList = ({
    messages,
    currentUserId,
    messagesEndRef,
    onRetryFailed,
}: MessageListProps) => {
    const ordered = useMemo(() => {
        const sorted = [...messages].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        );
        const seen = new Set<string>();
        return sorted.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });
    }, [messages]);
    return (
        <div className="flex min-w-0 flex-col">
            {ordered.map((message: Message, index) => {
                const isOwn = message.senderId === currentUserId;
                const prevMessage = index > 0 ? ordered[index - 1] : null;
                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
                return (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        onRetryFailed={onRetryFailed}
                    />
                );
            })}
            <div ref={messagesEndRef} className="h-0" />
        </div>
    );
};

