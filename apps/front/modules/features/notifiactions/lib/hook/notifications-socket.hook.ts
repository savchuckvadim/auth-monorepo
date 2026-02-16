'use client';
import { useEffect } from 'react';

import { EnumPostSocketEvent } from '@/modules/entities';
import { socketManager } from '@/modules/shared';
import { useAuth } from '@/modules/processes';
import { usePostNotification } from './post-notification.hook';

export const useNotificationsSocket = () => {
    const { currentUser } = useAuth();
    const { handlePostCreated } = usePostNotification();

    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const socket = socketManager.getSocket();

        // Удаляем старый обработчик перед добавлением нового
        socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
        socket.on(EnumPostSocketEvent.CREATED, handlePostCreated);

        // Cleanup: удаляем обработчик при размонтировании или изменении зависимостей
        return () => {
            socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
        };
    }, [currentUser?.id, handlePostCreated]);
};
