import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserPrismaRepository } from "./user.prisma.repository";
import { TokenModule } from "../token";


@Module({
    imports: [ TokenModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: UserRepository,
            useClass: UserPrismaRepository,
        },
    ],
    exports: [UserService],
})
export class UserModule { }
