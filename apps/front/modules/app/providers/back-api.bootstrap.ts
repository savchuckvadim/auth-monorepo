import {
    AUTH_SESSION_EXPIRED_EVENT,
    configureBackApi,
} from '@workspace/nest-api';

/**
 * Однократная конфигурация axios-клиента из `@workspace/nest-api`.
 *
 * Пакет-библиотека умышленно не знает про Next.js, поэтому baseURL и
 * «что делать при истёкшей сессии» приложение передаёт снаружи.
 *
 *  • `baseURL` — из `NEXT_PUBLIC_API_URL` (задаётся в `.env` / Docker).
 *    Next.js заменяет `NEXT_PUBLIC_*` на строковый литерал при
 *    bundling — работает и на клиенте, и в SSR.
 *  • `onSessionExpired` — диспатчит DOM-событие, которое ловит
 *    `AuthSessionListener` в `AppProvider`. Он чистит Redux и делает
 *    `window.location.replace('/auth/login')`.
 *
 * Хотим модульный side-effect (а не вызов в `useEffect`), чтобы
 * baseURL оказался сконфигурирован до первого API-запроса, даже если
 * запрос делается в момент монтирования.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

if (!baseURL) {
    // В dev-режиме `next.config.ts` уже валидирует переменную и падает
    // на старте, но бэкап-лог не помешает: так сразу видно в консоли,
    // если кто-то забыл `.env`.
    // eslint-disable-next-line no-console
    console.error(
        'NEXT_PUBLIC_API_URL is missing. Back-api client будет падать на первом запросе.',
    );
}

configureBackApi({
    baseURL,
    onSessionExpired: () => {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
    },
});
