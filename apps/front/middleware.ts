import { AUTH_ACCESS_TOKEN_NAME_PUBLIC, AUTH_REFRESH_TOKEN_NAME_PUBLIC } from '@workspace/nest-api';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const accessToken = await req.cookies.get(AUTH_ACCESS_TOKEN_NAME_PUBLIC);
    const refreshToken = await req.cookies.get(AUTH_REFRESH_TOKEN_NAME_PUBLIC);

    const hasToken = accessToken || refreshToken;
    const url = req.nextUrl;
    const isStartPage = url.pathname.startsWith('/start');
    if (isStartPage) {
        return NextResponse.next();
    }
    const isConfirmPage = url.pathname.startsWith('/auth/confirm');
    // Восстановление пароля — сценарий, в котором пользователь может быть как
    // неавторизован (типовой кейс), так и уже авторизован (открыл письмо в том
    // же браузере). В обоих случаях мы должны пропускать его на страницу, иначе
    // middleware перекинет на /network/me и сценарий сброса сломается.
    const isPasswordRecoveryPage =
        url.pathname.startsWith('/auth/forgot-password') ||
        url.pathname.startsWith('/auth/reset-password');
    const isAuthPage =
        url.pathname.startsWith('/auth') && !isConfirmPage && !isPasswordRecoveryPage;
    const isProtected = url.pathname.startsWith('/network');
    const isUndefinedPath =
        !isAuthPage && !isProtected && !isConfirmPage && !isPasswordRecoveryPage;

    if (isPasswordRecoveryPage) {
        return NextResponse.next();
    }

    // Если нет токена — редирект на логин
    if (!hasToken && (isProtected || isUndefinedPath)) {
        console.log('redirect to login');
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (hasToken && (isAuthPage || isUndefinedPath)) {
        console.log('redirect to profile');
        return NextResponse.redirect(new URL('/network/me', req.url));
    }
    if (!hasToken && isAuthPage || isConfirmPage) {

        return NextResponse.next();
    }
    // Если есть токен, пропускаем
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/network/:path*',
        '/auth/:path*',
        '/start/:path*',

    ],
};
