import {
    ChatDto,
    ChatDtoEncryptionMode,
    ChatMemberDto,
    CreateChatDto,
} from '@workspace/nest-api';

export type { ChatMemberDto };
export type { ChatDtoEncryptionMode as ChatEncryptionMode };

export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export enum ChatMemberRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

/** UI layer: same fields as API `ChatDto`, with a narrowed `type`. */
export interface Chat extends Omit<ChatDto, 'type'> {
    type: ChatType;
}

export interface CreateChat extends CreateChatDto {
    type: ChatType;
    name: string;
    description: string;
    memberIds: string[];
}
