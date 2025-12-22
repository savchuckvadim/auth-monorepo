// src/common/services/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CookieService {
    constructor(private configService: ConfigService) { }

    private readonly REFRESH_COOKIE_NAME = 'refreshToken';
    private readonly ACCESS_COOKIE_NAME = 'accessToken';


    private isProd() {
        return this.configService.get('NODE_ENV') === 'production';
    }
    private getCookieOptions(maxAge?: 'access' | 'refresh'): CookieOptions {
        const domain = this.configService.get('CLIENT_URL');
        const isProd = this.isProd();
        console.log('isProd', isProd);
        console.log('domain', domain);
        const options: CookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            domain: isProd ? domain : 'localhost',
            path: '/'


        };
        if (maxAge) {
            options.maxAge = maxAge === 'access'
                ? 15 * 60 * 1000  // 15 минут
                : 30 * 24 * 60 * 60 * 1000 // 30 дней

            //for test
            // options.maxAge = maxAge === 'access'
            //     ? 1 * 60 * 1000  // 1 минут
            //     : 2 * 60 * 1000 //  2 минут
        }
        return options;
    }
    setAccessToken(res: Response, token: string) {
        res.cookie(this.ACCESS_COOKIE_NAME, token, this.getCookieOptions('access'));
    }

    setRefreshToken(res: Response, token: string) {
        res.cookie(this.REFRESH_COOKIE_NAME, token, this.getCookieOptions('refresh'));
    }

    clearAuthCookies(res: Response) {

        //для clear не передавать maxAge
        res.clearCookie(this.ACCESS_COOKIE_NAME);
        res.clearCookie(this.REFRESH_COOKIE_NAME);
    }

    getRefreshToken(req: Request) {
        return req.cookies?.[this.REFRESH_COOKIE_NAME];
    }

    getAccessToken(req: Request) {
        return req.cookies?.[this.ACCESS_COOKIE_NAME];
    }

}
