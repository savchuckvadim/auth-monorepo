'use client';

import { useEffect, useState } from 'react';
import {
    Message,
    MessageType,
    type ClientOutgoingStatus,
} from '../../lib/types/messages.types';
import { Avatar } from '@/modules/shared/ui/Avatar';
import { cn } from '@workspace/ui/lib/utils';
import {
    decryptSignalMessageContentSerialized,
    ensureLocalSignalDeviceRegistered,
    getIncomingPlaintext,
    getLocalMessengerServerDeviceId,
    getSentPlaintext,
    rememberIncomingPlaintext,
} from '@/modules/entities/encryption';
import { SystemMessageNotice } from '../SystemMessageNotice/SystemMessageNotice';
import {
    AlertCircle,
    Check,
    CheckCheck,
    Loader2,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { usePresence } from '@/modules/entities';

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
    /** Повторить отправку после ошибки (temp id из outbox). */
    onRetryFailed?: (tempMessageId: string) => void;
}

/** Своё E2EE без локального кеша текста (отправляли с другого браузера/устройства). */
function isOwnUndisplayableEncrypted(message: Message, isOwn: boolean): boolean {
    return (
        Boolean(message.isEncrypted) &&
        isOwn &&
        !getSentPlaintext(message.id)
    );
}

/** Входящее E2EE, адресованное другому зарегистрированному устройству. */
function isIncomingForOtherDeviceSync(message: Message, isOwn: boolean): boolean {
    if (!message.isEncrypted || isOwn || !message.toDeviceId) return false;
    const localId = getLocalMessengerServerDeviceId();
    return Boolean(localId) && localId !== message.toDeviceId;
}

function isOutgoingPending(
    message: Message,
    status: ClientOutgoingStatus | undefined,
): boolean {
    if (status === 'failed') return false;
    if (status === 'sending') return true;
    return message.id.startsWith('temp-') && status !== 'failed';
}

const RegularMessageBubble = ({
    message,
    isOwn,
    showAvatar = true,
    onRetryFailed,
}: MessageItemProps) => {
    const { getIsUserOnline } = usePresence();
    const [displayContent, setDisplayContent] = useState(message.content);
    const [hideIncomingWrongDevice, setHideIncomingWrongDevice] =
        useState(false);

    const hideOwnElsewhere = isOwnUndisplayableEncrypted(message, isOwn);
    const hideIncomingOtherDeviceSync = isIncomingForOtherDeviceSync(
        message,
        isOwn,
    );
    const hidden =
        hideOwnElsewhere ||
        hideIncomingOtherDeviceSync ||
        hideIncomingWrongDevice;

    useEffect(() => {
        setHideIncomingWrongDevice(false);
    }, [message.id]);

    useEffect(() => {
        let cancelled = false;
        if (!message.isEncrypted) {
            setDisplayContent(message.content);
            return;
        }
        if (!message.senderClientDeviceId) {
            setDisplayContent(
                '[E2EE: нет метаданных устройства отправителя]',
            );
            return;
        }
        if (message.isEncrypted && isOwn && !getSentPlaintext(message.id)) {
            return;
        }
        const localId = getLocalMessengerServerDeviceId();
        if (
            !isOwn &&
            message.toDeviceId &&
            localId &&
            message.toDeviceId !== localId
        ) {
            return;
        }
        if (isOwn) {
            const cached = getSentPlaintext(message.id);
            if (cached) {
                setDisplayContent(cached);
            }
            return;
        }
        const cachedIncoming = getIncomingPlaintext(message.id);
        if (cachedIncoming) {
            setDisplayContent(cachedIncoming);
            return;
        }
        void (async () => {
            try {
                const { serverDeviceId } =
                    await ensureLocalSignalDeviceRegistered();
                if (cancelled) return;
                if (
                    message.toDeviceId &&
                    serverDeviceId !== message.toDeviceId
                ) {
                    setHideIncomingWrongDevice(true);
                    return;
                }
                const text = await decryptSignalMessageContentSerialized({
                    senderId: message.senderId,
                    senderClientDeviceId: message.senderClientDeviceId,
                    content: message.content,
                    signalMessageType: message.signalMessageType,
                });
                if (!cancelled) {
                    rememberIncomingPlaintext(message.id, text);
                    setDisplayContent(text);
                }
            } catch {
                if (!cancelled) {
                    setDisplayContent('[Не удалось расшифровать сообщение]');
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [
        message.id,
        message.content,
        message.isEncrypted,
        message.senderClientDeviceId,
        message.signalMessageType,
        message.senderId,
        message.toDeviceId,
        isOwn,
    ]);

    const readByPeer =
        isOwn &&
        Boolean(
            message.readBy?.some((id) => id !== message.senderId),
        );

    const senderOnline =
        !isOwn && message.senderId
            ? getIsUserOnline(message.senderId)
            : false;

    const pending = isOwn && isOutgoingPending(message, message._clientStatus);
    const failed = message._clientStatus === 'failed';
    const showDeliveryTicks =
        isOwn &&
        !failed &&
        !pending &&
        !message.id.startsWith('temp-');

    if (hidden) {
        return null;
    }

    return (
        <div
            className={cn(
                'mb-4 flex min-w-0 max-w-full gap-3',
                isOwn ? 'flex-row-reverse' : 'flex-row',
            )}
        >
            {showAvatar && !isOwn && (
                <div className="shrink-0">
                    <Avatar
                        src=""
                        name={message.sender?.name}
                        size="md"
                        isOnline={senderOnline}
                    />
                </div>
            )}
            <div
                className={cn(
                    'flex min-w-0 flex-1 flex-col',
                    isOwn ? 'items-end' : 'items-start',
                    showAvatar && !isOwn
                        ? 'max-w-[min(70%,calc(100%-4rem))]'
                        : 'max-w-[min(70%,100%)]',
                )}
            >
                {!isOwn && showAvatar && (
                    <p className="mb-1 max-w-full px-1 text-xs font-medium text-muted-foreground">
                        {message.sender?.name || 'Пользователь'}
                    </p>
                )}
                <div
                    className={cn(
                        'min-w-0 max-w-full rounded-lg px-4 py-2',
                        isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground',
                    )}
                >
                    <p
                        className="max-w-full text-sm [overflow-wrap:anywhere] break-words whitespace-pre-wrap"
                        lang="ru"
                    >
                        {displayContent}
                    </p>
                    <div
                        className={cn(
                            'mt-1 flex flex-wrap items-center gap-2',
                            isOwn ? 'justify-end' : 'justify-start',
                        )}
                    >
                        <p
                            className={cn(
                                'text-xs',
                                isOwn ? 'opacity-70' : 'text-muted-foreground',
                            )}
                        >
                            {new Date(message.createdAt).toLocaleTimeString(
                                'ru-RU',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            )}
                        </p>
                        {isOwn && (
                            <span className="inline-flex items-center gap-1">
                                {failed && onRetryFailed ? (
                                    <>
                                        <AlertCircle className="h-3.5 w-3.5 text-amber-200" />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[11px] text-primary-foreground hover:bg-primary-foreground/15"
                                            onClick={() =>
                                                onRetryFailed(message.id)
                                            }
                                        >
                                            Повторить
                                        </Button>
                                    </>
                                ) : null}
                                {pending ? (
                                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin opacity-80" />
                                ) : null}
                                {showDeliveryTicks ? (
                                    readByPeer ? (
                                        <CheckCheck
                                            className="h-3.5 w-3.5 shrink-0 text-emerald-300 drop-shadow-sm"
                                            aria-hidden
                                            aria-label="Прочитано"
                                        />
                                    ) : (
                                        <Check
                                            className="h-3.5 w-3.5 shrink-0 text-primary-foreground/80"
                                            aria-hidden
                                            aria-label="Отправлено"
                                        />
                                    )
                                ) : null}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MessageItem = (props: MessageItemProps) => {
    if (props.message.type === MessageType.SYSTEM) {
        return (
            <SystemMessageNotice
                content={props.message.content}
                createdAt={props.message.createdAt}
            />
        );
    }
    return <RegularMessageBubble {...props} />;
};
