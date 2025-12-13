import { PayloadAction, createSlice } from "@reduxjs/toolkit"





export type AppState = typeof initialState

const initialState = {

    initialized: false,
    isLoading: false,
    error: {
        status: false as boolean,
        message: '' as string
    },



}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        isLoading: (
            state: AppState,
            action: PayloadAction<
                {
                    status: boolean

                }
            >
        ) => {

            state.isLoading = action.payload.status;
        },
        initialized: (
            state: AppState,
            action: PayloadAction<{
                status: boolean
            }>
        ) => {
            state.initialized = action.payload.status;
        },
    },

});

export const appReducer = appSlice.reducer;

// Экспорт actions
export const appActions = appSlice.actions;
