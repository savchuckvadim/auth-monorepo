/** Client ↔ server Socket.IO event names (default namespace). */
export const MessagesWsClientEvent = {
    SEND: 'message:send',
    CHAT_JOIN: 'chat:join',
    CHAT_LEAVE: 'chat:leave',
    MESSAGE_TYPING: 'message:typing',
} as const;

export const MessagesWsServerEvent = {
    NEW_MESSAGE: 'message:new',
    USER_TYPING: 'user:typing',
    /** Собеседник пометил чат прочитанным — перезапросить сообщения (readBy). */
    CHAT_READ: 'message:chat-read',
    /** Сообщение отредактировано отправителем. */
    MESSAGE_UPDATED: 'message:updated',
    /** Сообщение soft-удалено отправителем. */
    MESSAGE_DELETED: 'message:deleted',
    /** Лайк был добавлен/снят — payload содержит финальный счётчик. */
    MESSAGE_LIKED: 'message:liked',
} as const;

export function chatRoomId(chatId: string): string {
    return `chat:${chatId}`;
}
