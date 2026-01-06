'use client';

import { useEffect } from "react";

import { useAuth } from "@/modules/processes";
import { socketManager } from "@/modules/shared";
import { EnumPresenceSocketEvent } from "../../type/presence.consts";
import { EnumPresenceStatus } from "../../model/PresenceSlise";
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { handleOnPresenceChange } from "../utils/set-presence.util";

export const usePresenceSocket = () => {
    const { currentUser } = useAuth();
    const dispatch = useAppDispatch();
    // Используем useAppSelector для получения актуального состояния и подписки на изменения
    const presence = useAppSelector((state) => state.presence.presence);

    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const socket = socketManager.getSocket();
        if (!socket) return;

        // Обработчик события online - принимает объект { userId }
        const handleOnline = (data: { userId: string }) => {
            console.log('🔵 Presence ONLINE event received:', data);
            if (data?.userId) {
                handleOnPresenceChange(
                    data.userId,
                    EnumPresenceStatus.ONLINE,
                    dispatch,
                    presence // Используем актуальное состояние из селектора
                );
            }
        };

        // Обработчик события offline - принимает объект { userId }
        const handleOffline = (data: { userId: string }) => {
            console.log('🔴 Presence OFFLINE event received:', data);
            if (data?.userId) {
                handleOnPresenceChange(
                    data.userId,
                    EnumPresenceStatus.OFFLINE,
                    dispatch,
                    presence, // Используем актуальное состояние из селектора
                    new Date() // Время когда пользователь ушел offline
                );
            }
        };

        // Удаляем старые обработчики перед добавлением новых
        socket.off(EnumPresenceSocketEvent.ONLINE, handleOnline);
        socket.off(EnumPresenceSocketEvent.OFFLINE, handleOffline);

        // Добавляем новые обработчики
        socket.on(EnumPresenceSocketEvent.ONLINE, handleOnline);
        socket.on(EnumPresenceSocketEvent.OFFLINE, handleOffline);

        // Отправляем ping каждые 25 секунд для продления TTL (TTL = 60 сек)
        const interval = setInterval(() => {
            socket.emit(EnumPresenceSocketEvent.PING);
        }, 25_000);

        // Cleanup
        return () => {
            socket.off(EnumPresenceSocketEvent.ONLINE, handleOnline);
            socket.off(EnumPresenceSocketEvent.OFFLINE, handleOffline);
            clearInterval(interval);
        };
    }, [currentUser?.id, dispatch, presence]); // presence в зависимостях - обработчики будут пересоздаваться при изменении
}
