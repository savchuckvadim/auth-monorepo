import { Module } from '@nestjs/common';
import { MessagesController } from './controllers/messages.controller';
import { MessagesGateway } from './socket/messages.gateway';
import { MessagesService } from './services/messages.service';
import { MessagesRepository } from './repositories/messages.repository';
import { MessagesPrismaRepository } from './repositories/messages.prisma.repository';
import { SocketStorageService } from './socket/socket-storage.service';
import { ChatsModule } from '@/modules/chats';
import { TokenModule } from '@/modules/token';
import { PrismaModule } from '@/core/prisma';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { RedisModule } from '@/core/redis';

@Module({
    imports: [PrismaModule, ChatsModule, TokenModule, NotificationsModule, RedisModule],
    controllers: [MessagesController],
    providers: [
        MessagesService,
        MessagesGateway,
        SocketStorageService,
        {
            provide: MessagesRepository,
            useClass: MessagesPrismaRepository,
        },
    ],
    exports: [MessagesService, MessagesRepository],
})
export class MessagesModule { }

