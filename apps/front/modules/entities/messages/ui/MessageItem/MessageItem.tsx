'use client';

import { Message } from '../../lib/types/messages.types';

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
}

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}
            >
                {!isOwn && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                        {message.sender?.name || 'Пользователь'}
                    </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
};

