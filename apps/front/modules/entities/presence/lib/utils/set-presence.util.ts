import { AppDispatch } from "@/modules/app/model/store";
import { formatRelativeDate } from "@/modules/shared";
import { EnumPresenceStatus, updatePresenceUser } from "../../model/PresenceSlise";

export const handleOnPresenceChange = (
    userId: string,
    status: EnumPresenceStatus,
    dispatch: AppDispatch,
    timestamp?: Date // Опциональный timestamp для offline событий
) => {
    const now = timestamp || new Date();
    const lastSeenAt = formatRelativeDate(now);

    // Используем updatePresenceUser, который работает с актуальным состоянием в reducer
    // Это предотвращает race conditions при одновременных обновлениях
    dispatch(updatePresenceUser({ userId, status, lastSeenAt }));
}
