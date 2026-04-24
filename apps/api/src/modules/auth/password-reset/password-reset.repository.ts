import { PasswordResetToken } from 'generated/prisma';

export interface SavePasswordResetTokenInput {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
}

export abstract class PasswordResetRepository {
    /**
     * Атомарно: удаляет все незавершённые токены пользователя и создаёт новый.
     * Нужно, чтобы у пользователя в любой момент был максимум один активный
     * reset-токен (нажал "забыл пароль" дважды — работает только последняя ссылка).
     */
    abstract createForUser(
        input: SavePasswordResetTokenInput,
    ): Promise<PasswordResetToken>;

    /** Поиск по хешу (который лежит в БД). Возвращает `null`, если не найден. */
    abstract findByTokenHash(
        tokenHash: string,
    ): Promise<PasswordResetToken | null>;

    /** Помечает токен потреблённым (устанавливает `consumedAt`). */
    abstract markConsumed(id: string): Promise<PasswordResetToken>;

    /** Удаляет все reset-токены пользователя (например, после успешного reset'a). */
    abstract deleteAllForUser(userId: string): Promise<number>;

    /** Чистит истёкшие и потреблённые токены. Используется cleanup-джобом. */
    abstract removeStaleTokens(batchSize?: number): Promise<number>;
}
