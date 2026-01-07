'use client';
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { formatRelativeDate } from "@/modules/shared";
import { useCallback } from "react";
import { EnumPresenceStatus, IPresence, setPresence } from "../../model/PresenceSlise";

export const usePresence = () => {
    const dispatch = useAppDispatch();
    const presence = useAppSelector((state) => state.presence);

    const getPresenceUser = useCallback((userId: string) => {
        return presence.presence[userId];
    }, [presence.presence]); // Зависимость от presence.presence


    const getIsUserOnline = useCallback((userId: string) => {
        return presence.presence[userId]?.status === EnumPresenceStatus.ONLINE ? true : false;
    }, [presence.presence]); // Зависимость от presence.presence

    const getPresenceUsers = useCallback((userId: string[]) => {
        return userId
            .map(id => presence.presence[id])
            .filter(Boolean); // Убираем undefined
    }, [presence.presence]);


    const handleOnPresenceChange = useCallback((userId: string, status: EnumPresenceStatus) => {
        console.log('🔵 handleOnPresenceChange', userId, status);
        // Форматируем дату сразу в строку для хранения в Redux
        const lastSeenAt = formatRelativeDate(new Date());
        const newPresenceItem: IPresence = { userId, status, lastSeenAt };
        const newPresenceObject = {
            ...presence.presence,
            [userId]: newPresenceItem
        };

        dispatch(setPresence(newPresenceObject));
    }, [presence.presence, dispatch]);


    return {
        presence,
        getPresenceUser,
        getIsUserOnline,
        getPresenceUsers,
        handleOnPresenceChange

    };
}
