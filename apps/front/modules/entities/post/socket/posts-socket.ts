import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectPostsSocket = (userId: string): Socket => {
    if (socket?.connected) {
        return socket;
    }
    socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sociopath-network.ru'}/posts`, {
        // socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/posts`, {
        query: {
            userId,
        },
        transports: ['websocket'],
        withCredentials: true,
    });

    socket.on('connect', () => {
        console.log('🔌 Posts WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('🔌 Posts WebSocket disconnected');
    });

    socket.on('connect_error', (error: any) => {
        console.error('❌ Posts WebSocket connection error:', error);
    });

    // Логируем все входящие события для отладки
    socket.onAny((eventName, ...args) => {
        console.log('📥 WebSocket event received:', eventName, args);
        debugger; // BREAKPOINT ЗДЕСЬ - поймает ЛЮБОЕ событие
    });

    return socket;
};

export const disconnectPostsSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getPostsSocket = (): Socket | null => {
    return socket;
};

