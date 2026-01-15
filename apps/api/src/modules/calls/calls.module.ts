import { Module } from '@nestjs/common';
import { CallsGateway } from './socket/calls.gateway';
import { OnlineUsersService } from './services/online-users.service';
import { CallsService } from './services/calls.service';
import { LiveKitService } from './services/live-kit.service';
import { CallsController } from './controllers/calls.controller';

@Module({
    controllers: [CallsController],
    providers: [CallsGateway, OnlineUsersService, CallsService, LiveKitService],
    exports: [CallsService],
})
export class CallsModule { }

