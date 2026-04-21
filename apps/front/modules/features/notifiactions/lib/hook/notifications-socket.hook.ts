'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { EnumPostSocketEvent } from '@/modules/entities';
import { getNetworkChatPath } from '@/modules/entities/chats/lib/routes/network-chat.routes';
import { socketManager } from '@/modules/shared';
import { connectNotificationsSocket } from '@/modules/shared/lib/socket/notifications-socket';
import { useAuth } from '@/modules/processes';
import { useAppDispatch } from '@/modules/app';
import { usePostNotification } from './post-notification.hook';
import { addNotification } from '../../model/NotificationSlice';
import { EnumNotificationContentType, EnumNotificationType } from '../../type/notification.consts';
import type { NotificationNewMessagePayload } from '../../type/notifications-socket.types';

export const useNotificationsSocket = () => {
    const { currentUser } = useAuth();
    const { handlePostCreated } = usePostNotification();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        socketManager.connect(currentUser.id);
        const socket = socketManager.getSocket();
        socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
        socket.on(EnumPostSocketEvent.CREATED, handlePostCreated);

        const notifSocket = connectNotificationsSocket(currentUser.id);

        const handleNewMessage = (payload: NotificationNewMessagePayload) => {
            const msg = payload?.message;
            if (!msg?.chatId || !msg?.id) return;

            if (pathname === getNetworkChatPath(msg.chatId)) {
                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
                queryClient.invalidateQueries({
                    queryKey: ['messages', 'unread', 'total'],
                });
                return;
            }

            dispatch(
                addNotification({
                    id: msg.id,
                    title: msg.sender?.name
                        ? `Сообщение от ${msg.sender.name}`
                        : 'Новое сообщение',
                    message:
                        msg.content?.length > 120
                            ? `${msg.content.slice(0, 117)}…`
                            : msg.content,
                    type: EnumNotificationType.MESSAGE,
                    contentType: EnumNotificationContentType.MESSAGE,
                    url: getNetworkChatPath(msg.chatId),
                    createdAt: new Date().toISOString(),
                }),
            );
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            queryClient.invalidateQueries({
                queryKey: ['messages', 'unread', 'total'],
            });
        };

        notifSocket.on('notification:new-message', handleNewMessage);

        return () => {
            socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
            notifSocket.off('notification:new-message', handleNewMessage);
        };
    }, [currentUser?.id, handlePostCreated, dispatch, pathname, queryClient]);
};
