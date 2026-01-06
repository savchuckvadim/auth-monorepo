import { AppDispatch } from "@/modules/app/model/store";
import { formatRelativeDate } from "@/modules/shared";
import { EnumPresenceStatus, IPresence, setPresence } from "../../model/PresenceSlise";

export const handleOnPresenceChange = (
    userId: string,
    status: EnumPresenceStatus,
    dispatch: AppDispatch,
    currentPresence: IPresence[], // Получаем текущее состояние из компонента
    timestamp?: Date // Опциональный timestamp для offline событий
) => {
    const now = timestamp || new Date();
    const lastSeenAt = formatRelativeDate(now);
    const newPresenceItem: IPresence = { userId, status, lastSeenAt };

    // Находим существующую запись
    const existingIndex = currentPresence.findIndex((presenceInfo) => presenceInfo.userId === userId);

    let newPresenceList: IPresence[];
    if (existingIndex !== -1) {
        // Обновляем существующую запись
        newPresenceList = [...currentPresence];
        newPresenceList[existingIndex] = newPresenceItem;
    } else {
        // Добавляем новую запись
        newPresenceList = [...currentPresence, newPresenceItem];
    }

    // Передаем готовый массив (сериализуемое значение)
    dispatch(setPresence(newPresenceList));
}
