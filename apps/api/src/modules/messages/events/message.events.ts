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
