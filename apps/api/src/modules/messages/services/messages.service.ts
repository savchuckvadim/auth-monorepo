import {
    BadRequestException,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    MessagesRepository,
    type MessageWithRelations,
} from '../repositories/messages.repository';
import { ChatsRepository } from '../../chats/repositories/chats.repository';
import { CreateMessageDto, MessageDto } from '../dto';
import { EncryptionService } from '../../encryption/encryption.service';
import { ChatEncryptionMode, MessageType } from 'generated/prisma';
import { ChatReadEvent, MessageCreatedEvent } from '../events/message.events';
import { MessageEvent } from '../type/message-event.type';

@Injectable()
export class MessagesService {
    constructor(
        private readonly repository: MessagesRepository,
        private readonly chatsRepository: ChatsRepository,
        private readonly encryptionService: EncryptionService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async createMessage(
        userId: string,
        createMessageDto: CreateMessageDto,
    ): Promise<MessageDto> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(
            createMessageDto.chatId,
            userId,
        );
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const chat = await this.chatsRepository.findById(
            createMessageDto.chatId,
            userId,
        );

        let message: MessageWithRelations;

        let expiresAt: Date | undefined;
        if (
            chat.disappearingMessageSeconds &&
            chat.disappearingMessageSeconds > 0
        ) {
            expiresAt = new Date(
                Date.now() + chat.disappearingMessageSeconds * 1000,
            );
        }

        if (chat.encryptionMode === ChatEncryptionMode.NONE) {
            if (
                createMessageDto.isEncrypted ||
                createMessageDto.toDeviceId ||
                createMessageDto.senderDeviceId ||
                createMessageDto.signalMessageType
            ) {
                throw new BadRequestException(
                    'E2EE fields are not allowed when chat encryptionMode is NONE',
                );
            }
            message = await this.repository.create({
                ...createMessageDto,
                senderId: userId,
                expiresAt,
            });
        } else {
            this.encryptionService.assertServerAllowsE2eeMessaging();
            if (
                !createMessageDto.isEncrypted ||
                !createMessageDto.toDeviceId ||
                !createMessageDto.senderDeviceId ||
                !createMessageDto.signalMessageType?.trim()
            ) {
                throw new BadRequestException(
                    'SIGNAL chats require isEncrypted, toDeviceId, senderDeviceId, and signalMessageType',
                );
            }
            await this.encryptionService.assertDeviceIsAllowedMessageTarget(
                createMessageDto.chatId,
                createMessageDto.toDeviceId,
            );
            await this.encryptionService.assertSenderDeviceBelongsToUser(
                userId,
                createMessageDto.senderDeviceId,
            );
            message = await this.repository.create({
                ...createMessageDto,
                senderId: userId,
                isEncrypted: true,
                expiresAt,
            });
        }

        const messageDto = new MessageDto(message);

        await this.chatsRepository.touchActivity(createMessageDto.chatId);

        this.eventEmitter.emit(
            MessageEvent.CREATED,
            new MessageCreatedEvent(
                messageDto,
                createMessageDto.chatId,
                userId,
            ),
        );

        return messageDto;
    }

    async getChatMessages(
        chatId: string,
        userId: string,
        limit?: number,
        offset?: number,
    ): Promise<MessageDto[]> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const messages = await this.repository.findByChatId(
            chatId,
            limit,
            offset,
        );
        return messages.map(msg => new MessageDto(msg));
    }

    async getMessageById(
        messageId: string,
        userId: string,
    ): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(
            message.chatId,
            userId,
        );
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        return new MessageDto(message);
    }

    async updateMessage(
        messageId: string,
        userId: string,
        content: string,
    ): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Только отправитель может редактировать сообщение
        if (message.senderId !== userId) {
            throw new ForbiddenException('You can only edit your own messages');
        }
        if (message.isEncrypted) {
            throw new BadRequestException(
                'Encrypted messages cannot be edited',
            );
        }

        const updated = await this.repository.update(messageId, content);
        return new MessageDto(updated);
    }

    async deleteMessage(
        messageId: string,
        userId: string,
    ): Promise<MessageDto> {
        const message = await this.repository.findById(messageId);

        // Только отправитель может удалить сообщение
        if (message.senderId !== userId) {
            throw new ForbiddenException(
                'You can only delete your own messages',
            );
        }

        const deleted = await this.repository.delete(messageId);
        return new MessageDto(deleted);
    }

    async markAsRead(messageId: string, userId: string): Promise<void> {
        const message = await this.repository.findById(messageId);

        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(
            message.chatId,
            userId,
        );
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

        this.eventEmitter.emit(
            MessageEvent.CHAT_READ,
            new ChatReadEvent(chatId, userId),
        );
    }

    async getUnreadCount(chatId: string, userId: string): Promise<number> {
        // Проверяем, что пользователь является участником чата
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        return this.repository.getUnreadCount(chatId, userId);
    }

    async getTotalUnreadCount(userId: string): Promise<number> {
        return this.repository.getTotalUnreadCount(userId);
    }

    /**
     * Inserts a non-encrypted `SYSTEM` row and broadcasts like a normal message.
     * Used for chat policy notices (disappearing messages, scheduled chat deletion).
     */
    async createSystemMessage(
        userId: string,
        chatId: string,
        content: string,
    ): Promise<MessageDto> {
        const isMember = await this.chatsRepository.isMember(chatId, userId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const message = await this.repository.create({
            chatId,
            senderId: userId,
            content,
            type: MessageType.SYSTEM,
        });

        const messageDto = new MessageDto(message);
        await this.chatsRepository.touchActivity(chatId);
        this.eventEmitter.emit(
            MessageEvent.CREATED,
            new MessageCreatedEvent(messageDto, chatId, userId),
        );
        return messageDto;
    }
}
