import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "@/modules/user";
import { TokenModule } from "@/modules/token";
import { MailModule } from "@/modules/mail";


@Module({
    imports: [UserModule, TokenModule, MailModule],
    controllers: [AuthController],

})
export class AuthModule { }
