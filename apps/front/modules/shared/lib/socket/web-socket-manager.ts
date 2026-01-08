// socket.manager.ts
import { io, Socket } from 'socket.io-client';
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sociopath-network.ru' // 'http://localhost:3000' // 'https://api.sociopath-network.ru' //
class SocketManager {
    private socket: Socket | null = null;
    private userId: string | null = null;

    public connect(userId: string): Socket {
        if (this.socket?.connected) return this.socket;

        this.userId = userId;

        this.socket = io(
            SOCKET_URL,
            {
                transports: ['websocket'],
                withCredentials: true,
                query: { userId },
            }
        );

        this.socket.on('connect', () => {
            console.log('🔌 Socket connected', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
        });

        this.socket.on('connect_error', (e) => {
            console.error('❌ Socket error', e);
        });

        return this.socket;
    }

    public disconnect() {
        this.socket?.disconnect();
        this.socket = null;
        this.userId = null;
    }

    public getSocket(): Socket {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect(userId) first.');
        }
        return this.socket;
    }

    public getSocketSafe(): Socket | null {
        return this.socket || null;
    }

    public isConnected(): boolean {
        return !!this.socket?.connected;
    }
}

export const socketManager = new SocketManager();
