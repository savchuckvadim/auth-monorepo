import { MessageDto } from '@/modules/messages/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Chat, ChatMember, ChatMemberRole, ChatType, User, user_roles } from 'generated/prisma';
import { ChatMemberWithUser } from '../types/chat-member-with-user.type';
import { UserDto } from '@/modules/user';

export class ChatMemberDto {
    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;
    @ApiProperty({ description: 'Chat ID', example: '1' })
    @IsString()
    chatId: string;
    @ApiProperty({ description: 'User ID', example: '1' })
    @IsString()
    userId: string;
    @ApiProperty({ description: 'Role', example: 'MEMBER' })
    @IsEnum(ChatMemberRole)
    role: ChatMemberRole;
    @ApiProperty({ description: 'Joined At', example: '2021-01-01' })
    @IsDate()
    joinedAt: Date;
    @ApiProperty({ description: 'Left At', example: '2021-01-01' })
    @IsOptional()
    @IsDate()
    leftAt?: Date;
    @ApiProperty({ description: 'Last Read At', example: '2021-01-01' })
    @IsOptional()
    @IsDate()
    lastReadAt?: Date;

    @ApiProperty({ description: 'User', example: { id: '1', email: 'test@test.com', name: 'Test', role: 'user', isAcivated: true } })
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





export class UpdateChatDto {
    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty({ description: 'Description', example: 'Test' })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({ description: 'Avatar', example: 'https://example.com/avatar.jpg' })
    @IsOptional()
    @IsString()
    avatar?: string;
}

export class ChatDto {
    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;
    @ApiProperty({ description: 'Type', example: 'PRIVATE' })
    @IsEnum(ChatType)
    type: ChatType;
    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty({ description: 'Description', example: 'Test' })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({ description: 'Avatar', example: 'https://example.com/avatar.jpg' })
    @IsOptional()
    @IsString()
    avatar?: string;
    @ApiProperty({ description: 'Created By', example: '1' })
    @IsString()
    createdBy: string;
    @ApiProperty({ description: 'Created At', example: '2021-01-01' })
    @IsDate()
    createdAt: Date;
    @ApiProperty({ description: 'Updated At', example: '2021-01-01' })
    @IsDate()
    updatedAt: Date;
    @ApiProperty({ description: 'Members', example: [{ id: '1', chatId: '1', userId: '1', role: 'MEMBER', joinedAt: '2021-01-01', leftAt: '2021-01-01', lastReadAt: '2021-01-01' }], type: [ChatMemberDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMemberDto)
    members?: ChatMemberDto[];
    @ApiProperty({ description: 'Unread Count', example: 1 })
    @IsOptional()
    @IsNumber()
    unreadCount?: number;
    @ApiProperty({ description: 'Last Message', example: { id: '1', content: 'Test', createdAt: '2021-01-01', senderId: '1' } })
    @IsOptional()
    @ValidateNested()
    @Type(() => MessageDto)
    lastMessage?: MessageDto;
    // lastMessage?: {
    //     id: string;
    //     content: string;
    //     createdAt: Date;
    //     senderId: string;
    // };

    constructor(chat: Chat & { members?: ChatMemberWithUser[]; unreadCount?: number; lastMessage?: MessageDto }) {
        this.id = chat.id;
        this.type = chat.type;
        this.name = chat.name || undefined;
        this.description = chat.description || undefined;
        this.avatar = chat.avatar || undefined;
        this.createdBy = chat.createdBy;
        this.createdAt = chat.createdAt;
        this.updatedAt = chat.updatedAt;
        this.members = chat.members?.map(m => new ChatMemberDto(m));
        this.unreadCount = chat.unreadCount;
        this.lastMessage = chat.lastMessage;
    }
}
