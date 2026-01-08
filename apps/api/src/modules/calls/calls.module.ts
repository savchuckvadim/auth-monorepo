import { Module } from '@nestjs/common';
import { CallsGateway } from './socket/calls.gateway';
import { OnlineUsersService } from './services/online-users.service';
import { CallsService } from './services/calls.service';

@Module({
    providers: [CallsGateway, OnlineUsersService, CallsService],
    exports: [CallsService],
})
export class CallsModule { }

