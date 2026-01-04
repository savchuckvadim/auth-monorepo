'use client';

import { Message } from '../../lib/types/messages.types';
import { MessageItem } from '../MessageItem';

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({ messages, currentUserId, messagesEndRef }: MessageListProps) => {
    if (messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    Нет сообщений. Начните диалог!
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {messages.map((message: Message, index) => {
                const isOwn = message.senderId === currentUserId;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
                return (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                    />
                );
            })}
            <div ref={messagesEndRef} className="h-0" />
        </div>
    );
};

