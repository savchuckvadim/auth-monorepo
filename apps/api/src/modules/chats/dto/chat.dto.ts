import { Chat, ChatMember, ChatType } from 'generated/prisma';

export class UpdateChatDto {
    name?: string;
    description?: string;
    avatar?: string;
}

export class ChatDto {
    id: string;
    type: ChatType;
    name?: string;
    description?: string;
    avatar?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    members?: ChatMemberDto[];
    unreadCount?: number;
    lastMessage?: {
        id: string;
        content: string;
        createdAt: Date;
        senderId: string;
    };

    constructor(chat: Chat & { members?: ChatMember[]; unreadCount?: number; lastMessage?: any }) {
        this.id = chat.id;
        this.type = chat.type;
        this.name = chat.name || undefined;
        this.description = chat.description || undefined;
        this.avatar = chat.avatar || undefined;
        this.createdBy = chat.createdBy;
        this.createdAt = chat.createdAt;
        this.updatedAt = chat.updatedAt;
        this.members = chat.members?.map(m => new ChatMemberDto(m));
        this.unreadCount = chat.unreadCount;
        this.lastMessage = chat.lastMessage;
    }
}

export class ChatMemberDto {
    id: string;
    chatId: string;
    userId: string;
    role: string;
    joinedAt: Date;
    leftAt?: Date;
    lastReadAt?: Date;

    constructor(member: ChatMember) {
        this.id = member.id;
        this.chatId = member.chatId;
        this.userId = member.userId;
        this.role = member.role;
        this.joinedAt = member.joinedAt;
        this.leftAt = member.leftAt || undefined;
        this.lastReadAt = member.lastReadAt || undefined;
    }
}

