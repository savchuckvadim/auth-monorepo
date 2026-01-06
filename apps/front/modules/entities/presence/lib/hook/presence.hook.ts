'use client';
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { formatRelativeDate } from "@/modules/shared";
import { useCallback } from "react";
import { EnumPresenceStatus, IPresence, setPresence } from "../../model/PresenceSlise";

export const usePresence = () => {
    const dispatch = useAppDispatch();
    const presence = useAppSelector((state) => state.presence);

    const getPresenceUser = useCallback((userId: string) => {
        return presence.presence.find((presenceInfo) => presenceInfo.userId === userId);
    }, [presence.presence]); // Зависимость от presence.presence


    const getIsUserOnline = useCallback((userId: string) => {
        return getPresenceUser(userId)?.status === EnumPresenceStatus.ONLINE ? true : false;
    }, [getPresenceUser, presence.presence]); // Зависимость от presence.presence

    const getPresenceUsers = useCallback((userId: string[]) => {
        return presence.presence.filter((presenceInfo) => userId.includes(presenceInfo.userId));
    }, []);


    const handleOnPresenceChange = useCallback((userId: string, status: EnumPresenceStatus) => {

        // Форматируем дату сразу в строку для хранения в Redux
        const lastSeenAt = formatRelativeDate(new Date());
        const newPresenceItem: IPresence = { userId, status, lastSeenAt };
        const newPresenceList: IPresence[] = presence.presence.find((presenceInfo) => presenceInfo.userId === userId)
            ? presence.presence.map((presenceInfo) => presenceInfo.userId === userId ? newPresenceItem : presenceInfo)
            : [...presence.presence, newPresenceItem];

        dispatch(setPresence(newPresenceList));
    }, [presence.presence, dispatch]);


    return {
        presence,
        getPresenceUser,
        getIsUserOnline,
        getPresenceUsers,
        handleOnPresenceChange

    };
}
