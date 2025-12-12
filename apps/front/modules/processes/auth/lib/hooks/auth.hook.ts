import { loginThunk, registerThunk, logoutThunk } from '../../model/AuthThunk';

import { useAppDispatch, useAppSelector } from '@/modules/app';
import { ILoginForm, IRegisterForm } from '../../type/auth.type';
import { authActions } from '../../model/AuthSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const login = (form: ILoginForm) => dispatch(loginThunk(form));
    const register = (form: IRegisterForm) => dispatch(registerThunk(form));

    const logout = () => dispatch(logoutThunk());
    const clearError = () => dispatch(authActions.clearError());

    return {
        ...auth,
        login,
        register,
        logoutThunk,
        logout,
        clearError,
    };
};
