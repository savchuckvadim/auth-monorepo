import { LoginDto, CreateUserDto, UserDto } from "@workspace/nest-api";


export interface IRegisterForm extends CreateUserDto {

    name: string;
    email: string;
    password: string;
    confirmPassword: string;


}

export interface ILoginForm extends LoginDto {

    email: string;
    password: string;

}

export interface IAuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    currentUser: UserDto | null;

}
