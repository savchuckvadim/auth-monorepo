import { ChatDto, ChatMemberDto, CreateChatDto } from "@workspace/nest-api";

export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export enum ChatMemberRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

// export interface ChatMember {
//     id: string;
//     chatId: string;
//     userId: string;
//     role: ChatMemberRole;
//     joinedAt: string;
//     leftAt?: string;
//     lastReadAt?: string;
//     user?: {
//         id: string;
//         name: string;
//         email: string;
//     };
// }

export interface Chat extends ChatDto {
    id: string;
    type: ChatType;
    name: string;
    description: string;
    avatar: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    members: ChatMemberDto[];
    unreadCount: number;
    lastMessage: {
        id: string;
        content: string;
        createdAt: string;
        senderId: string;
    };
}

export interface CreateChat extends CreateChatDto {
    type: ChatType;
    name: string;
    description: string;
    memberIds: string[];
}

