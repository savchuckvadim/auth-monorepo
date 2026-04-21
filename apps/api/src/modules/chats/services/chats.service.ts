import {
    BadRequestException,
    Inject,
    Injectable,
    ForbiddenException,
    forwardRef,
} from '@nestjs/common';
import { ChatsRepository } from '../repositories/chats.repository';
import { CreateChatDto, ChatDto, AddMemberDto, UpdateChatDto } from '../dto';
import { ChatEncryptionMode, ChatType } from 'generated/prisma';
import { MessagesRepository } from '@/modules/messages/repositories/messages.repository';
import { MessageDto } from '@/modules/messages/dto';

@Injectable()
export class ChatsService {
    constructor(
        private readonly repository: ChatsRepository,
        @Inject(forwardRef(() => MessagesRepository))
        private readonly messagesRepository: MessagesRepository,
    ) {}

    async createChat(
        userId: string,
        createChatDto: CreateChatDto,
    ): Promise<ChatDto> {
        // Добавляем текущего пользователя в список участников, если его там нет
        const memberIds = [...createChatDto.memberIds];
        if (!memberIds.includes(userId)) {
            memberIds.push(userId);
        }

        // Для приватного чата должно быть ровно 2 участника (включая создателя)
        if (createChatDto.type === ChatType.PRIVATE && memberIds.length !== 2) {
            throw new ForbiddenException(
                'Private chat must have exactly 2 members',
            );
        }

        const chat = await this.repository.create({
            ...createChatDto,
            memberIds,
            createdBy: userId,
        });

        return new ChatDto(chat);
    }

    async getUserChats(userId: string): Promise<ChatDto[]> {
        const chats = await this.repository.findByUserId(userId);
        const enriched: ChatDto[] = [];
        for (const chat of chats) {
            const [unreadCount, lastMsg] = await Promise.all([
                this.messagesRepository.getUnreadCount(chat.id, userId),
                this.messagesRepository.findLastMessageByChatId(chat.id),
            ]);
            const lastMessage = lastMsg ? new MessageDto(lastMsg) : undefined;
            let lastMessageOutgoingRead: boolean | undefined;
            if (
                lastMsg &&
                lastMsg.senderId === userId &&
                chat.type === ChatType.PRIVATE &&
                chat.members?.length
            ) {
                const peer = chat.members.find(m => m.userId !== userId);
                if (peer) {
                    lastMessageOutgoingRead =
                        await this.messagesRepository.hasUserReadMessage(
                            lastMsg.id,
                            peer.userId,
                        );
                }
            }
            enriched.push(
                new ChatDto({
                    ...chat,
                    unreadCount,
                    lastMessage,
                    lastMessageOutgoingRead,
                }),
            );
        }
        enriched.sort((a, b) => {
            const ta = new Date(
                a.lastMessage?.createdAt ?? a.updatedAt,
            ).getTime();
            const tb = new Date(
                b.lastMessage?.createdAt ?? b.updatedAt,
            ).getTime();
            return tb - ta;
        });
        return enriched;
    }

    async getChatById(chatId: string, userId: string): Promise<ChatDto> {
        const chat = await this.repository.findById(chatId, userId);
        return new ChatDto(chat);
    }

    async addMember(
        chatId: string,
        userId: string,
        addMemberDto: AddMemberDto,
    ): Promise<void> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        await this.repository.addMember(
            chatId,
            addMemberDto.userId,
            addMemberDto.role,
        );
    }

    async removeMember(
        chatId: string,
        userId: string,
        memberId: string,
    ): Promise<void> {
        // Проверяем права доступа
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        // Пользователь может удалить только себя, если он не владелец
        if (userId !== memberId) {
            // TODO: Проверить, является ли пользователь владельцем/админом
        }

        await this.repository.removeMember(chatId, memberId);
    }

    async updateChat(
        chatId: string,
        userId: string,
        data: UpdateChatDto,
    ): Promise<ChatDto> {
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const existing = await this.repository.findById(chatId, userId);

        const hasTimerPolicy =
            data.scheduledDeletionAt !== undefined ||
            data.disappearingMessageSeconds !== undefined;
        if (hasTimerPolicy) {
            if (
                existing.type !== ChatType.PRIVATE ||
                existing.encryptionMode !== ChatEncryptionMode.SIGNAL
            ) {
                throw new BadRequestException(
                    'Timer policies apply only to private SIGNAL (secret) chats',
                );
            }
        }

        const patch: Parameters<ChatsRepository['update']>[1] = {};
        if (data.name !== undefined) patch.name = data.name;
        if (data.description !== undefined)
            patch.description = data.description;
        if (data.avatar !== undefined) patch.avatar = data.avatar;

        if (data.scheduledDeletionAt !== undefined) {
            if (data.scheduledDeletionAt === null) {
                patch.scheduledDeletionAt = null;
            } else {
                const d = new Date(data.scheduledDeletionAt);
                if (Number.isNaN(d.getTime())) {
                    throw new BadRequestException(
                        'Invalid scheduledDeletionAt',
                    );
                }
                if (d.getTime() <= Date.now()) {
                    throw new BadRequestException(
                        'scheduledDeletionAt must be in the future',
                    );
                }
                patch.scheduledDeletionAt = d;
            }
        }

        if (data.disappearingMessageSeconds !== undefined) {
            if (
                data.disappearingMessageSeconds === null ||
                data.disappearingMessageSeconds === 0
            ) {
                patch.disappearingMessageSeconds = null;
            } else {
                if (data.disappearingMessageSeconds < 30) {
                    throw new BadRequestException(
                        'disappearingMessageSeconds must be at least 30',
                    );
                }
                patch.disappearingMessageSeconds =
                    data.disappearingMessageSeconds;
            }
        }

        const chat = await this.repository.update(chatId, patch);
        return new ChatDto(chat);
    }

    async markAsRead(chatId: string, userId: string): Promise<void> {
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        await this.repository.updateLastRead(chatId, userId);
    }

    async deleteChat(chatId: string, userId: string): Promise<void> {
        const chat = await this.repository.findById(chatId, userId);

        if (chat.type === ChatType.PRIVATE) {
            const isMember = await this.repository.isMember(chatId, userId);
            if (!isMember) {
                throw new ForbiddenException(
                    'You are not a member of this chat',
                );
            }
        } else if (chat.createdBy !== userId) {
            throw new ForbiddenException(
                'Only chat creator can delete the group chat',
            );
        }

        await this.repository.delete(chatId);
    }
}
