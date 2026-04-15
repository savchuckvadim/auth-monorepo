import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class LiveKitCallsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor() {
        // private readonly onlineUsersService: OnlineUsersService,
    }

    async handleConnection(client: Socket) {
        // TODO: Получить userId из токена аутентификации
        // Пока используем query параметр для тестирования
        const userId = client.handshake.query.userId as string;

        console.log(`Socket Connected: ${client.id} (user: ${userId})`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket Disconnected: ${client.id}`);
    }

    @SubscribeMessage('call:request')
    async handleCallRequest(
        @MessageBody()
        data: {
            toUserId: string;
            roomName: string;
            fromUserId: string;
        },
    ) {
        // Просто уведомляем второго пользователя, что его зовут в LiveKit комнату

        console.log('handleCallRequest', data);
        this.server.to(`user:${data.toUserId}`).emit('call:incoming', {
            fromUserId: data.fromUserId,
            roomName: data.roomName,
            // тип звонка, имя звонящего и т.д.
        });
    }
}
