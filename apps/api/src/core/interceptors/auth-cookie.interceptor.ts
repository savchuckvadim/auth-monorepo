// src/core/interceptors/auth-cookie.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { CookieService } from '@/core/cookie/cookie.service';

/**
 * Interceptor for setting auth cookie
 * for example: login, activate, refresh token, etc.
 */
@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
    constructor(private cookieService: CookieService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<unknown>,
    ): Observable<unknown> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        return next.handle().pipe(
            tap(data => {
                const payload = data as {
                    tokens?: { accessToken?: string; refreshToken?: string };
                };

                if (payload.tokens?.accessToken) {
                    this.cookieService.setAccessToken(
                        res,
                        payload.tokens.accessToken,
                    );
                }

                if (payload.tokens?.refreshToken) {
                    this.cookieService.setRefreshToken(
                        res,
                        payload.tokens.refreshToken,
                    );
                }

                if (payload.tokens) {
                    delete payload.tokens;
                }
            }),
        );
    }
}
