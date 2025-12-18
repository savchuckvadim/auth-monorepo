import { Injectable, ForbiddenException } from '@nestjs/common';
import { ChatsRepository } from '../repositories/chats.repository';
import { CreateChatDto, ChatDto, AddMemberDto } from '../dto';
import { ChatType } from 'generated/prisma';

@Injectable()
export class ChatsService {
    constructor(private readonly repository: ChatsRepository) { }

    async createChat(userId: string, createChatDto: CreateChatDto): Promise<ChatDto> {
        // Добавляем текущего пользователя в список участников, если его там нет
        const memberIds = [...createChatDto.memberIds];
        if (!memberIds.includes(userId)) {
            memberIds.push(userId);
        }

        // Для приватного чата должно быть ровно 2 участника (включая создателя)
        if (createChatDto.type === ChatType.PRIVATE && memberIds.length !== 2) {
            throw new ForbiddenException('Private chat must have exactly 2 members');
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
        return chats.map(chat => new ChatDto(chat));
    }

    async getChatById(chatId: string, userId: string): Promise<ChatDto> {
        const chat = await this.repository.findById(chatId, userId);
        return new ChatDto(chat);
    }

    async addMember(chatId: string, userId: string, addMemberDto: AddMemberDto): Promise<void> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        await this.repository.addMember(chatId, addMemberDto.userId, addMemberDto.role);
    }

    async removeMember(chatId: string, userId: string, memberId: string): Promise<void> {
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

    async updateChat(chatId: string, userId: string, data: Partial<{ name: string; description: string; avatar: string }>): Promise<ChatDto> {
        const isMember = await this.repository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const chat = await this.repository.update(chatId, data);
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

        // Только создатель может удалить чат
        if (chat.createdBy !== userId) {
            throw new ForbiddenException('Only chat creator can delete the chat');
        }

        await this.repository.delete(chatId);
    }
}

