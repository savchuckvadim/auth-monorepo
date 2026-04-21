export enum MessageEvent {
    CREATED = 'message.created',
    /** После markChatMessagesAsRead — клиенты обновляют readBy у исходящих. */
    CHAT_READ = 'message.chat.read',
}
