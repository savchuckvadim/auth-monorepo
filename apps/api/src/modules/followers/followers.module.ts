import { Module, forwardRef } from '@nestjs/common';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { FollowersRepository } from './followers.repository';
import { FollowersPrismaRepository } from './followers.prisma.repository';
import { TokenModule } from '../token/token.module';
import { PrismaModule } from '@/core/prisma';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        PrismaModule,
        TokenModule,
        forwardRef(() => NotificationsModule),
    ],
    controllers: [FollowersController],
    providers: [
        FollowersService,
        {
            provide: FollowersRepository,
            useClass: FollowersPrismaRepository,
        },
    ],
    exports: [FollowersService, FollowersRepository],
})
export class FollowersModule { }

