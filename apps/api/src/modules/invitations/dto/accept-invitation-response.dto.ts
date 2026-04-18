import { ApiProperty } from '@nestjs/swagger';
import { ChatDto } from '@/modules/chats/dto';
import { InvitationDto } from './invitation.dto';

/** Returned by POST /invitations/:id/accept */
export class AcceptInvitationResponseDto {
    @ApiProperty({ type: () => ChatDto })
    chat: ChatDto;

    @ApiProperty({ type: () => InvitationDto })
    invitation: InvitationDto;
}
