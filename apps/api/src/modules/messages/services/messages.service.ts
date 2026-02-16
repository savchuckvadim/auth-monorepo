import { Injectable, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { MessagesRepository } from '../repositories/messages.repository';
import { ChatsRepository } from '../../chats/repositories/chats.repository';
import { CreateMessageDto, MessageDto } from '../dto';
import { MessagesGateway } from '../socket/messages.gateway';

@Injectable()
export class MessagesService {
    constructor(
        private readonly repository: MessagesRepository,
        private readonly chatsRepository: ChatsRepository,
        @Inject(forwardRef(() => MessagesGateway))
        private readonly messagesGateway: MessagesGateway,
    ) { }

    async createMessage(userId: string, createMessageDto: CreateMessageDto): Promise<MessageDto> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(createMessageDto.chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const message = await this.repository.create({
            ...createMessageDto,
            senderId: userId,
        });

        const messageDto = new MessageDto(message);

        // Отправляем сообщение через WebSocket всем участникам чата
        await this.messagesGateway.broadcastMessage(messageDto, createMessageDto.chatId, userId);

        return messageDto;
    }

    async getChatMessages(chatId: string, userId: string, limit?: number, offset?: number): Promise<MessageDto[]> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const messages = await this.repository.findByChatId(chatId, limit, offset);
        return messages.map(msg => new MessageDto(msg));
    }

    async getMessageById(messageId: string, userId: string): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(message.chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        return new MessageDto(message);
    }

    async updateMessage(messageId: string, userId: string, content: string): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Только отправитель может редактировать сообщение
        if (message.senderId !== userId) {
            throw new ForbiddenException('You can only edit your own messages');
        }

        const updated = await this.repository.update(messageId, content);
        return new MessageDto(updated);
    }

    async deleteMessage(messageId: string, userId: string): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Только отправитель может удалить сообщение
        if (message.senderId !== userId) {
            throw new ForbiddenException('You can only delete your own messages');
        }

        const deleted = await this.repository.delete(messageId);
        return new MessageDto(deleted);
    }

    async markAsRead(messageId: string, userId: string): Promise<void> {
        const message = await this.repository.findById(messageId);

        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(message.chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        await this.repository.markAsRead(messageId, userId);
    }

    async markChatAsRead(chatId: string, userId: string): Promise<void> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        await this.repository.markChatMessagesAsRead(chatId, userId);
    }

    async getUnreadCount(chatId: string, userId: string): Promise<number> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        return this.repository.getUnreadCount(chatId, userId);
    }
}

