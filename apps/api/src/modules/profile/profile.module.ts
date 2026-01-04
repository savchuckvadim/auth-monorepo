import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { ProfileRepository } from "./profile.repository";
import { ProfilePrismaRepository } from "./profile.prisma.repository";
import { UserModule } from "../user";
import { TokenModule } from "../token";
import { PostModule } from "../post";
import { S3Module } from "@/core/s3";

@Module({
    imports: [UserModule, TokenModule, PostModule, S3Module],
    controllers: [ProfileController],
    providers: [
        ProfileService,
        {
            provide: ProfileRepository,
            useClass: ProfilePrismaRepository,
        },
    ],
    exports: [ProfileService],
})
export class ProfileModule { }

