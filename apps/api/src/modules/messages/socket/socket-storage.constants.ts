/** TTL (seconds) for socket ↔ user mappings in Redis. */
export const SOCKET_USER_MAPPING_TTL_SEC = 3600;

export function redisSocketUserKey(socketId: string): string {
    return `socket:${socketId}`;
}

export function redisUserSocketsKey(userId: string): string {
    return `user:sockets:${userId}`;
}
