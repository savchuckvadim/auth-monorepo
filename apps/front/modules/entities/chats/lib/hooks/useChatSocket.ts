import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectMessagesSocket } from '@/modules/shared/lib/socket/messages-socket';
import { Message, useMarkChatAsRead } from '@/modules/entities/messages';
import { scrollToBottomDeferred } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';
import {
    MessagesWsClientEvent,
    MessagesWsServerEvent,
} from '@/modules/entities/messages/lib/const/messages-ws-events';
import {
    invalidateChatsAndUnreadIfNotSelf,
    mergeIncomingMessageIntoChatCache,
} from '@/modules/entities/messages/lib/utils/incoming-message-cache.util';

interface UseChatSocketProps {
    chatId: string | null;
    userId: string | undefined;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatSocket = ({
    chatId,
    userId,
    messagesEndRef,
}: UseChatSocketProps) => {
    const queryClient = useQueryClient();
    const { mutate: markChatAsReadMutate } = useMarkChatAsRead();

    useEffect(() => {
        if (!userId || !chatId) return;

        const messagesSocket = connectMessagesSocket(userId);

        const handleNewMessage = (newMessage: Message) => {
            if (newMessage.chatId === chatId) {
                mergeIncomingMessageIntoChatCache(
                    queryClient,
                    chatId,
                    newMessage,
                );
                if (newMessage.senderId !== userId) {
                    markChatAsReadMutate(chatId);
                }
                invalidateChatsAndUnreadIfNotSelf(
                    queryClient,
                    userId,
                    newMessage.senderId,
                );
                scrollToBottomDeferred(messagesEndRef, 'auto');
            } else {
                void queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
                invalidateChatsAndUnreadIfNotSelf(
                    queryClient,
                    userId,
                    newMessage.senderId,
                );
            }
        };

        messagesSocket.on(MessagesWsServerEvent.NEW_MESSAGE, handleNewMessage);

        const handleChatRead = (payload: { chatId: string }) => {
            if (payload.chatId === chatId) {
                void queryClient.invalidateQueries({
                    queryKey: ['messages', 'chat', chatId],
                });
            }
        };
        messagesSocket.on(MessagesWsServerEvent.CHAT_READ, handleChatRead);

        const joinChat = () => {
            messagesSocket.emit('chat:join', { chatId }, (response: { error?: string } | null) => {
                if (response?.error) {
                    console.error('Chat join error:', response.error);
                }
            });
        };

        if (messagesSocket.connected) {
            joinChat();
        } else {
            const connectHandler = () => {
                joinChat();
                messagesSocket.off('connect', connectHandler);
            };
            messagesSocket.on('connect', connectHandler);
        }

        messagesSocket.on('reconnect', joinChat);

        return () => {
            messagesSocket.off(MessagesWsServerEvent.NEW_MESSAGE, handleNewMessage);
            messagesSocket.off(MessagesWsServerEvent.CHAT_READ, handleChatRead);
            if (chatId) {
                messagesSocket.emit(MessagesWsClientEvent.CHAT_LEAVE, { chatId });
            }
        };
    }, [chatId, userId, queryClient, messagesEndRef, markChatAsReadMutate]);
};
