import { Module } from '@nestjs/common';
import { CallsGateway } from './socket/calls.gateway';
import { OnlineUsersService } from './services/online-users.service';
import { CallsService } from './services/calls.service';
import { LiveKitService } from './services/live-kit.service';
import { CallsController } from './controllers/calls.controller';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { PrismaModule } from '@/core/prisma';
import { MessagesModule } from '@/modules/messages';
import { TokenModule } from '@/modules/token';

@Module({
    imports: [PrismaModule, NotificationsModule, MessagesModule, TokenModule],
    controllers: [CallsController],
    providers: [CallsGateway, OnlineUsersService, CallsService, LiveKitService],
    exports: [CallsService],
})
export class CallsModule {}
