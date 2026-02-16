import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum EnumPresenceStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
}

export interface IPresence {
    userId: string;
    status: EnumPresenceStatus;
    lastSeenAt: string; // Отформатированная строка типа "1 minute ago"
}

export interface IPresenceState {
    presence: Record<string, IPresence>; // Объект {userId: IPresence} для быстрого доступа и избежания race conditions
}
export const initialState: IPresenceState = {
    presence: {} as Record<string, IPresence>,
};

export const presenceSlice = createSlice({
    name: 'presence',
    initialState,
    reducers: {
        setPresence: (state, action: PayloadAction<Record<string, IPresence>>) => {
            console.log('setPresence (object)', Object.keys(action.payload).length, 'users');
            state.presence = action.payload;
        },
        // Обновление одного пользователя - использует актуальное состояние из reducer
        updatePresenceUser: (state, action: PayloadAction<{ userId: string; status: EnumPresenceStatus; lastSeenAt: string }>) => {
            const { userId, status, lastSeenAt } = action.payload;

            const newPresenceItem: IPresence = { userId, status, lastSeenAt };
            const wasExisting = !!state.presence[userId];

            // Обновляем или добавляем запись в объект
            state.presence[userId] = newPresenceItem;

            const totalUsers = Object.keys(state.presence).length;
            if (wasExisting) {
                console.log(`🟢 Presence updated in reducer: ${userId} -> ${status} (existing entry, total: ${totalUsers})`);
            } else {
                console.log(`🟢 Presence added in reducer: ${userId} -> ${status} (new entry, total: ${totalUsers})`);
            }

            console.log('📊 Presence state after update:', totalUsers, 'users');
        },
    },
});

export const { setPresence, updatePresenceUser } = presenceSlice.actions;
export const presenceReducer = presenceSlice.reducer;
