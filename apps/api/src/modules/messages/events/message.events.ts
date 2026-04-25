import { MessageDto } from '../dto';

export class MessageCreatedEvent {
    constructor(
        public readonly message: MessageDto,
        public readonly chatId: string,
        public readonly senderId: string,
    ) {}
}

export class ChatReadEvent {
    constructor(
        public readonly chatId: string,
        public readonly readerUserId: string,
    ) {}
}

export class MessageUpdatedEvent {
    constructor(
        public readonly message: MessageDto,
        public readonly chatId: string,
        public readonly editorUserId: string,
    ) {}
}

export class MessageDeletedEvent {
    constructor(
        public readonly messageId: string,
        public readonly chatId: string,
        public readonly deleterUserId: string,
    ) {}
}

/**
 * Событие изменения лайка. WS-шлюз раутит в комнату чата — так каждый
 * участник узнаёт финальный `likesCount`, а виновник toggle получает
 * ещё и свой `isLiked` через ответ эндпоинта.
 */
export class MessageLikedEvent {
    constructor(
        public readonly messageId: string,
        public readonly chatId: string,
        public readonly userId: string,
        public readonly likesCount: number,
        public readonly isLiked: boolean,
    ) {}
}
