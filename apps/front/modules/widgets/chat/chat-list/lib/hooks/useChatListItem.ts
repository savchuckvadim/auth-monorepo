'use client';

import { useRouter } from 'next/navigation';

import type { Chat } from '@/modules/entities/chats';
import { ChatType } from '@/modules/entities/chats';
import { usePresence } from '@/modules/entities/presence';

import {
    getChatListLastActivityAt,
    getChatListPreviewText,
    getChatListShowOutgoingTicks,
    getChatListTitle,
} from '../chat-list-item.model';
import { formatChatListMessageTime } from '../format-chat-list-message-time';
import { resolveChatParticipants } from '../resolve-chat-participants';

export function useChatListItem(chat: Chat, currentUserId: string) {
    const router = useRouter();
    const participants = resolveChatParticipants(chat, currentUserId);
    const { getIsUserOnline } = usePresence();

    const chatName = getChatListTitle(chat, participants);
    const last = chat.lastMessage;
    const lastActivityAt = getChatListLastActivityAt(chat);
    const timeLabel = formatChatListMessageTime(lastActivityAt);
    const preview = getChatListPreviewText(last);
    const showOutgoingTicks = getChatListShowOutgoingTicks(
        chat,
        currentUserId,
    );

    const primaryPeerId =
        chat.type === ChatType.PRIVATE
            ? participants.peerUser?.id ?? ''
            : '';
    const isOnline = primaryPeerId
        ? getIsUserOnline(primaryPeerId)
        : false;

    const handleChatSelect = () => {
        router.push(`/network/chats/${chat.id}`);
    };

    return {
        chat,
        chatName,
        me: participants.me,
        others: participants.others,
        peerUser: participants.peerUser,
        peerUsers: participants.peerUsers,
        isOnline,
        timeLabel,
        preview,
        showOutgoingTicks,
        lastMessageOutgoingRead: chat.lastMessageOutgoingRead,
        handleChatSelect,
    };
}
