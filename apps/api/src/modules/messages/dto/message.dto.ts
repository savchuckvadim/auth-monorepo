import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '@/modules/user';
import { Message, MessageAttachment, MessageType } from 'generated/prisma';
import { MessageAttachmentDto } from './message-attachment.dto';

/**
 * Полезная нагрузка для `MessageType.CALL_EVENT`.
 *
 * Клиент рендерит карточку звонка, читая эти поля вместо regex-парсинга
 * свободного текста старых SYSTEM-сообщений.
 */
export class CallEventMetadataDto {
    @ApiProperty({
        description:
            'Направление: кто инициировал звонок относительно получателя DTO',
        enum: ['incoming', 'outgoing'],
        example: 'incoming',
    })
    direction: 'incoming' | 'outgoing';

    @ApiProperty({
        description: 'Причина завершения звонка',
        enum: [
            'missed',
            'accepted',
            'rejected',
            'canceled',
            'timeout',
            'failed',
        ],
        example: 'missed',
    })
    reason:
        | 'missed'
        | 'accepted'
        | 'rejected'
        | 'canceled'
        | 'timeout'
        | 'failed';

    @ApiProperty({
        description: 'Тип звонка',
        enum: ['audio', 'video'],
        example: 'audio',
    })
    callType: 'audio' | 'video';

    @ApiPropertyOptional({
        description: 'Длительность звонка в миллисекундах (если accepted)',
        example: 75000,
        type: Number,
    })
    durationMs?: number;

    @ApiPropertyOptional({
        description: 'ID инициатора звонка (чей `initiatorId` в Call)',
        example: 'd63...',
        type: String,
    })
    initiatorId?: string;

    @ApiPropertyOptional({
        description: 'Ссылка на Call.id в истории звонков',
        example: 'd63...',
        type: String,
    })
    callId?: string;
}

/** ORM row + includes used when building MessageDto (recursive replyTo). */
export type MessageDtoSource = Message & {
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    fromDevice?: { clientDeviceId: string } | null;
    replyTo?: MessageDtoSource;
    readBy?: string[];
    /** Заполняется сервисом из `MessageLike` по `viewerId` (is current user liker). */
    isLiked?: boolean;
    /** Заполняется сервисом когда нужен полноценный рендер (chatList/feed). */
    attachments?: MessageAttachment[];
};

export class MessageDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    id: string;
    @ApiProperty({ description: 'Chat ID', example: '1', type: String })
    chatId: string;
    @ApiProperty({ description: 'Sender ID', example: '1', type: String })
    senderId: string;
    @ApiProperty({
        description: 'Content',
        example: 'Hello, how are you?',
        type: String,
    })
    content: string;
    @ApiProperty({
        description: 'Message kind',
        enum: MessageType,
        example: MessageType.TEXT,
        type: String,
    })
    type: MessageType;
    @ApiPropertyOptional({
        description: 'File URL',
        example: 'https://example.com/file.jpg',
        type: String,
    })
    fileUrl?: string;
    @ApiPropertyOptional({
        description: 'File Name',
        example: 'file.jpg',
        type: String,
    })
    fileName?: string;
    @ApiPropertyOptional({
        description: 'File Size',
        example: 1000,
        type: Number,
    })
    fileSize?: number;
    @ApiPropertyOptional({
        description: 'Reply To ID',
        example: '1',
        type: String,
    })
    replyToId?: string;
    @ApiPropertyOptional({
        description: 'Edited At',
        example: '2021-01-01',
        type: Date,
    })
    editedAt?: Date;
    @ApiPropertyOptional({
        description:
            'Derived flag: true if the message was edited at least once. Computed from `editedAt`.',
        example: true,
        type: Boolean,
    })
    isEdited?: boolean;
    @ApiPropertyOptional({
        description: 'Deleted At',
        example: '2021-01-01',
        type: Date,
    })
    deletedAt?: Date;
    @ApiPropertyOptional({
        description:
            'Произвольные метаданные сообщения. Для `type=CALL_EVENT` содержит `CallEventMetadataDto`.',
        type: () => CallEventMetadataDto,
    })
    metadata?: CallEventMetadataDto | Record<string, unknown>;
    @ApiProperty({
        description:
            'Денормализованный счётчик лайков (быстрые выборки списка сообщений).',
        example: 0,
        type: Number,
    })
    likesCount: number;
    @ApiPropertyOptional({
        description:
            'Лайкнул ли это сообщение текущий зритель (viewer). `undefined` если не загружено.',
        example: false,
        type: Boolean,
    })
    isLiked?: boolean;
    @ApiProperty({
        description:
            'Вложения сообщения (IMAGE/VIDEO/AUDIO/VOICE/CIRCLE/FILE/POST_SHARE/FORWARD_SNAPSHOT). Пусто, если вложений нет.',
        type: () => [MessageAttachmentDto],
        default: [],
    })
    attachments: MessageAttachmentDto[];
    @ApiProperty({
        description: 'Created At',
        example: '2021-01-01',
        type: Date,
    })
    createdAt: Date;
    @ApiProperty({
        description: 'Updated At',
        example: '2021-01-01',
        type: Date,
    })
    updatedAt: Date;
    @ApiPropertyOptional({
        description: 'Sender',
        example: { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
        type: () => UserDto,
    })
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    @ApiPropertyOptional({ type: () => MessageDto })
    replyTo?: MessageDto;
    @ApiPropertyOptional({ type: [String] })
    readBy?: string[];
    @ApiPropertyOptional({
        description: 'Is Encrypted',
        example: true,
        type: Boolean,
    })
    isEncrypted?: boolean;
    @ApiPropertyOptional({
        description: 'To Device ID',
        example: '1',
        type: String,
    })
    toDeviceId?: string;
    @ApiPropertyOptional({
        description: 'Signal Message Type',
        example: 'WHISPER',
        type: String,
    })
    signalMessageType?: string;
    @ApiPropertyOptional({
        description: 'Registration ID',
        example: 1,
        type: Number,
    })
    registrationId?: number;
    @ApiPropertyOptional({
        description: 'Sender Device ID',
        example: '1',
        type: String,
    })
    senderDeviceId?: string;
    /** Present when message was loaded with fromDevice; needed for E2EE session addressing. */
    @ApiPropertyOptional({
        description: 'Sender Client Device ID',
        example: '1',
        type: String,
    })
    senderClientDeviceId?: string;

    constructor(message: MessageDtoSource) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.senderId = message.senderId;
        this.content = message.content;
        this.type = message.type;
        this.fileUrl = message.fileUrl || undefined;
        this.fileName = message.fileName || undefined;
        this.fileSize = message.fileSize || undefined;
        this.replyToId = message.replyToId || undefined;
        this.editedAt = message.editedAt || undefined;
        this.isEdited = Boolean(message.editedAt);
        this.deletedAt = message.deletedAt || undefined;
        this.metadata = (message.metadata ?? undefined) as
            | CallEventMetadataDto
            | Record<string, unknown>
            | undefined;
        this.likesCount = message.likesCount ?? 0;
        this.isLiked = message.isLiked;
        this.attachments = (message.attachments ?? []).map(
            a => new MessageAttachmentDto(a),
        );
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;
        this.sender = message.sender;
        this.replyTo = message.replyTo
            ? new MessageDto(message.replyTo)
            : undefined;
        this.readBy = message.readBy || [];
        this.isEncrypted = message.isEncrypted;
        this.toDeviceId = message.toDeviceId || undefined;
        this.signalMessageType = message.signalMessageType || undefined;
        this.registrationId = message.registrationId ?? undefined;
        this.senderDeviceId = message.senderDeviceId || undefined;
        this.senderClientDeviceId =
            message.fromDevice?.clientDeviceId || undefined;
    }
}
