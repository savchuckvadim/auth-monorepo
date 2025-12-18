import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from '@/core/queue';


import { TelegramModule } from './modules/telegram/telegram.module';
import { GlobalExceptionFilter } from '@/core/filters';
import { RedisModule } from '@/core/redis';

import { PrismaModule } from './core/prisma';
import { AuthModule } from '@/modules/auth';
import { CookieModule } from '@/core/cookie';
import { UserModule } from "@/modules/user";
import { TokenModule } from "@/modules/token";
import { MailModule } from "@/modules/mail";
import { ChatsModule } from "@/modules/chats";
import { MessagesModule } from "@/modules/messages";
import { CallsModule } from "@/modules/calls/calls.module";
import { FollowersModule } from "@/modules/followers";
import { NotificationsModule } from "@/modules/notifications/notifications.module";



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            ignoreEnvFile: false,
            load: [
                () => ({
                    REDIS_HOST: process.env.REDIS_HOST,
                    REDIS_PORT: process.env.REDIS_PORT,
                }),
            ],
        }),
        CookieModule,
        PrismaModule,
        QueueModule,
        TelegramModule,

        MailModule,

        RedisModule,
        AuthModule,
        UserModule,
        TokenModule,
        ChatsModule,
        MessagesModule,
        CallsModule,
        FollowersModule,
        NotificationsModule,
    ],

    providers: [GlobalExceptionFilter],
})
export class AppModule { }
