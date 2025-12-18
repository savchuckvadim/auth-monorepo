export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export enum ChatMemberRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

export interface ChatMember {
    id: string;
    chatId: string;
    userId: string;
    role: ChatMemberRole;
    joinedAt: string;
    leftAt?: string;
    lastReadAt?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface Chat {
    id: string;
    type: ChatType;
    name?: string;
    description?: string;
    avatar?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    members?: ChatMember[];
    unreadCount?: number;
    lastMessage?: {
        id: string;
        content: string;
        createdAt: string;
        senderId: string;
    };
}

export interface CreateChat {
    type: ChatType;
    name?: string;
    description?: string;
    memberIds: string[];
}

