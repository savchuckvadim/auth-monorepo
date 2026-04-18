'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/modules/app';
import { socketManager } from '@/modules/shared';
import { AUTH_SESSION_EXPIRED_EVENT } from '@workspace/nest-api';
import { authActions } from '../../model/AuthSlice';

const LOGIN_PATH = '/auth/login';

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
            if (
                typeof window !== 'undefined' &&
                !window.location.pathname.startsWith(LOGIN_PATH)
            ) {
                window.location.replace(LOGIN_PATH);
            }
        };

        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
        return () => {
            window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
        };
    }, [dispatch]);

    return null;
}
