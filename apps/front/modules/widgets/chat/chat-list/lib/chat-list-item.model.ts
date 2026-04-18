import type { MessageDto } from '@workspace/nest-api';

import type { Chat } from '@/modules/entities/chats';
import { ChatType } from '@/modules/entities/chats';

import type { ResolvedChatParticipants } from './resolve-chat-participants';

export function getChatListTitle(
    chat: Chat,
    participants: ResolvedChatParticipants,
): string {
    if (chat.type === ChatType.PRIVATE) {
        return participants.peerUser?.name ?? 'Пользователь';
    }
    return chat.name || 'Групповой чат';
}

export function getChatListLastActivityAt(chat: Chat): string {
    const last = chat.lastMessage;
    return last?.createdAt ?? chat.updatedAt;
}

export function getChatListPreviewText(last: MessageDto | null | undefined): string {
    if (!last) return '';
    if (last.isEncrypted === true) return 'Защищённое сообщение';
    return last.content ?? '';
}

export function getChatListShowOutgoingTicks(
    chat: Chat,
    currentUserId: string,
): boolean {
    const last = chat.lastMessage;
    return (
        chat.type === ChatType.PRIVATE &&
        !!last &&
        last.senderId === currentUserId
    );
}
