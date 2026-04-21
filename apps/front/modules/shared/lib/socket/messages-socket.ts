import type { Socket } from 'socket.io-client';
import { socketManager } from './web-socket-manager';

/** Default-namespace socket (same connection as posts/presence). */
export const connectMessagesSocket = (userId: string): Socket => {
    return socketManager.connect(userId);
};

export const disconnectMessagesSocket = (): void => {
    socketManager.disconnect();
};

export const getMessagesSocket = (): Socket | null => {
    return socketManager.getSocketSafe();
};
