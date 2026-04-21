import { Module, forwardRef } from '@nestjs/common';
import { ChatsController } from './controllers/chats.controller';
import { ChatsService } from './services/chats.service';
import { ChatsRepository } from './repositories/chats.repository';
import { ChatsPrismaRepository } from './repositories/chats.prisma.repository';
import { TokenModule } from '../token';
import { MessagesModule } from '@/modules/messages/messages.module';
import { MessengerScheduleService } from './messenger-schedule.service';

@Module({
    imports: [TokenModule, forwardRef(() => MessagesModule)],
    controllers: [ChatsController],
    providers: [
        ChatsService,
        MessengerScheduleService,
        {
            provide: ChatsRepository,
            useClass: ChatsPrismaRepository,
        },
    ],
    exports: [ChatsService, ChatsRepository],
})
export class ChatsModule {}
