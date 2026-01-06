import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sociopath-network.ru' // 'http://localhost:3000';
export const connectNotificationsSocket = (userId: string): Socket => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(`${SOCKET_URL}/notifications`, {
        // socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sociopath-network.ru'}/notifications`, {
        query: {
            userId,
        },
        transports: ['websocket'],
        withCredentials: true, // Важно для отправки cookies (httpOnly cookies отправятся автоматически)
    });

    // Логирование событий для отладки
    socket.on('connect', () => {
        console.log('🔌 Notifications WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('🔌 Notifications WebSocket disconnected');
    });

    socket.on('connect_error', (error: any) => {
        console.error('❌ Notifications WebSocket connection error:', error);
    });

    return socket;
};

export const disconnectNotificationsSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getNotificationsSocket = (): Socket | null => {
    return socket;
};

