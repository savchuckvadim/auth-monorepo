import {
    Message,
    MessageAttachment,
    MessageAttachmentKind,
    MessageType,
} from 'generated/prisma';

export type MessageWithRelations = Message & {
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    replyTo?: Message & {
        sender?: {
            id: string;
            name: string;
            email: string;
        };
    };
    /** Заполняется в findByChatId из MessageReadStatus (для UI «прочитано»). */
    readBy?: string[];
    /** Заполняется когда `viewerId` передан в fetch — для UI кнопки лайка. */
    isLiked?: boolean;
    /** Вложения — include или отдельный запрос. */
    attachments?: MessageAttachment[];
};

/** Автор одного лайка (для списка в модалке «кто лайкнул»). */
export type MessageLikeEntry = {
    id: string;
    messageId: string;
    createdAt: Date;
    user: { id: string; name: string; email: string };
};

export abstract class MessagesRepository {
    abstract findById(
        id: string,
        viewerId?: string,
    ): Promise<MessageWithRelations>;
    abstract findByChatId(
        chatId: string,
        limit?: number,
        offset?: number,
        viewerId?: string,
    ): Promise<MessageWithRelations[]>;
    abstract create(data: {
        chatId: string;
        senderId: string;
        content: string;
        type?: MessageType;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
        replyToId?: string;
        isEncrypted?: boolean;
        toDeviceId?: string;
        senderDeviceId?: string;
        signalMessageType?: string;
        registrationId?: number;
        expiresAt?: Date;
        /** JSON-метаданные: напр. для CALL_EVENT — `CallEventMetadataDto`. */
        metadata?: Record<string, unknown>;
    }): Promise<MessageWithRelations>;
    abstract update(id: string, content: string): Promise<Message>;
    abstract delete(id: string): Promise<Message>;
    abstract markAsRead(messageId: string, userId: string): Promise<void>;
    abstract markChatMessagesAsRead(
        chatId: string,
        userId: string,
    ): Promise<void>;
    abstract getUnreadCount(chatId: string, userId: string): Promise<number>;
    abstract getTotalUnreadCount(userId: string): Promise<number>;
    abstract findLastMessageByChatId(
        chatId: string,
    ): Promise<MessageWithRelations | null>;
    abstract hasUserReadMessage(
        messageId: string,
        readerUserId: string,
    ): Promise<boolean>;

    /**
     * Toggle like транзакционно: атомарный upsert/delete + инкремент/декремент
     * `likesCount`. Возвращает финальный счётчик и флаг.
     */
    abstract toggleLike(
        messageId: string,
        userId: string,
    ): Promise<{ isLiked: boolean; likesCount: number }>;

    /** Курсорная пагинация лайков для модалки «кто лайкнул». */
    abstract findLikes(
        messageId: string,
        params: { cursor?: string; limit: number },
    ): Promise<MessageLikeEntry[]>;

    /**
     * Создать «висячий» attachment (без messageId) — клиент потом передаст
     * его ID в `CreateMessageDto.attachmentIds`, и сервис привяжет в транзакции.
     */
    abstract createDetachedAttachment(data: {
        uploaderId: string;
        kind: MessageAttachmentKind;
        url?: string;
        name?: string;
        size?: number;
        mimeType?: string;
        durationMs?: number;
        width?: number;
        height?: number;
        thumbnailUrl?: string;
        metadata?: Record<string, unknown>;
        postId?: string;
    }): Promise<MessageAttachment>;

    /**
     * Привязать заранее загруженные attachment’ы к только что созданному
     * сообщению. Проверка `uploaderId === senderId` — вызывающий сервис.
     */
    abstract attachAttachmentsToMessage(
        attachmentIds: string[],
        messageId: string,
        uploaderId: string,
    ): Promise<MessageAttachment[]>;

    /** Inline-создание attachment’а сразу с messageId (POST_SHARE/FORWARD_SNAPSHOT). */
    abstract createInlineAttachment(data: {
        messageId: string;
        uploaderId: string;
        kind: MessageAttachmentKind;
        url?: string;
        name?: string;
        size?: number;
        mimeType?: string;
        durationMs?: number;
        width?: number;
        height?: number;
        thumbnailUrl?: string;
        metadata?: Record<string, unknown>;
        postId?: string;
    }): Promise<MessageAttachment>;

    abstract findAttachmentById(id: string): Promise<MessageAttachment | null>;

    /**
     * Удалить вложения, созданные более `olderThanMs` мс назад и так и не
     * привязанные к сообщению (orphan cleanup, вызывается из cron).
     * Возвращает `(deletedUrls)` — чтобы сервис мог параллельно удалить из S3.
     */
    abstract deleteOrphanAttachments(
        olderThanMs: number,
    ): Promise<{ deletedUrls: string[]; deletedCount: number }>;
}
