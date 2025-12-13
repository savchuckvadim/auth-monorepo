import { AUTH_ACCESS_TOKEN_NAME_PUBLIC } from '@workspace/nest-api';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const cookie = await req.cookies.get(AUTH_ACCESS_TOKEN_NAME_PUBLIC);

    const token = cookie?.value;
    const url = req.nextUrl;
    const isAuthPage = url.pathname.startsWith('/auth');
    const isProtected = url.pathname.startsWith('/network');


    // Если нет токена — редирект на логин
    if (!token && isProtected) {

        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (token && isAuthPage) {

        return NextResponse.redirect(new URL('/network', req.url));
    }
    if (!token && isAuthPage) {

        return NextResponse.next();
    }
    // Если есть токен, пропускаем
    return NextResponse.next();
}

export const config = {
    matcher: [

        '/network/:path*',
        '/auth/:path*',

    ],
};
