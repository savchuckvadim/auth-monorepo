import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core';
import {
    MessagesRepository,
    type MessageLikeEntry,
    type MessageWithRelations,
} from './messages.repository';
import {
    Message,
    MessageAttachment,
    MessageAttachmentKind,
    MessageType,
    Prisma,
} from 'generated/prisma';

@Injectable()
export class MessagesPrismaRepository implements MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string, viewerId?: string) {
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
                attachments: true,
                ...(viewerId
                    ? {
                          likes: {
                              where: { userId: viewerId },
                              select: { id: true },
                              take: 1,
                          },
                      }
                    : {}),
            },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        const viewerLikes = (message as unknown as { likes?: { id: string }[] })
            .likes;
        return {
            ...message,
            replyTo: message.replyTo || undefined,
            readBy: message.readStatus.map(r => r.userId),
            attachments: message.attachments,
            isLiked: viewerId
                ? Boolean(viewerLikes && viewerLikes.length > 0)
                : undefined,
        };
    }

    async findByChatId(
        chatId: string,
        limit: number = 50,
        offset: number = 0,
        viewerId?: string,
    ) {
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
                attachments: true,
                ...(viewerId
                    ? {
                          likes: {
                              where: { userId: viewerId },
                              select: { id: true },
                              take: 1,
                          },
                      }
                    : {}),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        return messages.reverse().map(msg => {
            const viewerLikes = (msg as unknown as { likes?: { id: string }[] })
                .likes;
            return {
                ...msg,
                replyTo: msg.replyTo || undefined,
                readBy: msg.readStatus.map(r => r.userId),
                attachments: msg.attachments,
                isLiked: viewerId
                    ? Boolean(viewerLikes && viewerLikes.length > 0)
                    : undefined,
            };
        });
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
        metadata?: Record<string, unknown>;
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
                metadata: data.metadata as never,
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
                attachments: true,
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
                attachments: true,
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

    async toggleLike(
        messageId: string,
        userId: string,
    ): Promise<{ isLiked: boolean; likesCount: number }> {
        return this.prisma.$transaction(async tx => {
            const existing = await tx.messageLike.findUnique({
                where: { messageId_userId: { messageId, userId } },
                select: { id: true },
            });

            if (existing) {
                await tx.messageLike.delete({
                    where: { id: existing.id },
                });
                const updated = await tx.message.update({
                    where: { id: messageId },
                    data: { likesCount: { decrement: 1 } },
                    select: { likesCount: true },
                });
                const safeCount = Math.max(0, updated.likesCount);
                if (safeCount !== updated.likesCount) {
                    await tx.message.update({
                        where: { id: messageId },
                        data: { likesCount: safeCount },
                    });
                }
                return { isLiked: false, likesCount: safeCount };
            }

            try {
                await tx.messageLike.create({
                    data: { messageId, userId },
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002'
                ) {
                    const current = await tx.message.findUnique({
                        where: { id: messageId },
                        select: { likesCount: true },
                    });
                    return {
                        isLiked: true,
                        likesCount: current?.likesCount ?? 0,
                    };
                }
                throw error;
            }
            const updated = await tx.message.update({
                where: { id: messageId },
                data: { likesCount: { increment: 1 } },
                select: { likesCount: true },
            });
            return { isLiked: true, likesCount: updated.likesCount };
        });
    }

    async createDetachedAttachment(data: {
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
    }): Promise<MessageAttachment> {
        return this.prisma.messageAttachment.create({
            data: {
                uploaderId: data.uploaderId,
                kind: data.kind,
                url: data.url,
                name: data.name,
                size: data.size,
                mimeType: data.mimeType,
                durationMs: data.durationMs,
                width: data.width,
                height: data.height,
                thumbnailUrl: data.thumbnailUrl,
                metadata: data.metadata as never,
                postId: data.postId,
            },
        });
    }

    async createInlineAttachment(data: {
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
    }): Promise<MessageAttachment> {
        return this.prisma.messageAttachment.create({
            data: {
                messageId: data.messageId,
                uploaderId: data.uploaderId,
                kind: data.kind,
                url: data.url,
                name: data.name,
                size: data.size,
                mimeType: data.mimeType,
                durationMs: data.durationMs,
                width: data.width,
                height: data.height,
                thumbnailUrl: data.thumbnailUrl,
                metadata: data.metadata as never,
                postId: data.postId,
            },
        });
    }

    async attachAttachmentsToMessage(
        attachmentIds: string[],
        messageId: string,
        uploaderId: string,
    ): Promise<MessageAttachment[]> {
        if (attachmentIds.length === 0) return [];
        return this.prisma.$transaction(async tx => {
            const toAttach = await tx.messageAttachment.findMany({
                where: {
                    id: { in: attachmentIds },
                    uploaderId,
                    messageId: null,
                },
            });
            if (toAttach.length !== attachmentIds.length) {
                throw new NotFoundException(
                    'Some attachments are missing, already attached, or do not belong to you',
                );
            }
            await tx.messageAttachment.updateMany({
                where: { id: { in: attachmentIds } },
                data: { messageId },
            });
            return tx.messageAttachment.findMany({
                where: { id: { in: attachmentIds } },
            });
        });
    }

    async findAttachmentById(id: string): Promise<MessageAttachment | null> {
        return this.prisma.messageAttachment.findUnique({ where: { id } });
    }

    async deleteOrphanAttachments(
        olderThanMs: number,
    ): Promise<{ deletedUrls: string[]; deletedCount: number }> {
        const cutoff = new Date(Date.now() - olderThanMs);
        const orphans = await this.prisma.messageAttachment.findMany({
            where: { messageId: null, createdAt: { lt: cutoff } },
            select: { id: true, url: true },
        });
        if (orphans.length === 0) {
            return { deletedUrls: [], deletedCount: 0 };
        }
        const ids = orphans.map(o => o.id);
        const urls = orphans
            .map(o => o.url)
            .filter((u): u is string => typeof u === 'string' && u.length > 0);
        const { count } = await this.prisma.messageAttachment.deleteMany({
            where: { id: { in: ids } },
        });
        return { deletedUrls: urls, deletedCount: count };
    }

    async findLikes(
        messageId: string,
        params: { cursor?: string; limit: number },
    ): Promise<MessageLikeEntry[]> {
        const rows = await this.prisma.messageLike.findMany({
            where: { messageId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: params.limit,
            ...(params.cursor
                ? { skip: 1, cursor: { id: params.cursor } }
                : {}),
        });
        return rows.map(r => ({
            id: r.id,
            messageId: r.messageId,
            createdAt: r.createdAt,
            user: r.user,
        }));
    }
}
