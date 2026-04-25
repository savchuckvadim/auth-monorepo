// src/common/services/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { parseDurationToMs } from '@/lib/utils/duration.util';
import {
    AUTH_DEFAULT_TTL,
    EnumAuthTtlEnv,
} from '@/lib/auth/auth-token-lifetime.config';

@Injectable()
export class CookieService {
    constructor(private configService: ConfigService) {}

    private readonly REFRESH_COOKIE_NAME = 'refreshToken';
    private readonly ACCESS_COOKIE_NAME = 'accessToken';

    private isProd(): boolean {
        return this.configService.get<string>('NODE_ENV') === 'production';
    }

    private getCookieMaxAgeMs(type: 'access' | 'refresh'): number {
        const tokenTtl =
            type === 'access'
                ? this.configService.get<string>(EnumAuthTtlEnv.ACCESS)
                : this.configService.get<string>(EnumAuthTtlEnv.REFRESH);
        const fallback = parseDurationToMs(
            type === 'access'
                ? AUTH_DEFAULT_TTL.ACCESS
                : AUTH_DEFAULT_TTL.REFRESH,
        );

        return parseDurationToMs(
            type === 'access'
                ? (this.configService.get<string>(
                      EnumAuthTtlEnv.ACCESS_COOKIE,
                  ) ?? tokenTtl)
                : (this.configService.get<string>(
                      EnumAuthTtlEnv.REFRESH_COOKIE,
                  ) ?? tokenTtl),
            fallback,
        );
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
            options.maxAge = this.getCookieMaxAgeMs(maxAge);
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
