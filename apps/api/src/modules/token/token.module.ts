import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { TokenPrismaRepository } from './token.prisma.repository';
import { TokenCleanupService } from './token-cleanup.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@/core/redis/redis.module';

@Module({
    imports: [JwtModule, RedisModule],
    providers: [
        TokenService,
        TokenCleanupService,
        {
            provide: TokenRepository,
            useClass: TokenPrismaRepository,
        },
    ],
    exports: [TokenService],
})
export class TokenModule {}
