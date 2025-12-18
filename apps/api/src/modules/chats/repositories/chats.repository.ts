import { Chat, ChatMember, ChatType } from 'generated/prisma';

export abstract class ChatsRepository {
    abstract findById(id: string, userId?: string): Promise<Chat & { members?: ChatMember[] }>;
    abstract findByUserId(userId: string): Promise<(Chat & { members?: ChatMember[] })[]>;
    abstract findPrivateChat(userId1: string, userId2: string): Promise<Chat | null>;
    abstract create(data: {
        type: ChatType;
        createdBy: string;
        name?: string;
        description?: string;
        memberIds: string[];
    }): Promise<Chat & { members: ChatMember[] }>;
    abstract addMember(chatId: string, userId: string, role?: string): Promise<ChatMember>;
    abstract removeMember(chatId: string, userId: string): Promise<void>;
    abstract update(chatId: string, data: Partial<Chat>): Promise<Chat>;
    abstract delete(chatId: string): Promise<void>;
    abstract isMember(chatId: string, userId: string): Promise<boolean>;
    abstract updateLastRead(chatId: string, userId: string): Promise<void>;
}

