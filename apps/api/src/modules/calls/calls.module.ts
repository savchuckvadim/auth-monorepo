import { Module } from '@nestjs/common';
import { CallsGateway } from './calls.gateway';
import { OnlineUsersService } from './services/room-storage.service';
import { CallsService } from './services/calls.service';
import { ChatsModule } from '../chats/chats.module';

@Module({
    imports: [ChatsModule],
    providers: [CallsGateway, OnlineUsersService, CallsService],
    exports: [CallsService],
})
export class CallsModule { }

