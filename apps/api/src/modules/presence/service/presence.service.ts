import { RedisService } from "@/core/redis";
import { Global, Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Global()
@Injectable()
export class PresenceService implements OnModuleInit {
    private readonly redis: Redis;
    private readonly TTL = 60; // 60 секунд
    private expiredCallback?: (userId: string) => void;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
    }

    async onModuleInit() {
        // Настраиваем подписку на события истечения ключей
        // Redis будет отправлять уведомления когда ключ истечет
        // 'Ex' означает события истечения ключей (expired events)
        try {
            await this.redis.config('SET', 'notify-keyspace-events', 'Ex');
        } catch (error) {
            console.warn('Failed to set Redis keyspace events config:', error);
            // Продолжаем работу, возможно конфигурация уже установлена
        }

        // Подписываемся на события истечения ключей
        // Используем отдельное подключение для подписки (best practice)
        const expiredSubscriber = this.redis.duplicate();
        await expiredSubscriber.psubscribe('__keyevent@0__:expired');

        expiredSubscriber.on('pmessage', (pattern, channel, key) => {
            // Обрабатываем только ключи presence, игнорируем остальные
            if (key.startsWith('presence:user:')) {
                const userId = key.replace('presence:user:', '');
                console.log(`🔴 Presence expired for user: ${userId}`);
                if (this.expiredCallback) {
                    this.expiredCallback(userId);
                }
            }
            // Игнорируем все остальные expired ключи (bull, другие сервисы и т.д.)
        });

        expiredSubscriber.on('error', (error) => {
            console.error('❌ Redis expired subscriber error:', error);
        });
    }

    setExpiredCallback(callback: (userId: string) => void) {
        this.expiredCallback = callback;
    }

    private key(userId: string): string {
        return `presence:user:${userId}`;
    }

    /**
     * Помечает пользователя как онлайн
     * @returns true если пользователь стал онлайн (был offline), false если уже был online
     */
    async markOnline(userId: string): Promise<boolean> {
        const result = await this.redis.set(
            this.key(userId),
            '1', // Просто маркер, не timestamp
            'EX',
            this.TTL,
            'NX', // Только если ключа нет
        );

        return result === 'OK'; // был offline → стал online
    }

    /**
     * Обновляет TTL для пользователя (продлевает время онлайн)
     */
    async refresh(userId: string): Promise<void> {
        // Используем SET с EX для обновления и значения, и TTL
        // Это гарантирует, что ключ точно обновится
        await this.redis.set(this.key(userId), '1', 'EX', this.TTL);
    }

    /**
     * Помечает пользователя как оффлайн
     * @returns true если пользователь был online, false если уже был offline
     */
    async markOffline(userId: string): Promise<boolean> {
        return (await this.redis.del(this.key(userId))) === 1;
    }

    /**
     * Проверяет, онлайн ли пользователь
     */
    async isOnline(userId: string): Promise<boolean> {
        return (await this.redis.exists(this.key(userId))) === 1;
    }

    /**
     * Получает список онлайн пользователей из массива userIds
     */
    async getOnlineUsers(userIds: string[]): Promise<Set<string>> {
        if (userIds.length === 0) {
            return new Set();
        }

        const pipeline = this.redis.pipeline();
        userIds.forEach(id => pipeline.exists(this.key(id)));
        const result = await pipeline.exec();

        return new Set(
            userIds.filter((_, i) => result?.[i]?.[1] === 1),
        );
    }
}
