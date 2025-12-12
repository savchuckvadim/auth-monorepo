import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { UserModule } from "@/modules/user";
import { TokenModule } from "@/modules/token";
import { MailModule } from "@/modules/mail";
import { AuthService } from "./services/auth.service";
import { CookieModule, CookieService } from "@/core/cookie";


@Module({
    imports: [UserModule, TokenModule, MailModule, CookieModule],
    controllers: [AuthController],
    providers: [AuthService, CookieService],
})
export class AuthModule { }
