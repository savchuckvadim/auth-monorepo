export enum MessageEvent {
    CREATED = 'message.created',
    /** После markChatMessagesAsRead — клиенты обновляют readBy у исходящих. */
    CHAT_READ = 'message.chat.read',
    /** После успешного редактирования текста сообщения. */
    UPDATED = 'message.updated',
    /** После soft-delete сообщения (deletedAt проставлен). */
    DELETED = 'message.deleted',
    /** После toggle лайка (add или remove). */
    LIKED = 'message.liked',
}
