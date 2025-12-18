import { Module } from '@nestjs/common';
import { ChatsController } from './controllers/chats.controller';
import { ChatsService } from './services/chats.service';
import { ChatsRepository } from './repositories/chats.repository';
import { ChatsPrismaRepository } from './repositories/chats.prisma.repository';
import { TokenModule } from '../token';

@Module({
    imports: [TokenModule],
    controllers: [ChatsController],
    providers: [
        ChatsService,
        {
            provide: ChatsRepository,
            useClass: ChatsPrismaRepository,
        },
    ],
    exports: [ChatsService, ChatsRepository],
})
export class ChatsModule { }

