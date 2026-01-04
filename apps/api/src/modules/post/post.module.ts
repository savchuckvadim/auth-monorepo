import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";
import { PostPrismaRepository } from "./post.prisma.repository";
import { TokenModule } from "../token";

@Module({
    imports: [TokenModule],
    controllers: [PostController],
    providers: [
        PostService,
        {
            provide: PostRepository,
            useClass: PostPrismaRepository,
        },
    ],
    exports: [PostService],
})
export class PostModule { }

