import { Token } from 'generated/prisma';

export interface SaveTokenInput {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    deviceId?: string;
    userAgent?: string;
    ipAddress?: string;
}

export abstract class TokenRepository {
    abstract saveToken(input: SaveTokenInput): Promise<Token>;
    abstract findTokenByRefreshToken(
        refreshToken: string,
    ): Promise<Token | null>;
    abstract findTokensByUserId(userId: string): Promise<Token[]>;
    /** Idempotent: returns `null` if token was not found, otherwise returns the deleted row. */
    abstract removeToken(refreshToken: string): Promise<Token | null>;
    /**
     * Атомарно "заявляет" refresh-токен на ротацию: пытается удалить запись и
     * возвращает `true` только тому вызову, чей DELETE зацепил строку (count === 1).
     * Все последующие конкурентные вызовы получат `false`.
     */
    abstract claimRefreshToken(refreshToken: string): Promise<boolean>;
    abstract removeAllUserTokens(userId: string): Promise<number>;
    /**
     * Удаляет конкретную сессию пользователя. Проверка `userId` в `where`
     * защищает от атак, где аутентифицированный пользователь подставляет
     * id чужой сессии. Идемпотентно: возвращает `null`, если запись уже не найдена.
     */
    abstract removeTokenByIdForUser(
        id: string,
        userId: string,
    ): Promise<Token | null>;
    /**
     * Удаляет все сессии пользователя кроме одной (по refreshToken). Используется
     * для "logout everywhere, кроме текущего устройства" и при смене пароля.
     */
    abstract removeAllUserTokensExceptRefreshToken(
        userId: string,
        exceptRefreshToken: string | null | undefined,
    ): Promise<number>;
    /** Удаляет истёкшие токены пачками, чтобы не держать длинные транзакции. */
    abstract removeExpiredTokens(batchSize?: number): Promise<number>;
}
