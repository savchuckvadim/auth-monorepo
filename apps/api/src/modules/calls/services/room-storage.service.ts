import { Injectable } from '@nestjs/common';

/**
 * Сервис для отслеживания онлайн пользователей через WebSocket
 * Хранит маппинг userId <-> socketId для пользователей, подключенных к WebSocket
 */
@Injectable()
export class OnlineUsersService {
    private readonly userIdToSocket = new Map<string, string>();
    private readonly socketToUserId = new Map<string, string>();

    setUser(userId: string, socketId: string): void {
        this.userIdToSocket.set(userId, socketId);
        this.socketToUserId.set(socketId, userId);
    }

    getSocketIdByUserId(userId: string): string | undefined {
        return this.userIdToSocket.get(userId);
    }

    getUserIdBySocketId(socketId: string): string | undefined {
        return this.socketToUserId.get(socketId);
    }

    removeUser(socketId: string): void {
        const userId = this.socketToUserId.get(socketId);
        if (userId) {
            this.userIdToSocket.delete(userId);
            this.socketToUserId.delete(socketId);
        }
    }

    hasUser(socketId: string): boolean {
        return this.socketToUserId.has(socketId);
    }
}

