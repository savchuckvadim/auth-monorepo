import { Injectable } from '@nestjs/common';
import { RedisService } from '@/core/redis';

@Injectable()
export class SocketStorageService {
    private readonly redis: ReturnType<RedisService['getClient']>;
    private readonly SOCKET_TTL = 3600; // 1 час TTL для socket маппинга

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
    }

    /**
     * Сохраняет маппинг socketId -> userId
     */
    async setSocketUser(socketId: string, userId: string): Promise<void> {
        await this.redis.set(`socket:${socketId}`, userId, 'EX', this.SOCKET_TTL);
    }

    /**
     * Получает userId по socketId
     */
    async getSocketUser(socketId: string): Promise<string | null> {
        return this.redis.get(`socket:${socketId}`);
    }

    /**
     * Добавляет socketId в список сокетов пользователя
     */
    async addUserSocket(userId: string, socketId: string): Promise<void> {
        await this.redis.sadd(`user:sockets:${userId}`, socketId);
        // Устанавливаем TTL для set пользователя
        await this.redis.expire(`user:sockets:${userId}`, this.SOCKET_TTL);
    }

    /**
     * Удаляет socketId из списка сокетов пользователя
     */
    async removeUserSocket(userId: string, socketId: string): Promise<void> {
        await this.redis.srem(`user:sockets:${userId}`, socketId);
    }

    /**
     * Получает все socketId для пользователя
     */
    async getUserSockets(userId: string): Promise<string[]> {
        return this.redis.smembers(`user:sockets:${userId}`);
    }

    /**
     * Удаляет socket из всех маппингов
     */
    async removeSocket(socketId: string): Promise<string | null> {
        // Получаем userId перед удалением
        const userId = await this.getSocketUser(socketId);

        if (userId) {
            // Удаляем socketId из списка сокетов пользователя
            await this.removeUserSocket(userId, socketId);
        }

        // Удаляем маппинг socketId -> userId
        await this.redis.del(`socket:${socketId}`);

        return userId;
    }

    /**
     * Проверяет, существует ли socket
     */
    async socketExists(socketId: string): Promise<boolean> {
        const exists = await this.redis.exists(`socket:${socketId}`);
        return exists === 1;
    }
}

