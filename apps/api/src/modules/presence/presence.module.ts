import { RedisModule } from '@/core/redis';
import { PresenceService } from './service/presence.service';
import { PresenceGateway } from './socket/presence.getway';
import { Module } from '@nestjs/common';

@Module({
    imports: [RedisModule],
    providers: [PresenceService, PresenceGateway],
    exports: [PresenceService],
})
export class PresenceModule {}
