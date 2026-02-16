import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto, MessageDto } from '../dto';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TokenPayloadDto } from '../../token/';

@Controller('messages')
@UseGuards(AccessTokenGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @ApiOperation({ summary: 'Create a new message' })
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({ status: 200, description: 'Message created', type: MessageDto })
    @Post()
    async createMessage(
        @CurrentUser() user: TokenPayloadDto,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.messagesService.createMessage(user.userId, createMessageDto);
    }
    @ApiOperation({ summary: 'Get messages for a chat' })
    @ApiResponse({ status: 200, description: 'Messages fetched', type: [MessageDto] })
    @Get('chat/:chatId')
    async getChatMessages(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.messagesService.getChatMessages(
            chatId,
            user.userId,
            limit ? parseInt(limit) : undefined,
            offset ? parseInt(offset) : undefined,
        );
    }

    @ApiOperation({ summary: 'Get a message by ID' })
    @ApiResponse({ status: 200, description: 'Message fetched', type: MessageDto })
    @Get(':id')
    async getMessageById(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.messagesService.getMessageById(messageId, user.userId);
    }

    @ApiOperation({ summary: 'Update a message' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Message updated', type: MessageDto })
    @Put(':id')
    async updateMessage(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body('content') content: string,
    ) {
        return this.messagesService.updateMessage(messageId, user.userId, content);
    }

    @ApiOperation({ summary: 'Delete a message' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Message deleted', type: MessageDto })
    @Delete(':id')
    async deleteMessage(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.messagesService.deleteMessage(messageId, user.userId);
    }

    @ApiOperation({ summary: 'Mark a message as read' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Message marked as read', type: MessageDto })
    @Post(':id/read')
    async markAsRead(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.messagesService.markAsRead(messageId, user.userId);
        return { message: 'Message marked as read' };
    }

    @ApiOperation({ summary: 'Mark a chat as read' })
    @ApiParam({ name: 'chatId', description: 'Chat ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Chat marked as read', type: MessageDto })
    @Post('chat/:chatId/read')
    async markChatAsRead(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.messagesService.markChatAsRead(chatId, user.userId);
        return { message: 'Chat marked as read' };
    }

    @ApiOperation({ summary: 'Get unread count for a chat' })
    @ApiParam({ name: 'chatId', description: 'Chat ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Unread count fetched', type: Number })
    @Get('chat/:chatId/unread')
    async getUnreadCount(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        const count = await this.messagesService.getUnreadCount(chatId, user.userId);
        return { count };
    }
}

