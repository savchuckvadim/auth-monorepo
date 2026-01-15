import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayloadDto, TokenService } from '@/modules/token';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(

        private readonly tokenService: TokenService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request & { user?: TokenPayloadDto }>();



        let accessToken: string | undefined;
        // 1) Берём из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            accessToken = authHeader.split(' ')[1];
        }

        // 2) fallback: берём из Cookies
        if (!accessToken && req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        }
        if (!accessToken) {
            throw new UnauthorizedException('ACCESS_TOKEN_MISSING'); // Требуется авторизация
        }
        const user = await this.tokenService.validateAccessToken(accessToken);

        req.user = user;

        return true;


    }
}
