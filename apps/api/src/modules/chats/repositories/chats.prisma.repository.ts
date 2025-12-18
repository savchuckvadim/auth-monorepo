import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core';
import { ChatsRepository } from './chats.repository';
import { Chat, ChatMember, ChatType, ChatMemberRole } from 'generated/prisma';

@Injectable()
export class ChatsPrismaRepository implements ChatsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string, userId?: string): Promise<Chat & { members?: ChatMember[] }> {
        const chat = await this.prisma.chat.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        if (userId) {
            const isMember = await this.isMember(id, userId);
            if (!isMember) {
                throw new ForbiddenException('You are not a member of this chat');
            }
        }

        return chat;
    }

    async findByUserId(userId: string): Promise<(Chat & { members?: ChatMember[] })[]> {
        return this.prisma.chat.findMany({
            where: {
                members: {
                    some: {
                        userId,
                        leftAt: null,
                    },
                },
            },
            include: {
                members: {
                    where: {
                        leftAt: null,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }

    async findPrivateChat(userId1: string, userId2: string): Promise<Chat | null> {
        const chat = await this.prisma.chat.findFirst({
            where: {
                type: ChatType.PRIVATE,
                members: {
                    every: {
                        userId: {
                            in: [userId1, userId2],
                        },
                        leftAt: null,
                    },
                },
            },
        });

        return chat;
    }

    async create(data: {
        type: ChatType;
        createdBy: string;
        name?: string;
        description?: string;
        memberIds: string[];
    }): Promise<Chat & { members: ChatMember[] }> {
        // Для приватного чата проверяем, не существует ли уже такой чат
        if (data.type === ChatType.PRIVATE && data.memberIds.length === 2) {
            const existingChat = await this.findPrivateChat(data.memberIds[0], data.memberIds[1]);
            if (existingChat) {
                return this.findById(existingChat.id) as Promise<Chat & { members: ChatMember[] }>;
            }
        }

        // Убеждаемся, что создатель входит в список участников
        if (!data.memberIds.includes(data.createdBy)) {
            data.memberIds.push(data.createdBy);
        }

        return this.prisma.chat.create({
            data: {
                type: data.type,
                createdBy: data.createdBy,
                name: data.name,
                description: data.description,
                members: {
                    create: data.memberIds.map((userId, index) => ({
                        userId,
                        role: userId === data.createdBy ? ChatMemberRole.OWNER : ChatMemberRole.MEMBER,
                    })),
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async addMember(chatId: string, userId: string, role: ChatMemberRole = ChatMemberRole.MEMBER): Promise<ChatMember> {
        const existingMember = await this.prisma.chatMember.findUnique({
            where: {
                chatId_userId: {
                    chatId,
                    userId,
                },
            },
        });

        if (existingMember && !existingMember.leftAt) {
            throw new Error('User is already a member of this chat');
        }

        if (existingMember && existingMember.leftAt) {
            // Пользователь возвращается в чат
            return this.prisma.chatMember.update({
                where: { id: existingMember.id },
                data: {
                    leftAt: null,
                    role,
                },
            });
        }

        return this.prisma.chatMember.create({
            data: {
                chatId,
                userId,
                role,
            },
        });
    }

    async removeMember(chatId: string, userId: string): Promise<void> {
        await this.prisma.chatMember.updateMany({
            where: {
                chatId,
                userId,
                leftAt: null,
            },
            data: {
                leftAt: new Date(),
            },
        });
    }

    async update(chatId: string, data: Partial<Chat>): Promise<Chat> {
        return this.prisma.chat.update({
            where: { id: chatId },
            data,
        });
    }

    async delete(chatId: string): Promise<void> {
        await this.prisma.chat.delete({
            where: { id: chatId },
        });
    }

    async isMember(chatId: string, userId: string): Promise<boolean> {
        const member = await this.prisma.chatMember.findUnique({
            where: {
                chatId_userId: {
                    chatId,
                    userId,
                },
            },
        });

        return member !== null && member.leftAt === null;
    }

    async updateLastRead(chatId: string, userId: string): Promise<void> {
        await this.prisma.chatMember.updateMany({
            where: {
                chatId,
                userId,
                leftAt: null,
            },
            data: {
                lastReadAt: new Date(),
            },
        });
    }
}

