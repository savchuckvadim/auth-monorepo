import { cn } from '@workspace/ui/lib/utils';
import { ReplyQuote } from '../ReplyQuote';
import { MessageAttachmentList } from '../MessageAttachmentList';
import { MessageItemMeta } from './MessageItemMeta';
import type { Message } from '../../lib/types/messages.types';

type MessageItemBubbleProps = {
    message: Message;
    isOwn: boolean;
    displayContent: string;
    failed: boolean;
    pending: boolean;
    readByPeer: boolean;
    showDeliveryTicks: boolean;
    onRetryFailed?: (tempMessageId: string) => void;
    onReplyQuoteClick: () => void;
};

export function MessageItemBubble({
    message,
    isOwn,
    displayContent,
    failed,
    pending,
    readByPeer,
    showDeliveryTicks,
    onRetryFailed,
    onReplyQuoteClick,
}: MessageItemBubbleProps) {
    return (
        <div
            className={cn(
                'min-w-0 max-w-full rounded-lg px-4 py-2',
                isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
            )}
        >
            {message.replyTo ? (
                <ReplyQuote
                    senderName={message.replyTo.sender?.name}
                    snippet={
                        message.replyTo.isEncrypted
                            ? '[Зашифрованное сообщение]'
                            : message.replyTo.content
                    }
                    tone={isOwn ? 'own' : 'incoming'}
                    onClick={message.replyToId ? onReplyQuoteClick : undefined}
                />
            ) : null}
            {message.attachments && message.attachments.length > 0 ? (
                <MessageAttachmentList
                    attachments={message.attachments}
                    isOwn={isOwn}
                />
            ) : null}
            {displayContent ? (
                <p
                    className="max-w-full text-sm [overflow-wrap:anywhere] break-words whitespace-pre-wrap"
                    lang="ru"
                >
                    {displayContent}
                </p>
            ) : null}
            <MessageItemMeta
                message={message}
                isOwn={isOwn}
                failed={failed}
                pending={pending}
                readByPeer={readByPeer}
                showDeliveryTicks={showDeliveryTicks}
                onRetryFailed={onRetryFailed}
            />
        </div>
    );
}
