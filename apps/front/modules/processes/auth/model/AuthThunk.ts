import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../lib/api/AuthService";
import { IAuthState, ILoginForm, IRegisterForm } from "../type/auth.type";
import { EResultCode, UserDto } from "@workspace/nest-api";
import { getApiErrorMessage } from "../lib/utils/api-error.util";


export const loginThunk = createAsyncThunk<
    UserDto,
    ILoginForm>(
        'auth/login',
        async (form, { rejectWithValue }) => {
            try {
                const authService = new AuthService();
                const response = await authService.login(form.email, form.password);
                localStorage.setItem('accessToken', response.tokens.accessToken);
                return response.user;
            } catch (error) {
                return rejectWithValue(getApiErrorMessage(error));
            }
        });




export const registerThunk =
    createAsyncThunk<
        UserDto,
        IRegisterForm>('auth/registerClient', async (form, { rejectWithValue }) => {
            const authService = new AuthService();
            try {
                const response = await authService.registration(form);

                return response.user;
            } catch (error: any) {

                return rejectWithValue(getApiErrorMessage(error));
            }
        });


export const logoutThunk = createAsyncThunk<
    boolean,
    void
>('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const authService = new AuthService();
        await authService.logout();
        return true;
    } catch (error) {
        return rejectWithValue(getApiErrorMessage(error));
    }
});
