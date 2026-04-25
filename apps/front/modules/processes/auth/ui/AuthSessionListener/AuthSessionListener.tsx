'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/modules/app';
import { socketManager } from '@/modules/shared';
import { AUTH_SESSION_EXPIRED_EVENT } from '@workspace/nest-api';
import { authActions } from '../../model/AuthSlice';

const LOGIN_PATH = '/auth/login';

/**
 * Публичные маршруты, с которых нельзя редиректить на /auth/login
 * по событию `auth:session-expired`. На этих страницах refresh-запрос
 * при отсутствии валидной сессии — ожидаемый кейс (лендинг, страницы
 * входа/регистрации/сброса пароля), поэтому падающий 401 просто сбрасывает
 * redux-стейт и отсоединяет сокеты, но не уводит пользователя из flow.
 */
const PUBLIC_PATH_PREFIXES = [
    '/auth/login',
    '/auth/register',
    '/auth/confirm',
    '/auth/forgot-password',
    '/auth/reset-password',
];

function isPublicPath(pathname: string): boolean {
    if (pathname === '/') return true;
    return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Listens for failed refresh (see `packages/nest-api` axios interceptor): clears Redux session and redirects to login.
 */
export function AuthSessionListener() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const onExpired = () => {
            dispatch(authActions.resetSession());
            try {
                socketManager.disconnect();
            } catch {
                /* ignore */
            }
            if (typeof window === 'undefined') return;

            const pathname = window.location.pathname;
            if (isPublicPath(pathname)) return;
            if (pathname.startsWith(LOGIN_PATH)) return;

            window.location.replace(LOGIN_PATH);
        };

        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
        return () => {
            window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
        };
    }, [dispatch]);

    return null;
}
