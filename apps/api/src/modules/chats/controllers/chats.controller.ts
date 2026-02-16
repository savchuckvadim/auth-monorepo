import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { CreateChatDto, AddMemberDto, ChatDto, UpdateChatDto } from '../dto';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { TokenPayloadDto } from '../../token';

@Controller('chats')
@UseGuards(AccessTokenGuard)
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }

    @ApiOperation({ summary: 'Create a new chat' })
    @ApiBody({ type: CreateChatDto })
    @ApiResponse({ status: 200, description: 'Chat created', type: ChatDto })
    @Post()
    async createChat(
        @CurrentUser() user: TokenPayloadDto,
        @Body() createChatDto: CreateChatDto,
    ) {
        return this.chatsService.createChat(user.userId, createChatDto);
    }
    @ApiOperation({ summary: 'Get all chats for the current user' })
    @ApiResponse({ status: 200, description: 'Chats list', type: [ChatDto] })
    @Get()
    async getUserChats(@CurrentUser() user: TokenPayloadDto) {
        return this.chatsService.getUserChats(user.userId);
    }

    @ApiOperation({ summary: 'Get a chat by id' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Chat', type: ChatDto })
    @Get(':id')
    async getChatById(
        @Param('id') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.chatsService.getChatById(chatId, user.userId);
    }
    @ApiOperation({ summary: 'Add a member to a chat' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiBody({ type: AddMemberDto })
    @ApiResponse({ status: 200, description: 'Member added successfully', type: ChatDto })
    @Post(':id/members')
    async addMember(
        @Param('id') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body() addMemberDto: AddMemberDto,
    ) {
        await this.chatsService.addMember(chatId, user.userId, addMemberDto);
        return { message: 'Member added successfully' };
    }

    @ApiOperation({ summary: 'Remove a member from a chat' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiParam({ name: 'memberId', description: 'Member ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Member removed successfully', type: ChatDto })
    @Delete(':id/members/:memberId')
    async removeMember(
        @Param('id') chatId: string,
        @Param('memberId') memberId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.chatsService.removeMember(chatId, user.userId, memberId);
        return { message: 'Member removed successfully' };
    }
    @ApiOperation({ summary: 'Update a chat' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiBody({ type: UpdateChatDto })
    @ApiResponse({ status: 200, description: 'Chat updated successfully', type: ChatDto })
    @Patch(':id')
    async updateChat(
        @Param('id') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body() data: UpdateChatDto,
    ) {
        return this.chatsService.updateChat(chatId, user.userId, data);
    }

    @ApiOperation({ summary: 'Mark a chat as read' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Chat marked as read', type: ChatDto })
    @Post(':id/read')
    async markAsRead(
        @Param('id') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.chatsService.markAsRead(chatId, user.userId);
        return { message: 'Chat marked as read' };
    }

    @ApiOperation({ summary: 'Delete a chat' })
    @ApiParam({ name: 'id', description: 'Chat ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Chat deleted successfully', type: ChatDto })
    @Delete(':id')
    async deleteChat(
        @Param('id') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.chatsService.deleteChat(chatId, user.userId);
        return { message: 'Chat deleted successfully' };
    }
}

