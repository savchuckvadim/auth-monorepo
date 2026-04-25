'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ClientOutgoingStatus } from '../../lib/types/messages.types';
import type { MessageItemProps } from './MessageItem.types';
import {
    decryptSignalMessageContentSerialized,
    ensureLocalSignalDeviceRegistered,
    getIncomingPlaintext,
    getLocalMessengerServerDeviceId,
    getSentPlaintext,
    rememberIncomingPlaintext,
} from '@/modules/entities/encryption';
import { usePresence } from '@/modules/entities';
import { useCurrentChatComposer } from '@/modules/widgets/chat/chat-current/lib/context';
import { useDeleteMessage } from '../../lib/hooks/useMessages';

const UNDECRYPTABLE_PREFIXES = [
    '[Не удалось расшифровать',
    '[E2EE:',
] as const;

function isOwnUndisplayableEncrypted({
    message,
    isOwn,
}: Pick<MessageItemProps, 'message' | 'isOwn'>): boolean {
    return (
        Boolean(message.isEncrypted) &&
        isOwn &&
        !getSentPlaintext(message.id)
    );
}

function isIncomingForOtherDeviceSync({
    message,
    isOwn,
}: Pick<MessageItemProps, 'message' | 'isOwn'>): boolean {
    if (!message.isEncrypted || isOwn || !message.toDeviceId) return false;
    const localId = getLocalMessengerServerDeviceId();
    return Boolean(localId) && localId !== message.toDeviceId;
}

function isOutgoingPending(
    messageId: string,
    status: ClientOutgoingStatus | undefined,
): boolean {
    if (status === 'failed') return false;
    if (status === 'sending') return true;
    return messageId.startsWith('temp-') && status !== 'failed';
}

function isPlaceholderText(text: string): boolean {
    return UNDECRYPTABLE_PREFIXES.some((p) => text.startsWith(p));
}

function scrollToMessage(messageId: string | undefined): void {
    if (!messageId || typeof document === 'undefined') return;
    const el = document.querySelector<HTMLElement>(
        `[data-message-id="${CSS.escape(messageId)}"]`,
    );
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-2', 'ring-primary/70', 'ring-offset-2');
    window.setTimeout(() => {
        el.classList.remove('ring-2', 'ring-primary/70', 'ring-offset-2');
    }, 1400);
}

export function useMessageItem({ message, isOwn }: MessageItemProps) {
    const { getIsUserOnline } = usePresence();
    const { setReplyTarget, setEditTarget } = useCurrentChatComposer();
    const deleteMessageMutation = useDeleteMessage();
    const [displayContent, setDisplayContent] = useState(message.content);
    const [hideIncomingWrongDevice, setHideIncomingWrongDevice] =
        useState(false);
    const [forwardOpen, setForwardOpen] = useState(false);

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

    const derived = useMemo(() => {
        const hideOwnElsewhere = isOwnUndisplayableEncrypted({
            message,
            isOwn,
        });
        const hideIncomingOtherDeviceSync = isIncomingForOtherDeviceSync({
            message,
            isOwn,
        });
        const pending = isOwn && isOutgoingPending(message.id, message._clientStatus);
        const failed = message._clientStatus === 'failed';
        const isTempId = message.id.startsWith('temp-');
        const isPlaceholder = isPlaceholderText(displayContent);
        return {
            hidden:
                hideOwnElsewhere ||
                hideIncomingOtherDeviceSync ||
                hideIncomingWrongDevice,
            senderOnline:
                !isOwn && message.senderId
                    ? getIsUserOnline(message.senderId)
                    : false,
            readByPeer:
                isOwn &&
                Boolean(
                    message.readBy?.some((id) => id !== message.senderId),
                ),
            pending,
            failed,
            showDeliveryTicks: isOwn && !failed && !pending && !isTempId,
            canReply: !isTempId && !failed && !isPlaceholder,
            canCopy: !isPlaceholder,
            canEdit: isOwn && !message.isEncrypted && !isTempId && !failed,
            canDelete: isOwn && !isTempId && !failed,
            canForward:
                !isTempId && !failed && !message.isEncrypted && !isPlaceholder,
        };
    }, [
        displayContent,
        getIsUserOnline,
        hideIncomingWrongDevice,
        isOwn,
        message,
    ]);

    const handleReply = () => {
        if (!derived.canReply) return;
        setReplyTarget({
            messageId: message.id,
            senderName: message.sender?.name ?? 'Пользователь',
            snippet: message.isEncrypted
                ? '[Зашифрованное сообщение]'
                : displayContent,
            isEncrypted: Boolean(message.isEncrypted),
        });
    };

    const handleCopy = () => {
        if (!derived.canCopy) return;
        try {
            void navigator.clipboard?.writeText(displayContent);
        } catch (e) {
            console.warn('clipboard: не удалось скопировать', e);
        }
    };

    const handleEdit = () => {
        if (!derived.canEdit) return;
        setEditTarget({
            messageId: message.id,
            originalContent: displayContent,
        });
    };

    const handleDelete = () => {
        if (!derived.canDelete) return;
        const ok = window.confirm(
            'Удалить это сообщение? Действие нельзя отменить.',
        );
        if (!ok) return;
        void deleteMessageMutation.mutateAsync(message.id).catch((error) => {
            console.error('Не удалось удалить сообщение', error);
        });
    };

    const handleReplyQuoteClick = () => scrollToMessage(message.replyToId);

    return {
        displayContent,
        forwardOpen,
        setForwardOpen,
        handleReplyQuoteClick,
        contextMenuActions: {
            reply: derived.canReply ? handleReply : undefined,
            copy: derived.canCopy ? handleCopy : undefined,
            edit: derived.canEdit ? handleEdit : undefined,
            delete: derived.canDelete ? handleDelete : undefined,
            forward: derived.canForward ? () => setForwardOpen(true) : undefined,
        },
        ...derived,
    };
}
