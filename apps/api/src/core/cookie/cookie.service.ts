// src/common/services/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CookieService {
    constructor(private configService: ConfigService) { }

    private readonly COOKIE_NAME = 'access_token';

    setAuthCookie(res: Response, token: string) {
        const isProd = this.configService.get('NODE_ENV') === 'production';
      

        res.cookie(this.COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: isProd ? 'none' : 'lax',          // КРОСС-ДОМЕН обязательно нужно 'none'
            domain: isProd ? '.april-app.ru' : 'localhost',   // общий домен для subdomain → MUST HAVE
            path: '/',                 // важно
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    clearAuthCookie(res: Response) {
        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.clearCookie(this.COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: isProd ? 'none' : 'lax',          // КРОСС-ДОМЕН обязательно нужно 'none'
            domain:  isProd ?  '.april-app.ru' : 'localhost',   // общий домен для subdomain → MUST HAVE
            path: '/',                 // важно

        });
    }
}
