import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostRepository } from './repositories/post.repository';
import { PostPrismaRepository } from './repositories/post.prisma.repository';
import { PostGateway } from './socket/post.gateway';
import { TokenModule } from '../token';
import { S3Module } from '@/core/s3';
import { FollowersModule } from '../followers/followers.module';

@Module({
    imports: [TokenModule, S3Module, FollowersModule],
    controllers: [PostController],
    providers: [
        PostService,
        PostGateway,
        {
            provide: PostRepository,
            useClass: PostPrismaRepository,
        },
    ],
    exports: [PostService],
})
export class PostModule {}
