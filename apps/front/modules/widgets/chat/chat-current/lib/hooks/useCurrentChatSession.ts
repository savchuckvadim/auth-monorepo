'use client';

import { useParams } from 'next/navigation';
import { Chat, useChatById, useUserChats } from '@/modules/entities/chats';
import { useChatMessages, type Message } from '@/modules/entities/messages';
import { useAuth } from '@/modules/processes';

type UseCurrentChatSessionOptions = {
    /** Если не передан — берётся из `useParams().chatId` */
    chatId?: string | null;
};

export function useCurrentChatSession(options: UseCurrentChatSessionOptions = {}) {
    const { chatId: chatIdProp } = options;
    const params = useParams();
    const chatId =
        chatIdProp !== undefined
            ? chatIdProp
            : ((params?.chatId as string) || null);

    const { currentUser } = useAuth();
    const currentUserId = currentUser?.id ?? '';

    const { data: chats } = useUserChats();
    const { data: chatById } = useChatById(chatId ?? '');
    const selectedChat =
        (chatById ? (chatById as Chat) : undefined) ??
        (chats as Chat[] | undefined)?.find((c) => c.id === chatId);

    const { data: messages, isLoading: messagesLoading } = useChatMessages(
        chatId || '',
        50,
        0,
    );

    const sortedMessages: Message[] = messages
        ? (messages as unknown as Message[])
        : [];

    return {
        chatId,
        currentUserId,
        selectedChat,
        messages: sortedMessages,
        messagesLoading,
    };
}
