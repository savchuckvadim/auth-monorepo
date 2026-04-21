import {
    ChatDtoEncryptionMode,
    ChatDtoType,
    type ChatDto,
} from '@workspace/nest-api';

/** Minimal chat shape for lookup (matches `ChatDto`). */
export type PrivateChatLookup = Pick<
    ChatDto,
    'id' | 'type' | 'encryptionMode' | 'members'
>;

/**
 * Finds a private 1:1 chat between `currentUserId` and `peerUserId` with the given encryption mode.
 */
export function findPrivateChatWithPeer(
    chats: PrivateChatLookup[] | undefined,
    currentUserId: string,
    peerUserId: string,
    encryptionMode: ChatDtoEncryptionMode,
): PrivateChatLookup | undefined {
    if (!chats?.length) return undefined;
    for (const chat of chats) {
        if (chat.type !== ChatDtoType.PRIVATE) continue;
        if (chat.encryptionMode !== encryptionMode) continue;
        const members = chat.members;
        if (!members || members.length !== 2) continue;
        const ids = new Set(members.map(m => m.userId));
        if (ids.has(currentUserId) && ids.has(peerUserId)) {
            return chat;
        }
    }
    return undefined;
}
