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
    presence: IPresence[];
}
export const initialState: IPresenceState = {
    presence: [] as IPresence[],
};

export const presenceSlice = createSlice({
    name: 'presence',
    initialState,
    reducers: {
        setPresence: (state, action: PayloadAction<IPresence[]>) => {
            console.log('setPresence', action.payload);
            console.log('setPresence', state.presence);
            state.presence = action.payload;
        },
    },
});

export const { setPresence } = presenceSlice.actions;
export const presenceReducer = presenceSlice.reducer;
