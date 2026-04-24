/**
 * Клиентский зеркальный enum кодов ошибок аутентификации.
 * Значения должны совпадать с `EnumAuthErrorCode` в `apps/api/src/modules/token/token.type.ts`.
 * Используется для проверки `error.response.data.message` без завязки на свободный текст.
 */
export enum EnumAuthErrorCode {
    ACCESS_TOKEN_MISSING = 'ACCESS_TOKEN_MISSING',
    ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
    ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
    ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR',

    REFRESH_TOKEN_MISSING = 'REFRESH_TOKEN_MISSING',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
    REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
    REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR',

    TOKEN_USER_MISMATCH = 'TOKEN_USER_MISMATCH',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',

    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_ACTIVATED = 'USER_NOT_ACTIVATED',
    INVALID_PASSWORD = 'INVALID_PASSWORD',

    // Password reset / change
    PASSWORD_RESET_TOKEN_INVALID = 'PASSWORD_RESET_TOKEN_INVALID',
    PASSWORD_RESET_TOKEN_EXPIRED = 'PASSWORD_RESET_TOKEN_EXPIRED',
    PASSWORD_RESET_TOKEN_USED = 'PASSWORD_RESET_TOKEN_USED',
    PASSWORD_SAME_AS_OLD = 'PASSWORD_SAME_AS_OLD',

    // Sessions
    SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
}

const REFRESH_ERROR_CODES: ReadonlySet<string> = new Set([
    EnumAuthErrorCode.REFRESH_TOKEN_MISSING,
    EnumAuthErrorCode.REFRESH_TOKEN_EXPIRED,
    EnumAuthErrorCode.REFRESH_TOKEN_INVALID,
    EnumAuthErrorCode.REFRESH_TOKEN_NOT_FOUND,
    EnumAuthErrorCode.REFRESH_TOKEN_ERROR,
    EnumAuthErrorCode.TOKEN_USER_MISMATCH,
    EnumAuthErrorCode.TOKEN_NOT_FOUND,
]);

export function isRefreshAuthError(message: unknown): boolean {
    return typeof message === 'string' && REFRESH_ERROR_CODES.has(message);
}

export function isAuthError(message: unknown): boolean {
    return (
        typeof message === 'string' &&
        Object.values(EnumAuthErrorCode).includes(
            message as EnumAuthErrorCode,
        )
    );
}
