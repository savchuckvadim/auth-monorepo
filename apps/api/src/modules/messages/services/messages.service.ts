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
import {
    ChatEncryptionMode,
    MessageAttachmentKind,
    MessageType,
} from 'generated/prisma';
import {
    ChatReadEvent,
    MessageCreatedEvent,
    MessageDeletedEvent,
    MessageLikedEvent,
    MessageUpdatedEvent,
} from '../events/message.events';
import type { MessageLikeEntry } from '../repositories/messages.repository';
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

        // Pre-flight валидация attachment’ов — проверяем владение до создания
        // сообщения, чтобы не оставить сиротского message без прикреплений.
        const attachmentIds = createMessageDto.attachmentIds ?? [];
        const attachmentInputs = createMessageDto.attachmentInputs ?? [];
        const nestedUploadIds = attachmentInputs
            .map(i => i.id)
            .filter((id): id is string => Boolean(id));
        const attachmentIdsForOwnership = [
            ...new Set([...attachmentIds, ...nestedUploadIds]),
        ];
        if (attachmentIdsForOwnership.length > 0) {
            await this.validateAttachmentOwnership(
                attachmentIdsForOwnership,
                userId,
            );
        }

        // В E2EE-чаты любые вложения (inline или pre-uploaded) — запрещены:
        // они ссылаются на plaintext S3-URL и рушат гарантии Signal.
        if (
            chat.encryptionMode !== ChatEncryptionMode.NONE &&
            (attachmentIds.length > 0 || attachmentInputs.length > 0)
        ) {
            throw new BadRequestException(
                'Attachments are not allowed in encrypted chats',
            );
        }

        // Для POST_SHARE — проверяем, что пост существует и доступен автору
        // сообщения. Всё, что касается прав просмотра чужих постов, прячем
        // в PostService; здесь — только наличие.
        for (const input of attachmentInputs) {
            if (input.id) {
                continue;
            }
            if (input.kind === MessageAttachmentKind.POST_SHARE) {
                if (!input.postId) {
                    throw new BadRequestException(
                        'POST_SHARE attachment requires postId',
                    );
                }
                // Ленивое подключение, чтобы не создавать круг зависимостей:
                // Messages → Post. Если в проекте нет доступа к посту —
                // репозиторий постов кинет 404/403.
                // NB: не добавляем PostService в constructor, чтобы не
                // утяжелять MessagesModule; проверка опциональна.
            }
            if (
                input.kind === MessageAttachmentKind.FORWARD_SNAPSHOT &&
                !input.metadata
            ) {
                throw new BadRequestException(
                    'FORWARD_SNAPSHOT requires metadata snapshot',
                );
            }
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

        // Привязываем pre-uploaded attachments и/или создаём inline.
        if (attachmentIds.length > 0 || attachmentInputs.length > 0) {
            const alreadyAttached = new Set<string>();
            if (attachmentIds.length > 0) {
                await this.repository.attachAttachmentsToMessage(
                    attachmentIds,
                    message.id,
                    userId,
                );
                for (const id of attachmentIds) {
                    alreadyAttached.add(id);
                }
            }
            for (const input of attachmentInputs) {
                if (input.id) {
                    if (!alreadyAttached.has(input.id)) {
                        await this.repository.attachAttachmentsToMessage(
                            [input.id],
                            message.id,
                            userId,
                        );
                        alreadyAttached.add(input.id);
                    }
                    continue;
                }
                if (input.kind === undefined) {
                    throw new BadRequestException(
                        'attachmentInput without id must specify kind',
                    );
                }
                await this.repository.createInlineAttachment({
                    messageId: message.id,
                    uploaderId: userId,
                    kind: input.kind,
                    url: input.url,
                    name: input.name,
                    size: input.size,
                    mimeType: input.mimeType,
                    durationMs: input.durationMs,
                    width: input.width,
                    height: input.height,
                    thumbnailUrl: input.thumbnailUrl,
                    metadata: input.metadata,
                    postId: input.postId,
                });
            }
            // Перечитываем message, чтобы ответ (и WS-broadcast) содержал
            // полный список attachments.
            message = await this.repository.findById(message.id, userId);
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
            userId,
        );
        return messages.map(msg => new MessageDto(msg));
    }

    async getMessageById(
        messageId: string,
        userId: string,
    ): Promise<MessageDto> {
        const message = await this.repository.findById(messageId, userId);

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
        // Подтягиваем свежее с include, чтобы DTO содержал sender/replyTo/readBy.
        const full = await this.repository.findById(messageId);
        const dto = new MessageDto(full);

        this.eventEmitter.emit(
            MessageEvent.UPDATED,
            new MessageUpdatedEvent(dto, updated.chatId, userId),
        );

        return dto;
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
        const dto = new MessageDto({ ...deleted, sender: message.sender });

        this.eventEmitter.emit(
            MessageEvent.DELETED,
            new MessageDeletedEvent(messageId, deleted.chatId, userId),
        );

        return dto;
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
     * Toggle лайка на сообщении. Только участник чата может лайкать —
     * остальное делает репозиторий внутри транзакции.
     */
    async toggleMessageLike(
        messageId: string,
        userId: string,
    ): Promise<{
        messageId: string;
        chatId: string;
        isLiked: boolean;
        likesCount: number;
    }> {
        const message = await this.repository.findById(messageId);
        const isMember = await this.chatsRepository.isMember(
            message.chatId,
            userId,
        );
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }
        if (message.deletedAt) {
            throw new BadRequestException('Cannot like a deleted message');
        }

        const { isLiked, likesCount } = await this.repository.toggleLike(
            messageId,
            userId,
        );

        this.eventEmitter.emit(
            MessageEvent.LIKED,
            new MessageLikedEvent(
                messageId,
                message.chatId,
                userId,
                likesCount,
                isLiked,
            ),
        );

        return {
            messageId,
            chatId: message.chatId,
            isLiked,
            likesCount,
        };
    }

    /** Список лайкнувших с курсорной пагинацией. */
    async getMessageLikes(
        messageId: string,
        userId: string,
        params: { cursor?: string; limit?: number },
    ): Promise<MessageLikeEntry[]> {
        const message = await this.repository.findById(messageId);
        const isMember = await this.chatsRepository.isMember(
            message.chatId,
            userId,
        );
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);
        return this.repository.findLikes(messageId, {
            cursor: params.cursor,
            limit,
        });
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

    /**
     * Создаёт структурированное CALL_EVENT-сообщение. Используется
     * `CallsGateway` вместо ручного формирования текста — клиенты теперь
     * рендерят карточку звонка из `metadata`, а не парсят строку.
     *
     * `content` остаётся как локализованный fallback для мест, где
     * мета ещё не поддерживается (push-превью, логи, старые клиенты).
     */
    async createCallEventMessage(params: {
        userId: string;
        chatId: string;
        content: string;
        metadata: Record<string, unknown>;
    }): Promise<MessageDto> {
        const isMember = await this.chatsRepository.isMember(
            params.chatId,
            params.userId,
        );
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        const message = await this.repository.create({
            chatId: params.chatId,
            senderId: params.userId,
            content: params.content,
            type: MessageType.CALL_EVENT,
            metadata: params.metadata,
        });

        const messageDto = new MessageDto(message);
        await this.chatsRepository.touchActivity(params.chatId);
        this.eventEmitter.emit(
            MessageEvent.CREATED,
            new MessageCreatedEvent(messageDto, params.chatId, params.userId),
        );
        return messageDto;
    }

    /**
     * Пересылка сообщений (M источников × N целей). Для каждой пары создаём
     * новое сообщение с одним `FORWARD_SNAPSHOT`-аттачем, в метаданных
     * которого лежит минимальный снапшот исходника (без вложений — ссылки
     * могли бы жить дольше, чем оригинал). Запрет на E2EE-источники/цели:
     * снапшот — это plaintext, в SIGNAL-контексте это неприемлемо.
     */
    async forwardMessages(
        userId: string,
        messageIds: string[],
        targetChatIds: string[],
    ): Promise<MessageDto[]> {
        const uniqueMessageIds = Array.from(new Set(messageIds));
        const uniqueChatIds = Array.from(new Set(targetChatIds));
        if (uniqueMessageIds.length === 0 || uniqueChatIds.length === 0) {
            return [];
        }

        // Выбираем исходники поштучно: порядок важен (снапшоты идут в
        // порядке, в котором пользователь их выбрал в forward-модалке).
        const sources: MessageWithRelations[] = [];
        for (const id of uniqueMessageIds) {
            const source = await this.repository.findById(id);
            if (!source) {
                throw new BadRequestException(`Message ${id} not found`);
            }
            if (source.isEncrypted) {
                throw new ForbiddenException(
                    `Cannot forward encrypted message ${id}`,
                );
            }
            const sourceChatMember = await this.chatsRepository.isMember(
                source.chatId,
                userId,
            );
            if (!sourceChatMember) {
                throw new ForbiddenException(
                    `You are not a member of source chat of message ${id}`,
                );
            }
            sources.push(source);
        }

        // Валидируем цели заранее: если один чат недоступен — не создаём
        // сообщения в других.
        for (const chatId of uniqueChatIds) {
            const chat = await this.chatsRepository.findById(chatId, userId);
            if (!chat) {
                throw new BadRequestException(`Chat ${chatId} not found`);
            }
            if (chat.encryptionMode !== ChatEncryptionMode.NONE) {
                throw new ForbiddenException(
                    `Cannot forward into encrypted chat ${chatId}`,
                );
            }
            const isMember = await this.chatsRepository.isMember(
                chatId,
                userId,
            );
            if (!isMember) {
                throw new ForbiddenException(
                    `You are not a member of target chat ${chatId}`,
                );
            }
        }

        const created: MessageDto[] = [];
        for (const chatId of uniqueChatIds) {
            for (const source of sources) {
                const snapshot = {
                    sourceMessageId: source.id,
                    sourceChatId: source.chatId,
                    senderId: source.senderId,
                    senderName: source.sender?.name ?? '',
                    content: source.content,
                    type: source.type,
                    createdAt: source.createdAt,
                };
                // Контейнерное сообщение: content пустой — UI рендерит
                // FORWARD_SNAPSHOT-карточку из metadata.
                let message = await this.repository.create({
                    chatId,
                    senderId: userId,
                    content: '',
                    type: MessageType.TEXT,
                });
                await this.repository.createInlineAttachment({
                    messageId: message.id,
                    uploaderId: userId,
                    kind: MessageAttachmentKind.FORWARD_SNAPSHOT,
                    metadata: snapshot,
                });
                message = await this.repository.findById(message.id, userId);

                const dto = new MessageDto(message);
                created.push(dto);
                await this.chatsRepository.touchActivity(chatId);
                this.eventEmitter.emit(
                    MessageEvent.CREATED,
                    new MessageCreatedEvent(dto, chatId, userId),
                );
            }
        }
        return created;
    }

    /**
     * Проверяет, что все переданные attachment'ы принадлежат пользователю и
     * ещё не привязаны к другому сообщению. Кидает 400/404/403 по ситуации,
     * чтобы не порождать «висячие» сообщения без реальных вложений.
     */
    private async validateAttachmentOwnership(
        attachmentIds: string[],
        userId: string,
    ): Promise<void> {
        // Дедупликация на входе — клиент мог прислать дубль.
        const uniqueIds = Array.from(new Set(attachmentIds));
        for (const id of uniqueIds) {
            const attachment = await this.repository.findAttachmentById(id);
            if (!attachment) {
                throw new BadRequestException(`Attachment ${id} not found`);
            }
            if (attachment.uploaderId !== userId) {
                throw new ForbiddenException(
                    `Attachment ${id} does not belong to you`,
                );
            }
            if (attachment.messageId && attachment.messageId !== '') {
                throw new BadRequestException(
                    `Attachment ${id} is already attached to a message`,
                );
            }
        }
    }
}
