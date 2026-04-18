'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteChat } from '@/modules/entities/chats';
import { getNetworkChatsListPath } from '@/modules/entities/chats/lib/routes/network-chat.routes';

export function useDeleteChatSetting(chatId: string) {
    const router = useRouter();
    const deleteChat = useDeleteChat();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const confirmDelete = useCallback(async () => {
        await deleteChat.mutateAsync(chatId);
        setConfirmOpen(false);
        router.push(getNetworkChatsListPath());
    }, [chatId, deleteChat, router]);

    return {
        confirmOpen,
        setConfirmOpen,
        confirmDelete,
        deleteChatPending: deleteChat.isPending,
    };
}
