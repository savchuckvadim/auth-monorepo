import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { TokenRepository } from "./token.repository";
import { TokenPrismaRepository } from "./token.prisma.repository";
import { JwtModule } from "@nestjs/jwt";


@Module({

    imports: [
        JwtModule,
    ],
    providers: [
        TokenService,
        {
            provide: TokenRepository,
            useClass: TokenPrismaRepository,
        }
    ],
    exports: [TokenService],
})
export class TokenModule { }
