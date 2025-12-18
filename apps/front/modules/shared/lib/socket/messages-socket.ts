import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectMessagesSocket = (userId: string): Socket => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/messages`, {
        query: {
            userId,
        },
        transports: ['websocket'],
        withCredentials: true, // Важно для отправки cookies (httpOnly cookies отправятся автоматически)
    });

    // Логирование событий для отладки
    socket.on('connect', () => {
        console.log('🔌 Messages WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('🔌 Messages WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Messages WebSocket connection error:', error);
    });

    return socket;
};

export const disconnectMessagesSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getMessagesSocket = (): Socket | null => {
    return socket;
};

