
import { checkAuthThunk } from "@/modules/processes/auth/model/AuthThunk";
import { appActions } from "../slice/AppSlice";
import { AppDispatch, AppGetState } from "../store";
import { AUTH_ACCESS_TOKEN_NAME_PUBLIC } from "@workspace/nest-api";

export const initializeApp = () => async (dispatch: AppDispatch, getState: AppGetState) => {
    debugger
    const state = getState();
    if (state.app.isLoading) return;
    dispatch(appActions.isLoading({ status: true }));
    const checkAuth = () => dispatch(checkAuthThunk());
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_NAME_PUBLIC);
    debugger
    if (accessToken) {
        checkAuth();
    }
    dispatch(appActions.initialized({ status: true }));

    dispatch(appActions.isLoading({ status: false }));


};
