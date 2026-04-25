import { cn } from '@workspace/ui/lib/utils';
import { MessageLikeButton } from '../MessageLikeButton';
import { MessageDeliveryStatus } from './MessageDeliveryStatus';
import type { Message } from '../../lib/types/messages.types';

type MessageItemMetaProps = {
    message: Message;
    isOwn: boolean;
    failed: boolean;
    pending: boolean;
    readByPeer: boolean;
    showDeliveryTicks: boolean;
    onRetryFailed?: (tempMessageId: string) => void;
};

export function MessageItemMeta({
    message,
    isOwn,
    failed,
    pending,
    readByPeer,
    showDeliveryTicks,
    onRetryFailed,
}: MessageItemMetaProps) {
    return (
        <div
            className={cn(
                'mt-1 flex flex-wrap items-center gap-2 w-full',
                isOwn ? 'justify-between' : 'justify-start',
            )}
        >
            {message.isEdited || message.editedAt ? (
                <span
                    className={cn(
                        'text-[11px] italic',
                        isOwn ? 'opacity-70' : 'text-muted-foreground',
                    )}
                >
                    изменено
                </span>
            ) : null}
            {!message.isEncrypted && (
                <MessageLikeButton
                    messageId={message.id}
                    isLiked={Boolean(message.isLiked)}

                />
            )}
            <div className='flex items-center gap-1'>
                <p
                    className={cn(
                        'text-xs',
                        isOwn ? 'opacity-70' : 'text-muted-foreground',
                    )}
                >
                    {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                {isOwn ? (
                    <MessageDeliveryStatus
                        messageId={message.id}
                        failed={failed}
                        pending={pending}
                        readByPeer={readByPeer}
                        showDeliveryTicks={showDeliveryTicks}
                        onRetryFailed={onRetryFailed}
                    />
                ) : null}
            </div>
        </div>
    );
}
