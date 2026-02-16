'use client';

import { Message } from '../../lib/types/messages.types';
import { Avatar } from '@/modules/shared/ui/Avatar';
import { cn } from '@workspace/ui/lib/utils';

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
}

export const MessageItem = ({ message, isOwn, showAvatar = true }: MessageItemProps) => {
    return (
        <div className={cn('flex gap-3 mb-4', isOwn ? 'flex-row-reverse' : 'flex-row')}>
            {showAvatar && !isOwn && (
                <Avatar
                    src={''}
                    name={message.sender?.name}
                    size="md"
                    isOnline={false} // TODO: добавить логику определения онлайн статуса
                />
            )}
            <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start', showAvatar && !isOwn ? 'max-w-[calc(100%-4rem)]' : 'max-w-[70%]')}>
                {!isOwn && showAvatar && (
                    <p className="text-xs font-medium mb-1 text-muted-foreground px-1">
                        {message.sender?.name || 'Пользователь'}
                    </p>
                )}
                <div
                    className={cn(
                        'rounded-lg px-4 py-2',
                        isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                    )}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={cn('text-xs mt-1', isOwn ? 'opacity-70' : 'text-muted-foreground')}>
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

