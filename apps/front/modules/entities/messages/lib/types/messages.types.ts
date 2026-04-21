import { MessageDto } from '@workspace/nest-api';
export const NO_MESSAGES_MESSAGE = 'Thanks damn! No messages yet';

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    FILE = 'FILE',
    SYSTEM = 'SYSTEM',
}

/** Локальный статус исходящего до подтверждения сервером. */
export type ClientOutgoingStatus = 'sending' | 'failed';

/** UI message: narrowed `type` and partial `sender` vs full `UserDto`. */
export interface Message
    extends Omit<MessageDto, 'sender' | 'type' | 'replyTo'> {
    type: MessageType;
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    replyTo?: Message;
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
}
