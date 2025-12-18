import { Message, MessageType } from 'generated/prisma';

export class MessageDto {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyToId?: string;
    editedAt?: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    replyTo?: MessageDto;
    readBy?: string[];

    constructor(message: Message & { sender?: any; replyTo?: Message; readBy?: string[] }) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.senderId = message.senderId;
        this.content = message.content;
        this.type = message.type;
        this.fileUrl = message.fileUrl || undefined;
        this.fileName = message.fileName || undefined;
        this.fileSize = message.fileSize || undefined;
        this.replyToId = message.replyToId || undefined;
        this.editedAt = message.editedAt || undefined;
        this.deletedAt = message.deletedAt || undefined;
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;
        this.sender = message.sender;
        this.replyTo = message.replyTo ? new MessageDto(message.replyTo) : undefined;
        this.readBy = message.readBy || [];
    }
}

