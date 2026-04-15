// src/common/services/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
    constructor(private configService: ConfigService) {}

    private readonly REFRESH_COOKIE_NAME = 'refreshToken';
    private readonly ACCESS_COOKIE_NAME = 'accessToken';

    private isProd(): boolean {
        return this.configService.get<string>('NODE_ENV') === 'production';
    }
    private getCookieOptions(maxAge?: 'access' | 'refresh'): CookieOptions {
        const domain = this.configService.get<string>('CLIENT_DOMAIN');
        const isProd = this.isProd();

        const options: CookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            domain: isProd ? domain : 'localhost',
            path: '/',
        };
        if (maxAge) {
            options.maxAge =
                maxAge === 'access'
                    ? 15 * 60 * 1000 // 15 минут
                    : 30 * 24 * 60 * 60 * 1000; // 30 дней

            //for test
            // options.maxAge = maxAge === 'access'
            //     ? 1 * 60 * 1000  // 1 минут
            //     : 2 * 60 * 1000 //  2 минут
        }
        return options;
    }
    setAccessToken(res: Response, token: string) {
        res.cookie(
            this.ACCESS_COOKIE_NAME,
            token,
            this.getCookieOptions('access'),
        );
    }

    setRefreshToken(res: Response, token: string) {
        res.cookie(
            this.REFRESH_COOKIE_NAME,
            token,
            this.getCookieOptions('refresh'),
        );
    }

    clearAuthCookies(res: Response): void {
        const options = this.getCookieOptions(); // БЕЗ maxAge

        res.clearCookie(this.ACCESS_COOKIE_NAME, options);
        res.clearCookie(this.REFRESH_COOKIE_NAME, options);
    }

    getRefreshToken(req: Request): string | undefined {
        const value = req.cookies?.[this.REFRESH_COOKIE_NAME] as unknown;
        return typeof value === 'string' ? value : undefined;
    }

    getAccessToken(req: Request): string | undefined {
        const value = req.cookies?.[this.ACCESS_COOKIE_NAME] as unknown;
        return typeof value === 'string' ? value : undefined;
    }
}
