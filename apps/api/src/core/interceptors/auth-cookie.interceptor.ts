// src/core/interceptors/auth-cookie.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { CookieService } from '@/core/cookie/cookie.service';


/**
 * Interceptor for setting auth cookie
 * for example: login, activate, refresh token, etc.
 */
@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
    constructor(private cookieService: CookieService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        return next.handle().pipe(
            tap((data) => {

                if (data?.tokens?.accessToken) {
                    this.cookieService.setAccessToken(
                        res,
                        data.tokens.accessToken,
                    );
                }

                if (data?.tokens?.refreshToken) {
                    this.cookieService.setRefreshToken(
                        res,
                        data.tokens.refreshToken,
                    );
                }

                if (data?.tokens) {
                    delete data.tokens;
                }
            }),
        );
    }
}
