/** Must match apps/api messages-socket.constants.ts (default namespace). */
export const MessagesWsClientEvent = {
    SEND: 'message:send',
    CHAT_JOIN: 'chat:join',
    CHAT_LEAVE: 'chat:leave',
    MESSAGE_TYPING: 'message:typing',
} as const;

export const MessagesWsServerEvent = {
    NEW_MESSAGE: 'message:new',
    USER_TYPING: 'user:typing',
    CHAT_READ: 'message:chat-read',
    MESSAGE_UPDATED: 'message:updated',
    MESSAGE_DELETED: 'message:deleted',
    MESSAGE_LIKED: 'message:liked',
} as const;
