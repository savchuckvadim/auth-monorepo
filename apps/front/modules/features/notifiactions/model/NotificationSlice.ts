import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumNotificationContentType, EnumNotificationType } from '../type/notification.consts';


export interface INotification {
    id: string;
    title: string;
    message: string;
    type: EnumNotificationType;
    contentType: EnumNotificationContentType;
    url?: string;
    createdAt: string;
}
export interface INotificationState {
    notifications: INotification[];
}

const initialState: INotificationState = {
    notifications: [],
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state: INotificationState, action: PayloadAction<INotification>) => {
            // Проверяем, нет ли уже уведомления с таким же id и type
            const exists = state.notifications.some(
                (notification) => notification.id === action.payload.id && notification.type === action.payload.type
            );
            if (!exists) {
                state.notifications.push(action.payload);
            }
        },
        removeNotification: (state: INotificationState, action: PayloadAction<{
            id: string;
            type: EnumNotificationType;
        }>) => {
            state.notifications = state.notifications.filter(
                (notification) => !(notification.id === action.payload.id && notification.type === action.payload.type)
            );
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
