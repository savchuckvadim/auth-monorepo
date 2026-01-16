import axios, { Method } from 'axios';

// URL бэкенда из переменной окружения
// Для Next.js используем NEXT_PUBLIC_ префикс (доступно в браузере)
// Next.js встраивает NEXT_PUBLIC_ переменные в код во время сборки как строковые литералы
// В браузере process.env.NEXT_PUBLIC_API_URL будет заменен на реальное значение во время сборки
// ХАРДКОД
// В браузере Next.js заменяет process.env.NEXT_PUBLIC_API_URL на строковое значение
// Если переменная не установлена, используется дефолт
const url = 'https://api.sociopath-network.ru';
// const url = 'http://localhost:3000';

const AUTH_TOKEN_NAME = 'accessToken';

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

const headers = {
    'content-type': 'application/json',
    'X-BACK-API-KEY': '',
};

const $api = axios.create({
    baseURL: url,
    withCredentials: true,
    headers: headers,
});

// ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА - логируем baseURL при создании инстанса
// // // 🔐 автоматически добавляем JWT
// $api.interceptors.request.use((config) => {
//     const token = localStorage.getItem(AUTH_TOKEN_NAME);
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });
$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    console.log(error.response.request.responseURL);
    const isRefresh = error.response.request.responseURL.includes('auth/refresh');

    if (error.response.status === 401 && error.config && !isRefresh) {

        const originalRequest = error.config;

        originalRequest._isRetry = true; // TODO: не работает как в видосе
        try {
            const res = await $api.post('/api/auth/refresh');
            if (res.data.resultCode === EResultCode.SUCCESS) {

                return $api(originalRequest);
            }

        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН');
        }

    }
    throw error;

});

export const customAxios = async<T>({
    url,
    method,
    data,
    params,
    headers,
}: {
    url: string;
    method: Method;
    data?: any;
    params?: any;
    headers?: any;
}): Promise<T> => {
    // // Orval всегда ждёт, что mutator возвращает **данные**, а не { resultCode, data }

    const res = await $api.request<IBackResponse<T>>({
        url,
        method: method as Method,
        data,
        params, // 🔹 вот здесь axios сам превращает объект в query string
        headers,
    });
    if (res.data.resultCode !== EResultCode.SUCCESS) {
        throw new Error(res.data.message || `Backend error ${url}`);
    }

    return res.data.data as T;
};
