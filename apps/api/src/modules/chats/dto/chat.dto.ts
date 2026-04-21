import { MessageDto } from '@/modules/messages/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import {
    Chat,
    ChatEncryptionMode,
    ChatMemberRole,
    ChatType,
    User,
    user_roles,
} from 'generated/prisma';
import { ChatMemberWithUser } from '../types/chat-member-with-user.type';
import { UserDto } from '@/modules/user';

export class ChatMemberDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    @IsString()
    id: string;
    @ApiProperty({ description: 'Chat ID', example: '1', type: String })
    @IsString()
    chatId: string;
    @ApiProperty({ description: 'User ID', example: '1', type: String })
    @IsString()
    userId: string;
    @ApiProperty({
        description: 'Role',
        example: 'MEMBER',
        enum: ChatMemberRole,
        type: String,
    })
    @IsEnum(ChatMemberRole)
    role: ChatMemberRole;
    @ApiProperty({
        description: 'Joined At',
        example: '2021-01-01',
        type: Date,
    })
    @IsDate()
    joinedAt: Date;
    @ApiProperty({
        description: 'Left At',
        example: '2021-01-01',
        type: Date,
    })
    @IsOptional()
    @IsDate()
    leftAt?: Date;
    @ApiProperty({
        description: 'Last Read At',
        example: '2021-01-01',
        type: Date,
    })
    @IsOptional()
    @IsDate()
    lastReadAt?: Date;

    @ApiProperty({
        description: 'User',
        example: {
            id: '1',
            email: 'test@test.com',
            name: 'Test',
            role: 'user',
            isAcivated: true,
        },
        type: () => UserDto,
    })
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;

    constructor(member: ChatMemberWithUser) {
        this.id = member.id;
        this.chatId = member.chatId;
        this.userId = member.userId;
        this.role = member.role;
        this.joinedAt = member.joinedAt;
        this.leftAt = member.leftAt || undefined;
        this.lastReadAt = member.lastReadAt || undefined;
        this.user = new UserDto({
            id: member.user.id,
            email: member.user.email,
            name: member.user.name,
            role: user_roles.user,
            isAcivated: true,
        } as User);
    }
}

/** Name/description/avatar; timer policy only for SIGNAL private chats. */
export class UpdateChatDto {
    @ApiPropertyOptional({ description: 'Name', example: 'Test', type: String })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional({
        description: 'Description',
        example: 'Test',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiPropertyOptional({
        description: 'Avatar',
        example: 'https://example.com/avatar.jpg',
        type: String,
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional({
        description:
            'Удалить весь чат в указанный момент (ISO 8601). `null` — отключить.',
        type: String,
        format: 'date-time',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    scheduledDeletionAt?: string | null;

    @ApiPropertyOptional({
        description:
            'Новые сообщения удалять через N секунд (`null` или `0` — выкл.).',
        type: Number,
        example: 3600,
        nullable: true,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    disappearingMessageSeconds?: number | null;
}

export class ChatDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    @IsString()
    id: string;
    @ApiProperty({
        description: 'Type',
        example: 'PRIVATE',
        enum: ChatType,
        type: String,
    })
    @IsEnum(ChatType)
    type: ChatType;

    @ApiProperty({
        enum: ChatEncryptionMode,
        description:
            'Messenger E2EE mode. Immutable after create. ' +
            'To use both plaintext and E2EE with the same contact, create two private chats (different chatId).',
        type: String,
    })
    @IsEnum(ChatEncryptionMode)
    encryptionMode: ChatEncryptionMode;
    @ApiProperty({ description: 'Name', example: 'Test', type: String })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty({ description: 'Description', example: 'Test', type: String })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({
        description: 'Avatar',
        example: 'https://example.com/avatar.jpg',
        type: String,
    })
    @IsOptional()
    @IsString()
    avatar?: string;
    @ApiProperty({ description: 'Created By', example: '1', type: String })
    @IsString()
    createdBy: string;
    @ApiProperty({
        description: 'Created At',
        example: '2021-01-01',
        type: Date,
    })
    @IsDate()
    createdAt: Date;
    @ApiProperty({
        description: 'Updated At',
        example: '2021-01-01',
        type: Date,
    })
    @IsDate()
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Автоудаление всего чата в это время',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDate()
    scheduledDeletionAt?: Date;

    @ApiPropertyOptional({
        description: 'Новые сообщения исчезают через N секунд (0 = выкл.)',
        example: 3600,
    })
    @IsOptional()
    @IsNumber()
    disappearingMessageSeconds?: number;

    @ApiProperty({
        description: 'Members',
        example: [
            {
                id: '1',
                chatId: '1',
                userId: '1',
                role: 'MEMBER',
                joinedAt: '2021-01-01',
                leftAt: '2021-01-01',
                lastReadAt: '2021-01-01',
            },
        ],
        type: [ChatMemberDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMemberDto)
    members?: ChatMemberDto[];
    @ApiProperty({ description: 'Unread Count', example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    unreadCount?: number;
    @ApiProperty({
        description: 'Last Message',
        example: {
            id: '1',
            content: 'Test',
            createdAt: '2021-01-01',
            senderId: '1',
        },
        type: () => MessageDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => MessageDto)
    lastMessage?: MessageDto;

    @ApiPropertyOptional({
        description:
            'When last message is from current user (private chat): peer has read it (double-check UX)',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    lastMessageOutgoingRead?: boolean;
    // lastMessage?: {
    //     id: string;
    //     content: string;
    //     createdAt: Date;
    //     senderId: string;
    // };

    constructor(
        chat: Chat & {
            members?: ChatMemberWithUser[];
            unreadCount?: number;
            lastMessage?: MessageDto;
            lastMessageOutgoingRead?: boolean;
        },
    ) {
        this.id = chat.id;
        this.type = chat.type;
        this.encryptionMode = chat.encryptionMode;
        this.name = chat.name || undefined;
        this.description = chat.description || undefined;
        this.avatar = chat.avatar || undefined;
        this.createdBy = chat.createdBy;
        this.createdAt = chat.createdAt;
        this.updatedAt = chat.updatedAt;
        this.scheduledDeletionAt = chat.scheduledDeletionAt ?? undefined;
        this.disappearingMessageSeconds =
            chat.disappearingMessageSeconds ?? undefined;
        this.members = chat.members?.map(m => new ChatMemberDto(m));
        this.unreadCount = chat.unreadCount;
        this.lastMessage = chat.lastMessage;
        this.lastMessageOutgoingRead = chat.lastMessageOutgoingRead;
    }
}
