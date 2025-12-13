import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '@/modules/token';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(

        private readonly tokenService: TokenService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();



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
            throw new UnauthorizedException('Требуется авторизация');
        }
        const user = await this.tokenService.validateAccessToken(accessToken);
        if (!user) {
            throw new UnauthorizedException('Invalid access token');
        }
        (req as any).user = user;
        console.log('user in guard', user);
        return true;


    }
}
