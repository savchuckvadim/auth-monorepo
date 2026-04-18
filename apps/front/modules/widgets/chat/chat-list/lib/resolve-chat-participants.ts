import type { ChatMemberDto, UserDto } from '@workspace/nest-api';

import type { Chat } from '@/modules/entities/chats';
import { ChatType } from '@/modules/entities/chats';

/** Участники чата относительно текущего пользователя: «я», остальные, peer в private, все «другие» в группе. */
export type ResolvedChatParticipants = {
    /** Запись участника с userId === currentUserId */
    me: ChatMemberDto | undefined;
    /** Все участники кроме текущего пользователя */
    others: ChatMemberDto[];
    /** PRIVATE: собеседник; GROUP: undefined */
    peerUser: UserDto | undefined;
    /** Пользователи всех «остальных» участников (удобно для группы и списков) */
    peerUsers: UserDto[];
};

export function resolveChatParticipants(
    chat: Chat,
    currentUserId: string,
): ResolvedChatParticipants {
    const members = chat.members ?? [];
    const me = members.find((m) => m.userId === currentUserId);
    const others = members.filter((m) => m.userId !== currentUserId);
    const peerUser =
        chat.type === ChatType.PRIVATE ? others[0]?.user : undefined;
    const peerUsers = others
        .map((m) => m.user)
        .filter((u): u is UserDto => u != null);

    return { me, others, peerUser, peerUsers };
}
