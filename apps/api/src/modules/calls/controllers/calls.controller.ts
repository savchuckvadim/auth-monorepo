import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LiveKitService } from '../services/live-kit.service';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';
import { CallsService } from '../services/calls.service';
import { CallHistoryItemDto } from '../dto/call-history-item.dto';
import { GetTokenDto } from '../dto/get-token.dto';
import { CallTokenDto } from '../dto/call-token.dto';
@ApiTags('calls')
@Controller('calls')
@UseGuards(AccessTokenGuard)
export class CallsController {
    constructor(
        private readonly liveKitService: LiveKitService,
        private readonly callsService: CallsService,
    ) {}

    @ApiOperation({ summary: 'Get token' })
    @ApiResponse({ status: 200, type: CallTokenDto })
    @ApiBody({ type: GetTokenDto })
    @Post('token')
    async getToken(
        @Body() body: GetTokenDto,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        const token = await this.liveKitService.generateToken(
            body.roomName,
            user.userId || body.userId,
        );
        return { token };
    }

    @ApiOperation({
        summary: 'Get call history for chat (non-secret chats only)',
    })
    @ApiOkResponse({ type: [CallHistoryItemDto] })
    @Get('chat/:chatId/history')
    async getChatCallHistory(
        @Param('chatId') chatId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.callsService.getChatCallHistory(chatId, user.userId);
    }
}
