import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserPrismaRepository } from "./user.prisma.repository";
import { TokenModule } from "../token";
import { UserAdminController } from "./user.admin.controller";


@Module({
    imports: [TokenModule],
    controllers: [UserController, UserAdminController],
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
