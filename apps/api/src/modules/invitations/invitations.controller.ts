import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';
import { ChatDto } from '@/modules/chats/dto';
import { InvitationsService } from './invitations.service';
import {
    AcceptInvitationResponseDto,
    CreateSecretChatInviteDto,
    InvitationDto,
} from './dto';

@ApiTags('Invitations')
@ApiExtraModels(ChatDto, InvitationDto, AcceptInvitationResponseDto)
@Controller('invitations')
@UseGuards(AccessTokenGuard)
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    @Post('secret-chat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Invite user to a Signal (E2EE) private chat' })
    @ApiOkResponse({ type: InvitationDto })
    async createSecretInvite(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: CreateSecretChatInviteDto,
    ) {
        return this.invitationsService.createSecretPrivateInvite(
            user.userId,
            dto.toUserId,
        );
    }

    @Get('incoming')
    @ApiOperation({ summary: 'Pending invitations addressed to me' })
    @ApiOkResponse({ type: InvitationDto, isArray: true })
    async incoming(@CurrentUser() user: TokenPayloadDto) {
        return this.invitationsService.listIncoming(user.userId);
    }

    @Get('outgoing')
    @ApiOperation({ summary: 'Pending invitations I sent' })
    @ApiOkResponse({ type: InvitationDto, isArray: true })
    async outgoing(@CurrentUser() user: TokenPayloadDto) {
        return this.invitationsService.listOutgoing(user.userId);
    }

    @Post(':id/accept')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Accept invitation (creates SIGNAL private chat)',
    })
    @ApiOkResponse({ type: AcceptInvitationResponseDto })
    async accept(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.invitationsService.accept(id, user.userId);
    }

    @Post(':id/reject')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reject invitation' })
    @ApiOkResponse({ type: InvitationDto })
    async reject(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.invitationsService.reject(id, user.userId);
    }
}
