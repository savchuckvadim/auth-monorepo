import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenService } from '@/modules/token';
import { EnumAuthErrorCode } from '@/modules/token/token.type';
import { SessionDto, SessionsBulkResultDto } from '../dtos/session.dto';

/**
 * Дефолтный deviceId, который проставляется утилитой `resolveDeviceIdFromHeaders`,
 * когда клиент не прислал `x-device-id`. Такие сессии считаются "неопознанными"
 * (несколько разных устройств могут иметь одинаковое значение), поэтому по
 * нему **нельзя** матчить текущую сессию — иначе все web-сессии взаимно
 * помечались бы как `isCurrent = true`.
 */
const UNKNOWN_DEVICE_ID = 'web';

/**
 * Входные данные для распознавания "текущей" сессии. Web передаёт refreshToken
 * (он есть в cookie у сервера); mobile не хранит refreshToken, но шлёт стабильный
 * `x-device-id` при каждом запросе — по нему и определим.
 */
export interface SessionContext {
    refreshToken?: string | null;
    deviceId?: string | null;
}

@Injectable()
export class SessionsService {
    constructor(private readonly tokenService: TokenService) {}

    /**
     * Список активных (неистёкших) сессий пользователя, отсортированный от новых
     * к старым. Метка `isCurrent` — для UI, чтобы текущее устройство выделялось.
     */
    public async listSessions(
        userId: string,
        context: SessionContext,
    ): Promise<SessionDto[]> {
        const tokens = await this.tokenService.findTokensByUserId(userId);
        return tokens.map(token => ({
            id: token.id,
            deviceId: token.deviceId,
            userAgent: token.userAgent,
            ipAddress: token.ipAddress,
            createdAt: token.createdAt.toISOString(),
            updatedAt: token.updatedAt.toISOString(),
            expiresAt: token.expiresAt.toISOString(),
            isCurrent: this.isCurrent(token, context),
        }));
    }

    /**
     * Ревок одной сессии. Проверка `userId` на уровне репозитория гарантирует,
     * что пользователь не сможет удалить чужую сессию, даже подставив id.
     */
    public async revokeSession(
        userId: string,
        sessionId: string,
    ): Promise<SessionsBulkResultDto> {
        const removed = await this.tokenService.removeTokenByIdForUser(
            sessionId,
            userId,
        );
        if (!removed) {
            throw new NotFoundException(EnumAuthErrorCode.SESSION_NOT_FOUND);
        }
        return { revoked: 1 };
    }

    /**
     * Logout со всех устройств. Если передан `exceptRefreshToken` — оставляем
     * текущую сессию (полезно для кнопки "Выйти со всех устройств, кроме этого").
     */
    public async revokeAllSessions(
        userId: string,
        exceptRefreshToken?: string | null,
    ): Promise<SessionsBulkResultDto> {
        const revoked =
            await this.tokenService.removeAllUserTokensExceptRefreshToken(
                userId,
                exceptRefreshToken ?? null,
            );
        return { revoked };
    }

    /**
     * Определяем "текущую" сессию:
     *
     * 1. Web-кейс: у сервера есть refreshToken из httpOnly-cookie входящего
     *    запроса — это самый точный и стабильный матч (у каждой сессии свой
     *    ротируемый refreshToken). Если он передан в контекст — сверяем
     *    **только** его, вторую ветку не рассматриваем. Это исключает
     *    ситуацию, в которой у всех web-сессий совпадает дефолтный deviceId
     *    и они все оказываются `isCurrent = true`.
     *
     * 2. Mobile-кейс: refreshToken в cookie не живёт — клиент хранит его в
     *    SecureStore, но на сервере при запросе `/sessions` его нет. Зато
     *    мобилка обязана слать стабильный `x-device-id`. Тогда по нему и
     *    определяем текущую сессию. Дефолтное "web" значение игнорируем —
     *    оно говорит о том, что заголовок не пришёл и матчить по нему
     *    небезопасно.
     */
    private isCurrent(
        token: { refreshToken: string; deviceId: string | null },
        context: SessionContext,
    ): boolean {
        if (context.refreshToken) {
            return context.refreshToken === token.refreshToken;
        }

        const contextDeviceId = context.deviceId;
        if (
            contextDeviceId &&
            contextDeviceId !== UNKNOWN_DEVICE_ID &&
            token.deviceId &&
            token.deviceId === contextDeviceId
        ) {
            return true;
        }

        return false;
    }
}
