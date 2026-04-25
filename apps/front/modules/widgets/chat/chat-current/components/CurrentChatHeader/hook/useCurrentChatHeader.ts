import { usePresence } from "@/modules/entities";
import { Chat, ChatMemberDto, ChatType, useEnsurePrivateChat, useIsSignalChat } from "@/modules/entities/chats";

export function useCurrentChatHeader(
    currentUserId: string,
    selectedChat: Chat | undefined,
) {
    const { getIsUserOnline } = usePresence();
    const { navigateToPrivateChat, isPending: navigatePending } =
        useEnsurePrivateChat();

    const otherUser =
        selectedChat?.members?.find(
            (m: ChatMemberDto) => m.userId !== currentUserId,
        ) ?? null;

    const chatName =
        selectedChat?.type === ChatType.PRIVATE
            ? otherUser?.user?.name || 'Пользователь'
            : selectedChat?.name || 'Групповой чат';

    const otherUserId = otherUser?.userId || '';
    const isOnline = getIsUserOnline(otherUserId);
    const isPrivate = selectedChat?.type === ChatType.PRIVATE;
    const isSignal = useIsSignalChat(selectedChat);
    const hasScheduledChatDeletion = Boolean(selectedChat?.scheduledDeletionAt);
    const disappearingSec = selectedChat?.disappearingMessageSeconds ?? 0;
    const hasDisappearingMessages = disappearingSec > 0;
    const isGroup = selectedChat?.type === ChatType.GROUP;

    return {
        chatName,
        otherUserId,
        otherUser,
        disappearingSec,
        isOnline,
        isPrivate,
        isSignal,
        hasScheduledChatDeletion,
        hasDisappearingMessages,
        isGroup,
        navigateToPrivateChat,
        navigatePending,
    };
}
