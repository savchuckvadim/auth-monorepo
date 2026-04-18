import { Injectable } from '@nestjs/common';
import { RedisService } from '@/core/redis';
import {
    redisSocketUserKey,
    redisUserSocketsKey,
    SOCKET_USER_MAPPING_TTL_SEC,
} from './socket-storage.constants';

@Injectable()
export class SocketStorageService {
    private readonly redis: ReturnType<RedisService['getClient']>;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
    }

    async setSocketUser(socketId: string, userId: string): Promise<void> {
        await this.redis.set(
            redisSocketUserKey(socketId),
            userId,
            'EX',
            SOCKET_USER_MAPPING_TTL_SEC,
        );
    }

    async getSocketUser(socketId: string): Promise<string | null> {
        return this.redis.get(redisSocketUserKey(socketId));
    }

    async addUserSocket(userId: string, socketId: string): Promise<void> {
        await this.redis.sadd(redisUserSocketsKey(userId), socketId);
        await this.redis.expire(
            redisUserSocketsKey(userId),
            SOCKET_USER_MAPPING_TTL_SEC,
        );
    }

    async removeUserSocket(userId: string, socketId: string): Promise<void> {
        await this.redis.srem(redisUserSocketsKey(userId), socketId);
    }

    async getUserSockets(userId: string): Promise<string[]> {
        return this.redis.smembers(redisUserSocketsKey(userId));
    }

    async removeSocket(socketId: string): Promise<string | null> {
        const userId = await this.getSocketUser(socketId);

        if (userId) {
            await this.removeUserSocket(userId, socketId);
        }

        await this.redis.del(redisSocketUserKey(socketId));

        return userId;
    }

    async socketExists(socketId: string): Promise<boolean> {
        const exists = await this.redis.exists(redisSocketUserKey(socketId));
        return exists === 1;
    }
}
