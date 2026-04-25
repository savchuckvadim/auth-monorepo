import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateMessage } from '@/modules/entities/messages';
import { Message, MessageType } from '@/modules/entities/messages';
import { MAX_CHAT_MESSAGE_LENGTH } from '@/modules/entities/messages/lib/const/message-limits';
import {
    loadOutboxMessagesForChat,
    removeFailedMessageFromOutbox,
    saveFailedMessageToOutbox,
} from '@/modules/entities/messages/lib/utils/failed-message-outbox';
import { scrollToBottomDeferred } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';
import type { Chat } from '../types/chats.types';
import {
    encryptOutgoingForSignalChat,
    ensureLocalSignalDeviceRegistered,
    rememberSentPlaintext,
} from '@/modules/entities/encryption';
import { ChatDtoEncryptionMode, UserDto } from '@workspace/nest-api';
import { useExhaustingCallback } from '@/modules/shared';

interface UseSendMessageProps {
    chatId: string | null;
    currentUser: UserDto | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    /** When set, used to choose plaintext vs Signal E2EE send path. */
    chat?: Chat | null;
}

const messagesQueryKey = (id: string) =>
    ['messages', 'chat', id, 50, 0] as const;

export const useSendMessage = ({
    chatId,
    currentUser,
    messagesEndRef,
    chat,
}: UseSendMessageProps) => {
    const queryClient = useQueryClient();
    const createMessageMutation = useCreateMessage();
    const [isSending, setIsSending] = useState(false);

    /** Подмешать неотправленные из localStorage при входе в чат. */
    useEffect(() => {
        if (!chatId || !currentUser?.id) return;
        const restored = loadOutboxMessagesForChat(chatId, {
            id: currentUser.id,
            name: currentUser.name ?? '',
            email: currentUser.email ?? '',
        });
        if (restored.length === 0) return;
        queryClient.setQueryData(
            messagesQueryKey(chatId),
            (oldData: Message[] | undefined) => {
                const base = oldData ?? [];
                const ids = new Set(base.map((m) => m.id));
                const add = restored.filter((m) => !ids.has(m.id));
                if (add.length === 0) return base;
                return [...base, ...add];
            },
        );
    }, [chatId, currentUser?.id, currentUser?.name, currentUser?.email, queryClient]);

    const sendMessageBody = useCallback(
        async (
            content: string,
            options?: {
                replyToId?: string | null;
                attachmentIds?: string[];
                attachmentInputs?: Array<{
                    kind: string;
                    postId?: string;
                    snapshot?: unknown;
                }>;
            },
        ) => {
            if (!chatId || !currentUser) return;
            const attachmentIds = options?.attachmentIds ?? [];
            const attachmentInputs = options?.attachmentInputs ?? [];
            // Пустое содержание допустимо, если есть хотя бы одно вложение
            // (картинка/видео/файл без подписи).
            if (
                !content.trim() &&
                attachmentIds.length === 0 &&
                attachmentInputs.length === 0
            ) {
                return;
            }

            const messageText = content.trim();
            if (messageText.length > MAX_CHAT_MESSAGE_LENGTH) {
                return;
            }

            const encryptionMode =
                chat?.encryptionMode ?? ChatDtoEncryptionMode.NONE;

            const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

            const replyToId = options?.replyToId ?? undefined;

            const cachedMessages =
                queryClient.getQueryData<Message[]>(messagesQueryKey(chatId)) ??
                [];
            const replyToMessage = replyToId
                ? cachedMessages.find((m) => m.id === replyToId)
                : undefined;

            const tempMessage: Message = {
                id: tempId,
                chatId,
                senderId: currentUser.id,
                content: messageText,
                type: MessageType.TEXT,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sender: {
                    id: currentUser.id,
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                },
                isEncrypted: false,
                replyToId,
                replyTo: replyToMessage,
                _clientStatus: 'sending',
            };

            queryClient.setQueryData(
                messagesQueryKey(chatId),
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [tempMessage];
                    return [...oldData, tempMessage];
                },
            );
            setTimeout(() => {
                scrollToBottomDeferred(messagesEndRef, 'auto');
            }, 50);

            setIsSending(true);
            try {
                if (encryptionMode === ChatDtoEncryptionMode.SIGNAL) {
                    if (chat?.type !== 'PRIVATE') {
                        throw new Error(
                            'Групповые чаты с E2EE пока не поддерживаются (только 1:1 SIGNAL)',
                        );
                    }
                    const recipientUserId = chat.members?.find(
                        (m) => m.userId !== currentUser.id,
                    )?.userId;
                    if (!recipientUserId) {
                        throw new Error('Не найден получатель для E2EE');
                    }
                    const { serverDeviceId } =
                        await ensureLocalSignalDeviceRegistered();
                    const payloads = await encryptOutgoingForSignalChat(
                        recipientUserId,
                        messageText,
                        serverDeviceId,
                    );
                    const sent: Message[] = [];
                    for (const p of payloads) {
                        const m = await createMessageMutation.mutateAsync({
                            chatId,
                            content: p.content,
                            type: MessageType.TEXT,
                            isEncrypted: true,
                            toDeviceId: p.toDeviceId,
                            senderDeviceId: p.senderDeviceId,
                            signalMessageType: p.signalMessageType,
                            registrationId: p.registrationId,
                            replyToId,
                        });
                        const row = {
                            ...(m as Message),
                            replyTo: (m as Message).replyTo ?? replyToMessage,
                        };
                        sent.push(row);
                        if (row?.id) {
                            rememberSentPlaintext(row.id, messageText);
                        }
                    }
                    queryClient.setQueryData(
                        messagesQueryKey(chatId),
                        (oldData: Message[] | undefined) => {
                            const base = (oldData ?? []).filter(
                                (msg: Message) => msg.id !== tempId,
                            );
                            const next = [...base, ...sent];
                            const seen = new Set<string>();
                            return next.filter((m) => {
                                if (seen.has(m.id)) return false;
                                seen.add(m.id);
                                return true;
                            });
                        },
                    );
                } else {
                    // attachmentIds пока не в orval-типе CreateMessageDto —
                    // прокидываем через приведение, бэк-DTO уже расширен.
                    const sentMessage = await createMessageMutation.mutateAsync({
                        chatId,
                        content: messageText,
                        replyToId,
                        ...(attachmentIds.length > 0
                            ? { attachmentIds }
                            : {}),
                        ...(attachmentInputs.length > 0
                            ? { attachmentInputs }
                            : {}),
                    } as unknown as Parameters<
                        typeof createMessageMutation.mutateAsync
                    >[0]);
                    const messageData = {
                        ...(sentMessage as Message),
                        replyTo:
                            (sentMessage as Message).replyTo ?? replyToMessage,
                    };
                    queryClient.setQueryData(
                        messagesQueryKey(chatId),
                        (oldData: Message[] | undefined) => {
                            if (!oldData) {
                                return [messageData];
                            }
                            const filtered = oldData.filter(
                                (msg: Message) => msg.id !== tempId,
                            );
                            const exists = filtered.some(
                                (msg: Message) => msg.id === messageData.id,
                            );
                            if (exists) return filtered;
                            return [...filtered, messageData];
                        },
                    );
                }

                removeFailedMessageFromOutbox(tempId);
                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });

                setTimeout(() => {
                    scrollToBottomDeferred(messagesEndRef, 'auto');
                }, 100);
            } catch (error) {
                console.error('Failed to send message:', error);
                saveFailedMessageToOutbox(tempId, chatId, messageText);
                queryClient.setQueryData(
                    messagesQueryKey(chatId),
                    (oldData: Message[] | undefined) => {
                        if (!oldData) return [];
                        return oldData.map((msg: Message) =>
                            msg.id === tempId
                                ? { ...msg, _clientStatus: 'failed' as const }
                                : msg,
                        );
                    },
                );
                throw error;
            } finally {
                setIsSending(false);
            }
        },
        [
            chatId,
            chat,
            currentUser,
            createMessageMutation,
            messagesEndRef,
            queryClient,
        ],
    );

    const sendMessage = useExhaustingCallback(sendMessageBody);

    const retryFailedMessage = useCallback(
        (failedTempId: string) => {
            if (!chatId || !currentUser) return;
            const data = queryClient.getQueryData(
                messagesQueryKey(chatId),
            ) as Message[] | undefined;
            const msg = data?.find((m) => m.id === failedTempId);
            if (!msg || msg._clientStatus !== 'failed') return;
            const text = msg.content;
            removeFailedMessageFromOutbox(failedTempId);
            queryClient.setQueryData(
                messagesQueryKey(chatId),
                (oldData: Message[] | undefined) =>
                    (oldData ?? []).filter((m) => m.id !== failedTempId),
            );
            void sendMessage(text);
        },
        [chatId, currentUser, queryClient, sendMessage],
    );

    return {
        sendMessage,
        retryFailedMessage,
        isPending: isSending || createMessageMutation.isPending,
    };
};
