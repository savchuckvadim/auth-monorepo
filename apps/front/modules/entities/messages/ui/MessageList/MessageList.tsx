'use client';

import { Empty } from '@/modules/shared';
import { Message, NO_MESSAGES_MESSAGE } from '../../lib/types/messages.types';
import { MessageItem } from '../MessageItem';

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({ messages, currentUserId, messagesEndRef }: MessageListProps) => {

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

