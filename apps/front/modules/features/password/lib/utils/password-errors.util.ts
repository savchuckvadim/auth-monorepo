import { EnumAuthErrorCode } from '@workspace/nest-api';

/**
 * Выдирает из ошибки axios либо стандартный `EnumAuthErrorCode`,
 * либо fallback-строку. Чуть-чуть дублирует `getApiErrorMessage` из
 * auth-процесса, но нам важнее именно code, а не свободный message.
 */
export function getPasswordErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
        return 'Неизвестная ошибка';
    }

    const asAxios = error as {
        response?: { data?: { message?: string } };
        message?: string;
    };

    const message = asAxios.response?.data?.message ?? asAxios.message;
    switch (message) {
        case EnumAuthErrorCode.INVALID_PASSWORD:
            return 'Неверный текущий пароль';
        case EnumAuthErrorCode.USER_NOT_FOUND:
            return 'Пользователь не найден';
        case EnumAuthErrorCode.PASSWORD_RESET_TOKEN_INVALID:
            return 'Ссылка недействительна — запросите новое письмо';
        case EnumAuthErrorCode.PASSWORD_RESET_TOKEN_EXPIRED:
            return 'Срок действия ссылки истёк — запросите новое письмо';
        case EnumAuthErrorCode.PASSWORD_RESET_TOKEN_USED:
            return 'Ссылка уже была использована ранее';
        case EnumAuthErrorCode.PASSWORD_SAME_AS_OLD:
            return 'Новый пароль не должен совпадать со старым';
        case EnumAuthErrorCode.SESSION_NOT_FOUND:
            return 'Сессия не найдена или уже была завершена';
        default:
            return message ?? 'Что-то пошло не так, попробуйте ещё раз';
    }
}
