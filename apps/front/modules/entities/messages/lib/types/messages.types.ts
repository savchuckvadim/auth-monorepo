import type { CallEventMetadataDto, MessageDto } from '@workspace/nest-api';
export const NO_MESSAGES_MESSAGE = 'Thanks damn! No messages yet';

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    FILE = 'FILE',
    SYSTEM = 'SYSTEM',
    CALL_EVENT = 'CALL_EVENT',
}

/**
 * Метаданные для `MessageType.CALL_EVENT`. Бэк пишет только `initiatorId` —
 * `direction` считается на клиенте (`initiatorId === me ? 'outgoing' : 'incoming'`).
 */
export interface CallEventMetadata {
    reason: 'missed' | 'accepted' | 'rejected' | 'canceled' | 'timeout' | 'failed';
    callType: 'audio' | 'video';
    durationMs?: number;
    initiatorId?: string;
    callId?: string;
}

/** Локальный статус исходящего до подтверждения сервером. */
export type ClientOutgoingStatus = 'sending' | 'failed';

export enum MessageAttachmentKind {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    VOICE = 'VOICE',
    CIRCLE = 'CIRCLE',
    FILE = 'FILE',
    POST_SHARE = 'POST_SHARE',
    FORWARD_SNAPSHOT = 'FORWARD_SNAPSHOT',
}

/**
 * Полиморфное вложение сообщения. URL есть у файловых kind’ов (IMAGE/…/FILE),
 * у POST_SHARE — `postId`, у FORWARD_SNAPSHOT — весь исходник в `metadata`.
 */
export interface MessageAttachment {
    id: string;
    messageId?: string | null;
    uploaderId: string;
    kind: MessageAttachmentKind;
    url?: string | null;
    name?: string | null;
    size?: number | null;
    mimeType?: string | null;
    durationMs?: number | null;
    width?: number | null;
    height?: number | null;
    thumbnailUrl?: string | null;
    metadata?: Record<string, unknown> | null;
    postId?: string | null;
    createdAt: string;
}

/** UI message: narrowed `type` and partial `sender` vs full `UserDto`. */
export interface Message
    extends Omit<
        MessageDto,
        | 'sender'
        | 'type'
        | 'replyTo'
        | 'metadata'
        | 'likesCount'
        | 'attachments'
    > {
    type: MessageType;
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    replyTo?: Message;
    /** Добавлено на бэке как computed-флаг; заливается orval'ом при regen. */
    isEdited?: boolean;
    /**
     * Для `type=CALL_EVENT`: с бэка — `CallEventMetadataDto`;
     * локально — `CallEventMetadata` до вычисления `direction`;
     * иначе — произвольный объект.
     */
    metadata?: CallEventMetadataDto | CallEventMetadata | Record<string, unknown>;
    /** Денормализованный счётчик лайков (с бэка). */
    likesCount?: number;
    /** Лайкнул ли текущий viewer это сообщение. */
    isLiked?: boolean;
    /** Прикреплённые файлы/посты/форварды. Может быть пусто для текстовых. */
    attachments?: MessageAttachment[];
    /** Только на клиенте: оптимистичная отправка / ошибка сети */
    _clientStatus?: ClientOutgoingStatus;
}

export interface CreateMessage {
    chatId: string;
    content: string;
    type?: MessageType;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyToId?: string;
    /** ID предварительно загруженных через `POST /messages/attachments/upload`. */
    attachmentIds?: string[];
}
