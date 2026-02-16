import { AUTH_ACCESS_TOKEN_NAME_PUBLIC } from '@workspace/nest-api';

/**
 * Получает токен доступа из cookies
 */
export const getAccessToken = (): string | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    // Получаем все cookies
    const cookies = document.cookie.split(';');

    // Ищем токен
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === AUTH_ACCESS_TOKEN_NAME_PUBLIC && value) {
            return decodeURIComponent(value);
        }
    }

    return null;
};

