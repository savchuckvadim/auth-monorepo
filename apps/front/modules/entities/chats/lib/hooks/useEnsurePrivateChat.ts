import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChatDtoEncryptionMode,
    CreateChatDtoType,
    type CreateChatDto,
} from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';
import { useCreateChat, useUserChats } from './useChats';
import {
    findPrivateChatWithPeer,
    type PrivateChatLookup,
} from '../utils/find-private-chat-with-peer';
import { getNetworkChatPath } from '../routes/network-chat.routes';

function getApiErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const res = (error as { response?: { data?: { message?: unknown } } })
            .response?.data?.message;
        if (typeof res === 'string') return res;
        if (Array.isArray(res)) return res.join(', ');
    }
    if (error instanceof Error) return error.message;
    return 'Не удалось открыть чат';
}

/**
 * Opens an existing private chat with the peer or creates one with the given `encryptionMode`, then navigates.
 */
export function useEnsurePrivateChat() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const { data: chats } = useUserChats();
    const createChatMutation = useCreateChat();

    const navigateToPrivateChat = useCallback(
        async (
            peerUserId: string,
            encryptionMode: ChatDtoEncryptionMode,
        ): Promise<void> => {
            if (!currentUser?.id) return;
            const list = chats as PrivateChatLookup[] | undefined;
            const existing = findPrivateChatWithPeer(
                list,
                currentUser.id,
                peerUserId,
                encryptionMode,
            );
            if (existing) {
                router.push(getNetworkChatPath(existing.id));
                return;
            }
            const body: CreateChatDto = {
                type: CreateChatDtoType.PRIVATE,
                memberIds: [currentUser.id, peerUserId],
                name: '',
                description: '',
                encryptionMode,
            };
            try {
                const chat = await createChatMutation.mutateAsync(body);
                router.push(getNetworkChatPath(chat.id));
            } catch (error) {
                window.alert(getApiErrorMessage(error));
                throw error;
            }
        },
        [chats, createChatMutation, currentUser?.id, router],
    );

    return {
        navigateToPrivateChat,
        isPending: createChatMutation.isPending,
    };
}
