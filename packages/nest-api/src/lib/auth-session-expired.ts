/**
 * Browser-only bridge: axios-интерсептор не может импортировать Redux/Router
 * напрямую. Когда `/api/auth/refresh` падает с 401, бэк уже очистил httpOnly-
 * cookies; мы диспатчим кастомное событие, чтобы приложение:
 *   1. сбросило клиентский auth-state (store, сокеты);
 *   2. увело пользователя на `/auth/login`.
 *
 * Слушатель живёт в `apps/front/modules/processes/auth/ui/AuthSessionListener`.
 *
 * Диспатч — только в браузере (SSR в Next.js не должен падать из-за
 * отсутствия `window`). На React Native — приложение передаёт свой
 * callback через `configureBackApi({ onSessionExpired })`, и до этой
 * функции управление не доходит.
 */
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

export function dispatchAuthSessionExpired(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}
