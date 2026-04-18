import axios, { type InternalAxiosRequestConfig, Method } from 'axios';
import { dispatchAuthSessionExpired } from './auth-session-expired';

// URL бэкенда из переменной окружения
// Для Next.js используем NEXT_PUBLIC_ префикс (доступно в браузере)
// Next.js встраивает NEXT_PUBLIC_ переменные в код во время сборки как строковые литералы
// В браузере process.env.NEXT_PUBLIC_API_URL будет заменен на реальное значение во время сборки
// ХАРДКОД
// В браузере Next.js заменяет process.env.NEXT_PUBLIC_API_URL на строковое значение
// Если переменная не установлена, используется дефолт
// const url = 'https://api.sociopath-network.ru';
const url = 'http://localhost:3000';

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
    baseURL: url,
    withCredentials: true,
    headers: {},
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        config.headers.set('Content-Type', 'application/json');
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
            dispatchAuthSessionExpired();
            return Promise.reject(error);
        }

        if (status === 401 && error.config && !refreshCall) {
            const originalRequest = error.config as typeof error.config & {
                _retry?: boolean;
            };
            if (originalRequest._retry) {
                dispatchAuthSessionExpired();
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            try {
                const res = await $api.post('/api/auth/refresh');
                if (res.data.resultCode === EResultCode.SUCCESS) {
                    return $api(originalRequest);
                }
                dispatchAuthSessionExpired();
            } catch {
                dispatchAuthSessionExpired();
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
