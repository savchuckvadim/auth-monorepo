import axios, { type InternalAxiosRequestConfig, Method } from 'axios';
import { dispatchAuthSessionExpired } from './auth-session-expired';

/**
 * Axios-клиент к NestJS-бэкенду. Живёт в monorepo-пакете, поэтому
 * `baseURL` и поведение при истёкшей сессии задаются приложением
 * снаружи через {@link configureBackApi} — пакет сам не знает про
 * Next.js / Expo / что бы то ни было ещё.
 *
 * Порядок резолва baseURL (первый непустой побеждает):
 *   1. значение, переданное в `configureBackApi({ baseURL })`;
 *   2. `process.env.NEXT_PUBLIC_API_URL` — удобный fallback для
 *      Next.js-фронта (Next заменяет `NEXT_PUBLIC_*` на строковый
 *      литерал при bundling, так что работает и в браузере, и в SSR);
 *   3. ошибка `back-api: baseURL is not configured` на первом запросе.
 *
 * Callback `onSessionExpired` по умолчанию диспатчит
 * `AUTH_SESSION_EXPIRED_EVENT` через {@link dispatchAuthSessionExpired}.
 * Приложение может передать свой, если хочет обойти DOM-события
 * (например, React Native).
 */

export interface BackApiConfig {
    /** Например, `http://localhost:7000` или `https://api.sociopath-network.ru` */
    baseURL: string;
    /**
     * Колбэк, когда refresh-токен оказался невалидным. Выполняется
     * на клиенте: обычно — сбросить Redux-стору и увести на `/auth/login`.
     * Если не передан — используется дефолтный
     * {@link dispatchAuthSessionExpired}.
     */
    onSessionExpired?: () => void;
}

let configuredBaseURL: string | undefined;
let sessionExpiredCallback: (() => void) | undefined;

function resolveBaseURL(): string {
    if (configuredBaseURL && configuredBaseURL.length > 0) {
        return configuredBaseURL;
    }
    // Safe-guard: не все сборщики умеют в `process.env`, но Next/Webpack/Vite
    // заменяют `NEXT_PUBLIC_*` на строковый литерал ещё на этапе bundling.
    const fromEnv =
        typeof process !== 'undefined' &&
        typeof process.env?.NEXT_PUBLIC_API_URL === 'string'
            ? process.env.NEXT_PUBLIC_API_URL
            : '';
    return fromEnv;
}

function notifySessionExpired(): void {
    if (sessionExpiredCallback) {
        try {
            sessionExpiredCallback();
        } catch (error) {
            // Callback не должен валить весь interceptor — логируем и падаем в fallback.
            // eslint-disable-next-line no-console
            console.warn('back-api: onSessionExpired callback threw', error);
            dispatchAuthSessionExpired();
        }
        return;
    }
    dispatchAuthSessionExpired();
}

/**
 * Конфигурация клиента. Вызывается один раз на старте приложения,
 * можно вызывать повторно — новые значения перезапишут старые
 * (например, если API-URL задаётся пользователем в настройках).
 */
export function configureBackApi(config: BackApiConfig): void {
    if (typeof config.baseURL === 'string' && config.baseURL.length > 0) {
        configuredBaseURL = config.baseURL;
        $api.defaults.baseURL = config.baseURL;
    }
    sessionExpiredCallback = config.onSessionExpired;
}

export interface IBackResponse<T> {
    resultCode: EResultCode; // 0 - успех, 1 - ошибка
    data?: T; // данные ответа (при успехе)
    message?: string; // сообщение ошибки (при ошибке)
    errors?: string[]; // ошибки (при ошибке)
}
export enum EResultCode {
    SUCCESS = 0,
    ERROR = 1,
}

const $api = axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true,
    headers: {},
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Late resolve: если configureBackApi пришёл после создания инстанса
    // или если значение пришло через NEXT_PUBLIC_API_URL после hot-reload,
    // подтянем актуальный baseURL на каждом запросе.
    const current = resolveBaseURL();
    if (current && !config.baseURL) {
        config.baseURL = current;
    }
    if (!current && !config.baseURL) {
        throw new Error(
            'back-api: baseURL is not configured. ' +
                'Call configureBackApi({ baseURL }) on app startup ' +
                'or set NEXT_PUBLIC_API_URL.',
        );
    }

    const method = (config.method ?? 'get').toLowerCase();
    const isFormDataPayload =
        typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        if (!isFormDataPayload && !config.headers.get('Content-Type')) {
            config.headers.set('Content-Type', 'application/json');
        }
    }
    config.headers.set('Cache-Control', 'no-cache');
    config.headers.set('Pragma', 'no-cache');
    return config;
});

function isRefreshRequestUrl(configUrl: string, responseUrl: string): boolean {
    const u = `${responseUrl} ${configUrl}`;
    return u.includes('auth/refresh');
}

$api.interceptors.response.use(
    response => response,
    async error => {
        const status = error.response?.status;
        const responseURL = String(error.response?.request?.responseURL ?? '');
        const configUrl = String(error.config?.url ?? '');
        const refreshCall = isRefreshRequestUrl(configUrl, responseURL);

        if (status === 401 && refreshCall) {
            notifySessionExpired();
            return Promise.reject(error);
        }

        if (status === 401 && error.config && !refreshCall) {
            const originalRequest = error.config as typeof error.config & {
                _retry?: boolean;
            };
            if (originalRequest._retry) {
                notifySessionExpired();
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            try {
                const res = await $api.post('/api/auth/refresh');
                if (res.data.resultCode === EResultCode.SUCCESS) {
                    return $api(originalRequest);
                }
                notifySessionExpired();
            } catch {
                notifySessionExpired();
            }
        }
        return Promise.reject(error);
    },
);

export const customAxios = async <T>({
    url,
    method,
    data,
    params,
    headers: reqHeaders,
}: {
    url: string;
    method: Method;
    data?: any;
    params?: any;
    headers?: any;
}): Promise<T> => {
    const res = await $api.request<IBackResponse<T>>({
        url,
        method: method as Method,
        data,
        params,
        headers: reqHeaders,
    });
    if (res.data.resultCode !== EResultCode.SUCCESS) {
        throw new Error(res.data.message || `Backend error ${url}`);
    }

    return res.data.data as T;
};
