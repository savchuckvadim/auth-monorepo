'use client';

import { Fragment, useMemo } from 'react';
import { Message, MessageType } from '../../lib/types/messages.types';
import { dayKeyForMessage } from '../../lib/utils/message-day-label.util';
import { MessageItem } from '../MessageItem';
import { MessageDaySeparator } from '../MessageDaySeparator';

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
                const prevDay = prevMessage
                    ? dayKeyForMessage(prevMessage.createdAt)
                    : null;
                const day = dayKeyForMessage(message.createdAt);
                const showDaySeparator = prevDay !== day;

                const showAvatar =
                    message.type !== MessageType.SYSTEM &&
                    (!prevMessage ||
                        prevMessage.type === MessageType.SYSTEM ||
                        prevMessage.senderId !== message.senderId);

                return (
                    <Fragment key={message.id}>
                        {showDaySeparator ? (
                            <MessageDaySeparator date={message.createdAt} />
                        ) : null}
                        <MessageItem
                            message={message}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                            onRetryFailed={onRetryFailed}
                        />
                    </Fragment>
                );
            })}
            <div ref={messagesEndRef} className="h-0" />
        </div>
    );
};
