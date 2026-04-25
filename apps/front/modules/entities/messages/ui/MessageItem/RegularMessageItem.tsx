'use client';

import { cn } from '@workspace/ui/lib/utils';
import { Avatar } from '@/modules/shared/ui/Avatar';
import { MessageContextMenu } from '../MessageContextMenu';
import { ForwardMessagesModal } from '@/modules/features/chat/ForwardMessagesModal';
import { useMessageItem } from './useMessageItem';
import { MessageItemBubble } from './MessageItemBubble';
import type { MessageItemProps } from './MessageItem.types';

export function RegularMessageItem(props: MessageItemProps) {
    const { message, isOwn, showAvatar = true, onRetryFailed } = props;
    const item = useMessageItem(props);

    if (item.hidden) {
        return null;
    }

    return (
        <div
            data-message-id={message.id}
            className={cn(
                'group mb-4 flex min-w-0 max-w-full gap-3 rounded-lg transition-shadow',
                isOwn ? 'flex-row-reverse' : 'flex-row',
            )}
        >
            {showAvatar && !isOwn ? (
                <div className="shrink-0">
                    <Avatar
                        src=""
                        name={message.sender?.name}
                        size="md"
                        isOnline={item.senderOnline}
                    />
                </div>
            ) : null}
            <div
                className={cn(
                    'flex min-w-0 flex-1 flex-col',
                    isOwn ? 'items-end' : 'items-start',
                    showAvatar && !isOwn
                        ? 'max-w-[min(70%,calc(100%-4rem))]'
                        : 'max-w-[min(70%,100%)]',
                )}
            >
                {!isOwn && showAvatar ? (
                    <p className="mb-1 max-w-full px-1 text-xs font-medium text-muted-foreground">
                        {message.sender?.name || 'Пользователь'}
                    </p>
                ) : null}
                <div
                    className={cn(
                        'flex min-w-0 max-w-full items-center gap-1',
                        isOwn ? 'flex-row-reverse' : 'flex-row',
                    )}
                >
                    <MessageItemBubble
                        message={message}
                        isOwn={isOwn}
                        displayContent={item.displayContent}
                        failed={item.failed}
                        pending={item.pending}
                        readByPeer={item.readByPeer}
                        showDeliveryTicks={item.showDeliveryTicks}
                        onRetryFailed={onRetryFailed}
                        onReplyQuoteClick={item.handleReplyQuoteClick}
                    />
                    <MessageContextMenu
                        isOwn={isOwn}
                        copyDisabled={!item.canCopy}
                        actions={item.contextMenuActions}
                    />
                </div>
            </div>
            {item.forwardOpen ? (
                <ForwardMessagesModal
                    open={item.forwardOpen}
                    onClose={() => item.setForwardOpen(false)}
                    messageIds={[message.id]}
                />
            ) : null}
        </div>
    );
}
