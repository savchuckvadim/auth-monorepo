import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/modules/app/model/store';
import { callActions, ICallError } from '../slice/CallSlice';

interface CallUserParams {
    chatId: string;
    otherUserId: string;
    type: 'VIDEO' | 'AUDIO';
    handleCallUser: (type: 'VIDEO' | 'AUDIO') => Promise<void>;
}

// Функция для проверки HTTPS
const checkHTTPS = (): { isValid: boolean; error: ICallError | null } => {
    if (typeof window === 'undefined') {
        return { isValid: false, error: { message: 'Недоступно на сервере', type: 'UNKNOWN' } };
    }

    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]';

    const isHTTPS = window.location.protocol === 'https:';

    if (!isHTTPS && !isLocalhost) {
        return {
            isValid: false,
            error: {
                message: 'Для видеозвонков требуется HTTPS соединение. Пожалуйста, используйте защищенное соединение.',
                type: 'HTTPS_REQUIRED',
            },
        };
    }

    return { isValid: true, error: null };
};

// Функция для проверки доступности getUserMedia
const checkGetUserMediaSupport = (): { isValid: boolean; error: ICallError | null } => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
            isValid: false,
            error: {
                message: 'Ваш браузер не поддерживает видеозвонки. Пожалуйста, используйте современный браузер.',
                type: 'UNKNOWN',
            },
        };
    }

    return { isValid: true, error: null };
};

// Функция для преобразования ошибки браузера в понятное сообщение
const getErrorMessage = (error: any): ICallError => {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return {
            message: 'Доступ к камере и микрофону отклонен. Пожалуйста, разрешите доступ в настройках браузера и попробуйте снова.',
            type: 'PERMISSION_DENIED',
        };
    }

    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return {
            message: 'Не найдено устройство (камера или микрофон). Убедитесь, что устройство подключено и не используется другим приложением.',
            type: 'DEVICE_NOT_FOUND',
        };
    }

    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return {
            message: 'Устройство уже используется другим приложением. Закройте другие приложения, использующие камеру или микрофон, и попробуйте снова.',
            type: 'DEVICE_IN_USE',
        };
    }

    if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        return {
            message: 'Требуемые настройки камеры или микрофона не поддерживаются вашим устройством.',
            type: 'UNKNOWN',
        };
    }

    return {
        message: error.message || 'Произошла ошибка при доступе к камере или микрофону. Попробуйте обновить страницу.',
        type: 'UNKNOWN',
    };
};

export const callUserThunk = createAsyncThunk<
    void,
    CallUserParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: ICallError }
>(
    'call/callUser',
    async (params, { dispatch, rejectWithValue }) => {
        const { handleCallUser, type } = params;

        try {
            // Устанавливаем состояние загрузки
            dispatch(callActions.setRequestingMedia(true));
            dispatch(callActions.clearError());

            // Проверка HTTPS
            const httpsCheck = checkHTTPS();
            if (!httpsCheck.isValid) {
                dispatch(callActions.setRequestingMedia(false));
                dispatch(callActions.setError(httpsCheck.error));
                return rejectWithValue(httpsCheck.error!);
            }

            // Проверка поддержки getUserMedia
            const supportCheck = checkGetUserMediaSupport();
            if (!supportCheck.isValid) {
                dispatch(callActions.setRequestingMedia(false));
                dispatch(callActions.setError(supportCheck.error));
                return rejectWithValue(supportCheck.error!);
            }

            // Выполняем вызов
            await handleCallUser(type);

            // Успешно завершено
            dispatch(callActions.setRequestingMedia(false));
        } catch (error: any) {
            const callError = getErrorMessage(error);

            dispatch(callActions.setRequestingMedia(false));
            dispatch(callActions.setError(callError));

            return rejectWithValue(callError);
        }
    }
);

