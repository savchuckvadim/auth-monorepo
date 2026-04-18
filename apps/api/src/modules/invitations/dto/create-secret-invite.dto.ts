import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSecretChatInviteDto {
    @ApiProperty({
        description: 'User to invite to a Signal E2EE private chat',
    })
    @IsUUID('4')
    toUserId: string;
}
