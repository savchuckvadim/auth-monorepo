
import { appActions } from "../slice/AppSlice";
import { AppDispatch, AppGetState } from "../store";

export const initializeApp = () => async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.app.isLoading) return;

    dispatch(appActions.isLoading({ status: true }));


};
