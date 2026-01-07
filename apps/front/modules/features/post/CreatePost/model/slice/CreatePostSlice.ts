import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICreatePostState {
    isMediaChoiceModalOpen: boolean;
}

const initialState: ICreatePostState = {
    isMediaChoiceModalOpen: false,
};

export const createPostSlice = createSlice({
    name: 'createPost',
    initialState,
    reducers: {
        openMediaChoiceModal: (state) => {
            state.isMediaChoiceModalOpen = true;
        },
        closeMediaChoiceModal: (state) => {
            state.isMediaChoiceModalOpen = false;
        },
    },
});

export const createPostActions = createPostSlice.actions;
export const createPostReducer = createPostSlice.reducer;

