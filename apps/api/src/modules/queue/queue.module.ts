import { BullModule } from '@nestjs/bull';
import { Module} from '@nestjs/common';
import { RedisModule } from 'src/core/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { QueueDispatcherService } from './dispatch/queue-dispatcher.service';
import { QueueNames } from './constants/queue-names.enum';

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const host = configService.get('REDIS_HOST') ?? 'redis';
                const port = parseInt(
                    configService.get('REDIS_PORT') ?? '6379',
                    10,
                );



                return {
                    redis: {
                        host,
                        port,
                    },
                };
            },
            inject: [ConfigService],
        }),
        BullModule.registerQueue(
            ...Object.values(QueueNames).map(name => ({ name })),
        ),

        RedisModule,

    ],
    providers: [
        QueueDispatcherService,
    ],
    exports: [
        // QueueService,
        QueueDispatcherService,
        BullModule,

    ],
})
export class QueueModule { }
