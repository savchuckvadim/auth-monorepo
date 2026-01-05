import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { PostCreatedEvent, PostDeletedEvent, PostLikedEvent, PostUpdatedEvent } from '../events/post.events';
import { PostEvent } from '../type/post-event.type';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    },
})
export class PostGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Храним подписчиков на feed
    private feedSubscribers = new Set<string>(); // socket.id

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;


        // Добавляем пользователя в его персональную комнату
        if (userId) {
            client.join(`user:${userId}`);
        }

        // По умолчанию добавляем в feed (можно сделать через отдельное сообщение)
        this.feedSubscribers.add(client.id);
        client.join('feed:subscribers');
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;
        // console.log(`🔌 Posts WebSocket: User ${userId} disconnected (socket: ${client.id})`);

        this.feedSubscribers.delete(client.id);
    }

    @OnEvent(PostEvent.CREATED)
    handlePostCreated(event: PostCreatedEvent) {

        // Отправляем всем подписчикам feed
        // Используем формат с двоеточием для WebSocket событий
        this.server.to('feed:subscribers').emit(
            'post:created',
            event.post
        );

        // Также отправляем автору поста (если он онлайн)
        this.server.to(`user:${event.post.userId}`).emit(
            'post:created',
            event.post
        );
    }

    @OnEvent(PostEvent.UPDATED)
    handlePostUpdated(event: PostUpdatedEvent) {

        // Отправляем всем подписчикам feed
        this.server.to('feed:subscribers').emit(
            'post:updated',
            event.post
        );

        // Отправляем автору
        this.server.to(`user:${event.post.userId}`).emit(
            'post:updated',
            event.post
        );
    }

    @OnEvent(PostEvent.DELETED)
    handlePostDeleted(event: PostDeletedEvent) {

        // Отправляем всем подписчикам feed
        this.server.to('feed:subscribers').emit(
            'post:deleted',
            { postId: event.postId }
        );
    }

    @OnEvent(PostEvent.LIKED)
    handlePostLiked(event: PostLikedEvent) {

        // Отправляем всем подписчикам feed
        this.server.to('feed:subscribers').emit(
            'post:liked',
            {
                postId: event.postId,
                userId: event.userId,
                isLike: event.isLike,
            }
        );
    }
}

