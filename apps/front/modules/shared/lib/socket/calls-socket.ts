// import { io, Socket } from 'socket.io-client';

// let callsSocket: Socket | null = null;

// /**
//  * Подключается к WebSocket namespace для звонков
//  * Используется только для сигналинга (инициация звонков)
//  */
// const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ||  'http://localhost:3000'; //'https://api.sociopath-network.ru' //  //
// export const connectCallsSocket = (userId: string): Socket => {
//     if (callsSocket?.connected) {
//         return callsSocket;
//     }
//     callsSocket = io(`${SOCKET_URL}/calls`, {
//         query: {
//             userId,
//         },
//         transports: ['websocket'],
//         withCredentials: true, // Для отправки cookies
//     });

//     // Логирование событий для отладки
//     callsSocket.on('connect', () => {
//         console.log('🔌 Calls WebSocket connected');
//     });

//     callsSocket.on('disconnect', () => {
//         console.log('🔌 Calls WebSocket disconnected');
//     });

//     callsSocket.on('connect_error', (error) => {
//         console.error('❌ Calls WebSocket connection error:', error);
//     });

//     return callsSocket;
// };

// export const disconnectCallsSocket = () => {
//     if (callsSocket) {
//         callsSocket.disconnect();
//         callsSocket = null;
//     }
// };

// export const getCallsSocket = (): Socket | null => {
//     return callsSocket;
// };

