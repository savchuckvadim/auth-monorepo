import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './modules/queue/queue.module';

import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './modules/telegram/telegram.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { RedisModule } from './core/redis/redis.module';
import { HealthController } from './health.controller';

import { StorageModule } from '@/core/storage/storage.module';
import { FileLinkModule } from '@/core/file-link/file-link.module';
import { PrismaModule } from './core/prisma/prisma.module';


import { AuthModule } from '@/modules/auth/auth.module';

import { CookieModule } from '@/core/cookie/cookie.module';
import { UserModule } from "@/modules/user";
import { TokenModule } from "@/modules/token";
import { MailModule } from "@/modules/mail";
@Module({
    imports: [
        // DevtoolsModule.register({
        //   http: process.env.NODE_ENV !== 'production'
        // }),

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
        MailModule,

        TelegramModule,
        RedisModule,

        // StorageModule,
        // FileLinkModule,


        AuthModule,
    ],
    controllers: [AppController, HealthController],
    providers: [AppService, GlobalExceptionFilter],
})
export class AppModule { }
