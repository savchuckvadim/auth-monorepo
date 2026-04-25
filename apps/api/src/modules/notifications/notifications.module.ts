import { Module, forwardRef } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { FollowersModule } from '../followers/followers.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { FcmPushService } from './push/fcm-push.service';
import { ApnsPushService } from './push/apns-push.service';
import { ApnsVoipPushService } from './push/apns-voip-push.service';
import { PushDispatchService } from './push/push-dispatch.service';
import { PushDeviceCleanupService } from './push-device-cleanup.service';
import { PrismaModule } from '@/core/prisma';
import { TokenModule } from '@/modules/token';

@Module({
    imports: [PrismaModule, TokenModule, forwardRef(() => FollowersModule)],
    controllers: [NotificationsController],
    providers: [
        NotificationsGateway,
        NotificationsService,
        FcmPushService,
        ApnsPushService,
        ApnsVoipPushService,
        PushDispatchService,
        PushDeviceCleanupService,
    ],
    exports: [NotificationsGateway, NotificationsService, PushDispatchService],
})
export class NotificationsModule {}
