import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICallError {
    message: string;
    type: 'PERMISSION_DENIED' | 'DEVICE_NOT_FOUND' | 'DEVICE_IN_USE' | 'HTTPS_REQUIRED' | 'UNKNOWN';
}

export interface ICallState {
    isRequestingMedia: boolean;
    error: ICallError | null;
}

const initialState: ICallState = {
    isRequestingMedia: false,
    error: null,
};

export const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setRequestingMedia: (state, action: PayloadAction<boolean>) => {
            state.isRequestingMedia = action.payload;
        },
        setError: (state, action: PayloadAction<ICallError | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const callActions = callSlice.actions;
export const callReducer = callSlice.reducer;

