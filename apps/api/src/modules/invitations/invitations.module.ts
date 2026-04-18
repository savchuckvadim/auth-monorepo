import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { ChatsModule } from '@/modules/chats';
import { TokenModule } from '@/modules/token';
import { PrismaModule } from '@/core/prisma';

@Module({
    imports: [PrismaModule, TokenModule, ChatsModule],
    controllers: [InvitationsController],
    providers: [InvitationsService],
    exports: [InvitationsService],
})
export class InvitationsModule {}
