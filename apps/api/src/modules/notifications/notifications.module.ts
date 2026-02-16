import { Module, forwardRef } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { FollowersModule } from '../followers/followers.module';

@Module({
    imports: [forwardRef(() => FollowersModule)],
    providers: [NotificationsGateway],
    exports: [NotificationsGateway],
})
export class NotificationsModule { }

