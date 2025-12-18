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
};

export abstract class MessagesRepository {
    abstract findById(id: string): Promise<MessageWithRelations>;
    abstract findByChatId(chatId: string, limit?: number, offset?: number): Promise<MessageWithRelations[]>;
    abstract create(data: {
        chatId: string;
        senderId: string;
        content: string;
        type?: MessageType;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
        replyToId?: string;
    }): Promise<Message & { sender?: any }>;
    abstract update(id: string, content: string): Promise<Message>;
    abstract delete(id: string): Promise<Message>;
    abstract markAsRead(messageId: string, userId: string): Promise<void>;
    abstract markChatMessagesAsRead(chatId: string, userId: string): Promise<void>;
    abstract getUnreadCount(chatId: string, userId: string): Promise<number>;
}

