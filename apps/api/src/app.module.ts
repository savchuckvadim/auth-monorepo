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
    ],

    providers: [GlobalExceptionFilter],
})
export class AppModule { }
