import { getAuth, type SessionDto, type SessionsBulkResultDto } from '@workspace/nest-api';

/**
 * Web-адаптер над сгенерированным Orval-клиентом `getAuth()` для раздела
 * «Активные сессии» в настройках. Инкапсулирует `getAuth()` — все хуки
 * работают только через этот сервис, а не дергают Orval напрямую.
 */
export class SessionsService {
    private api = getAuth();

    async listSessions(): Promise<SessionDto[]> {
        return this.api.authListSessions();
    }

    async revokeSession(sessionId: string): Promise<SessionsBulkResultDto> {
        return this.api.authRevokeSession(sessionId);
    }

    async revokeAllSessions(): Promise<SessionsBulkResultDto> {
        return this.api.authRevokeAllSessions();
    }
}
