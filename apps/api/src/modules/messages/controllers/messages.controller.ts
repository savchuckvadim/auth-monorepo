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
import {
    CreateMessageDto,
    CreateSystemMessageDto,
    ForwardMessagesDto,
    MessageDto,
    MessageLikeDto,
    ToggleMessageLikeResponseDto,
    UnreadCountResponseDto,
    UnreadTotalResponseDto,
    UpdateMessageDto,
} from '../dto';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { TokenPayloadDto } from '../../token/';

@Controller('messages')
@UseGuards(AccessTokenGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @ApiOperation({ summary: 'Create a new message' })
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: 200,
        description: 'Message created',
        type: MessageDto,
    })
    @Post()
    async createMessage(
        @CurrentUser() user: TokenPayloadDto,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.messagesService.createMessage(
            user.userId,
            createMessageDto,
        );
    }

    @ApiOperation({
        summary: 'Forward messages to one or multiple chats',
        description:
            'Для каждой пары (messageId × chatId) создаёт сообщение-контейнер с FORWARD_SNAPSHOT-вложением. Запрещено форвардить E2EE-источники и в E2EE-чаты.',
    })
    @ApiBody({ type: ForwardMessagesDto })
    @ApiOkResponse({
        description: 'Созданные сообщения-пересылки',
        type: [MessageDto],
    })
    @Post('forward')
    async forwardMessages(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: ForwardMessagesDto,
    ): Promise<MessageDto[]> {
        return this.messagesService.forwardMessages(
            user.userId,
            dto.messageIds,
            dto.targetChatIds,
        );
    }

    @ApiOperation({
        summary:
            'Create a system line in chat (policy / service notice; rendered as SYSTEM)',
    })
    @ApiBody({ type: CreateSystemMessageDto })
    @ApiResponse({
        status: 200,
        description: 'System message created',
        type: MessageDto,
    })
    @Post('system')
    async createSystemMessage(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: CreateSystemMessageDto,
    ) {
        return this.messagesService.createSystemMessage(
            user.userId,
            dto.chatId,
            dto.content,
        );
    }
    @ApiOperation({ summary: 'Get messages for a chat' })
    @ApiResponse({
        status: 200,
        description: 'Messages fetched',
        type: [MessageDto],
    })
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

    @ApiOperation({
        summary: 'Total unread messages for current user (all chats)',
    })
    @ApiOkResponse({
        description: 'Total unread count',
        type: UnreadTotalResponseDto,
    })
    @Get('unread/total')
    async getTotalUnread(@CurrentUser() user: TokenPayloadDto) {
        const total = await this.messagesService.getTotalUnreadCount(
            user.userId,
        );
        return { total };
    }

    @ApiOperation({ summary: 'Get a message by ID' })
    @ApiResponse({
        status: 200,
        description: 'Message fetched',
        type: MessageDto,
    })
    @Get(':id')
    async getMessageById(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.messagesService.getMessageById(messageId, user.userId);
    }

    @ApiOperation({ summary: 'Update a message' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiBody({ type: UpdateMessageDto })
    @ApiResponse({
        status: 200,
        description: 'Message updated',
        type: MessageDto,
    })
    @Put(':id')
    async updateMessage(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: UpdateMessageDto,
    ) {
        return this.messagesService.updateMessage(
            messageId,
            user.userId,
            dto.content,
        );
    }

    @ApiOperation({ summary: 'Delete a message' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiResponse({
        status: 200,
        description: 'Message deleted',
        type: MessageDto,
    })
    @Delete(':id')
    async deleteMessage(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.messagesService.deleteMessage(messageId, user.userId);
    }

    @ApiOperation({ summary: 'Mark a message as read' })
    @ApiParam({ name: 'id', description: 'Message ID', example: '1' })
    @ApiResponse({
        status: 200,
        description: 'Message marked as read',
        type: MessageDto,
    })
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
    @ApiResponse({
        status: 200,
        description: 'Chat marked as read',
        type: MessageDto,
    })
    @Post('chat/:chatId/read')
    async markChatAsRead(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.messagesService.markChatAsRead(chatId, user.userId);
        return { message: 'Chat marked as read' };
    }

    @ApiOperation({
        summary: 'Toggle like on a message (idempotent via POST)',
        description:
            'Повторный POST снимает лайк. Возвращает финальное состояние для подтверждения оптимистичного UI.',
    })
    @ApiParam({ name: 'id', description: 'Message ID', type: String })
    @ApiOkResponse({
        description: 'Like toggle result',
        type: ToggleMessageLikeResponseDto,
    })
    @Post(':id/like')
    async toggleLike(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<ToggleMessageLikeResponseDto> {
        return this.messagesService.toggleMessageLike(messageId, user.userId);
    }

    @ApiOperation({ summary: 'List users who liked the message' })
    @ApiParam({ name: 'id', description: 'Message ID', type: String })
    @ApiOkResponse({
        description: 'Paginated likers list',
        type: [MessageLikeDto],
    })
    @Get(':id/likes')
    async listLikes(
        @Param('id') messageId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ): Promise<MessageLikeDto[]> {
        const entries = await this.messagesService.getMessageLikes(
            messageId,
            user.userId,
            {
                cursor,
                limit: limit ? parseInt(limit, 10) : undefined,
            },
        );
        return entries.map(e => ({
            id: e.id,
            messageId: e.messageId,
            createdAt: e.createdAt,
            user: e.user,
        }));
    }

    @ApiOperation({ summary: 'Get unread count for a chat' })
    @ApiParam({ name: 'chatId', description: 'Chat ID', example: '1' })
    @ApiOkResponse({
        description: 'Unread count for the chat',
        type: UnreadCountResponseDto,
    })
    @Get('chat/:chatId/unread')
    async getUnreadCount(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        const count = await this.messagesService.getUnreadCount(
            chatId,
            user.userId,
        );
        return { count };
    }
}
