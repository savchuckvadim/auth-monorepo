'use client';

import { useEffect } from "react";

import { useAuth } from "@/modules/processes";
import { socketManager } from "@/modules/shared";
import { EnumPresenceSocketEvent } from "../../type/presence.consts";
import { EnumPresenceStatus } from "../../model/PresenceSlise";
import { useAppDispatch } from "@/modules/app";
import { handleOnPresenceChange } from "../utils/set-presence.util";

export const usePresenceSocket = () => {
    const { currentUser } = useAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const socket = socketManager.getSocket();
        if (!socket) return;

        // Обработчик события online - принимает объект { userId }
        const handleOnline = (data: { userId: string }) => {
            console.log('🔵 Presence ONLINE event received:', data);
            console.log('🔵 Current user ID:', currentUser?.id);
            if (data?.userId) {
                // Используем updatePresenceUser, который работает с актуальным состоянием в reducer
                handleOnPresenceChange(
                    data.userId,
                    EnumPresenceStatus.ONLINE,
                    dispatch
                );
            } else {
                console.warn('⚠️ Presence ONLINE event received without userId:', data);
            }
        };

        // Обработчик события offline - принимает объект { userId }
        const handleOffline = (data: { userId: string }) => {
            console.log('🔴 Presence OFFLINE event received:', data);
            if (data?.userId) {
                // Используем updatePresenceUser, который работает с актуальным состоянием в reducer
                handleOnPresenceChange(
                    data.userId,
                    EnumPresenceStatus.OFFLINE,
                    dispatch,
                    new Date() // Время когда пользователь ушел offline
                );
            } else {
                console.warn('⚠️ Presence OFFLINE event received without userId:', data);
            }
        };

        // Обработчик события bulk-online - получает список всех онлайн пользователей при подключении
        const handleBulkOnline = (data: { users: string[] }) => {
            console.log('📦 Presence BULK-ONLINE event received:', data.users?.length, 'users');
            if (data?.users && Array.isArray(data.users)) {
                // Добавляем всех пользователей из списка
                data.users.forEach(userId => {
                    if (userId) {
                        handleOnPresenceChange(
                            userId,
                            EnumPresenceStatus.ONLINE,
                            dispatch
                        );
                    }
                });
            }
        };

        // Удаляем старые обработчики перед добавлением новых
        socket.off(EnumPresenceSocketEvent.ONLINE, handleOnline);
        socket.off(EnumPresenceSocketEvent.OFFLINE, handleOffline);
        socket.off(EnumPresenceSocketEvent.BULK_ONLINE, handleBulkOnline);

        // Добавляем новые обработчики
        socket.on(EnumPresenceSocketEvent.ONLINE, handleOnline);
        socket.on(EnumPresenceSocketEvent.OFFLINE, handleOffline);
        socket.on(EnumPresenceSocketEvent.BULK_ONLINE, handleBulkOnline);

        console.log('✅ Presence socket handlers registered for user:', currentUser?.id);
        console.log('✅ Listening for events:', EnumPresenceSocketEvent.ONLINE, EnumPresenceSocketEvent.OFFLINE);

        // Обработчик для события connect - когда socket подключился
        const handleConnect = () => {
            console.log('🔌 Socket connected, adding current user to presence');
            if (currentUser?.id) {
                handleOnPresenceChange(
                    currentUser.id,
                    EnumPresenceStatus.ONLINE,
                    dispatch
                );
            }
        };

        // Если socket уже подключен, сразу добавляем пользователя
        if (socket.connected) {
            console.log('🔌 Socket already connected, adding current user immediately');
            if (currentUser?.id) {
                handleOnPresenceChange(
                    currentUser.id,
                    EnumPresenceStatus.ONLINE,
                    dispatch
                );
            }
        } else {
            // Если socket еще не подключен, ждем события connect
            socket.on('connect', handleConnect);
        }

        // Отправляем ping каждые 25 секунд для продления TTL (TTL = 60 сек)
        const interval = setInterval(() => {
            // console.log('🔵 Presence PING event sent');
            socket.emit(EnumPresenceSocketEvent.PING);
        }, 25_000); // Исправлено: было 2_000 (2 секунды), должно быть 25_000 (25 секунд)

        // Cleanup
        return () => {
            socket.off(EnumPresenceSocketEvent.ONLINE, handleOnline);
            socket.off(EnumPresenceSocketEvent.OFFLINE, handleOffline);
            socket.off(EnumPresenceSocketEvent.BULK_ONLINE, handleBulkOnline);
            socket.off('connect', handleConnect);
            clearInterval(interval);
        };
    }, [currentUser?.id, dispatch]); // Обработчики не пересоздаются при изменении presence - используется функциональное обновление в reducer
}
