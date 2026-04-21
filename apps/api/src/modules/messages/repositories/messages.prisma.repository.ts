import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core';
import {
    MessagesRepository,
    type MessageWithRelations,
} from './messages.repository';
import { Message, MessageType } from 'generated/prisma';

@Injectable()
export class MessagesPrismaRepository implements MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                fromDevice: {
                    select: { clientDeviceId: true },
                },
                replyTo: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                readStatus: {
                    select: { userId: true },
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        return {
            ...message,
            replyTo: message.replyTo || undefined,
            readBy: message.readStatus.map(r => r.userId),
        };
    }

    async findByChatId(chatId: string, limit: number = 50, offset: number = 0) {
        const messages = await this.prisma.message.findMany({
            where: {
                chatId,
                deletedAt: null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                fromDevice: {
                    select: { clientDeviceId: true },
                },
                replyTo: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                readStatus: {
                    select: { userId: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        // Преобразуем null в undefined для replyTo в каждом сообщении; readBy — для UI «прочитано»
        return messages.reverse().map(msg => ({
            ...msg,
            replyTo: msg.replyTo || undefined,
            readBy: msg.readStatus.map(r => r.userId),
        }));
    }

    async create(data: {
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
    }): Promise<MessageWithRelations> {
        return this.prisma.message.create({
            data: {
                chatId: data.chatId,
                senderId: data.senderId,
                content: data.content,
                type: data.type || MessageType.TEXT,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                replyToId: data.replyToId,
                isEncrypted: data.isEncrypted ?? false,
                toDeviceId: data.toDeviceId,
                senderDeviceId: data.senderDeviceId,
                signalMessageType: data.signalMessageType,
                registrationId: data.registrationId,
                expiresAt: data.expiresAt,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                fromDevice: {
                    select: { clientDeviceId: true },
                },
            },
        });
    }

    async update(id: string, content: string): Promise<Message> {
        return this.prisma.message.update({
            where: { id },
            data: {
                content,
                editedAt: new Date(),
            },
        });
    }

    async delete(id: string): Promise<Message> {
        return this.prisma.message.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async markAsRead(messageId: string, userId: string): Promise<void> {
        await this.prisma.messageReadStatus.upsert({
            where: {
                messageId_userId: {
                    messageId,
                    userId,
                },
            },
            create: {
                messageId,
                userId,
            },
            update: {},
        });
    }

    async markChatMessagesAsRead(
        chatId: string,
        userId: string,
    ): Promise<void> {
        // Получаем все непрочитанные сообщения в чате
        const unreadMessages = await this.prisma.message.findMany({
            where: {
                chatId,
                senderId: {
                    not: userId, // Не помечаем свои сообщения как прочитанные
                },
                deletedAt: null,
                readStatus: {
                    none: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        // Создаём записи о прочтении для всех непрочитанных сообщений
        if (unreadMessages.length > 0) {
            await this.prisma.messageReadStatus.createMany({
                data: unreadMessages.map(msg => ({
                    messageId: msg.id,
                    userId,
                })),
                skipDuplicates: true,
            });
        }

        // Обновляем lastReadAt в ChatMember
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

    async getUnreadCount(chatId: string, userId: string): Promise<number> {
        return this.prisma.message.count({
            where: {
                chatId,
                senderId: {
                    not: userId,
                },
                deletedAt: null,
                readStatus: {
                    none: {
                        userId,
                    },
                },
            },
        });
    }

    async getTotalUnreadCount(userId: string): Promise<number> {
        return this.prisma.message.count({
            where: {
                deletedAt: null,
                senderId: { not: userId },
                chat: {
                    members: {
                        some: {
                            userId,
                            leftAt: null,
                        },
                    },
                },
                readStatus: {
                    none: { userId },
                },
            },
        });
    }

    async findLastMessageByChatId(
        chatId: string,
    ): Promise<MessageWithRelations | null> {
        const message = await this.prisma.message.findFirst({
            where: {
                chatId,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                fromDevice: {
                    select: { clientDeviceId: true },
                },
            },
        });
        return message;
    }

    async hasUserReadMessage(
        messageId: string,
        readerUserId: string,
    ): Promise<boolean> {
        const row = await this.prisma.messageReadStatus.findUnique({
            where: {
                messageId_userId: {
                    messageId,
                    userId: readerUserId,
                },
            },
        });
        return row !== null;
    }
}
