import { Message, MessageType } from 'generated/prisma';

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
};

export abstract class MessagesRepository {
    abstract findById(id: string): Promise<MessageWithRelations>;
    abstract findByChatId(
        chatId: string,
        limit?: number,
        offset?: number,
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
}
