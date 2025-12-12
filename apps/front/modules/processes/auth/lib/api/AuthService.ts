import { CreateUserDto, getAuth } from "@workspace/nest-api";

export class AuthService {
    api = getAuth();
    constructor() { }

    async login(email: string, password: string) {
        return await this.api.authLogin({ email, password });
    }

    async registration(user: CreateUserDto) {
        return await this.api.authRegistration(user);
    }

    async activate(link: string) {
        return await this.api.authActivate(link);
    }

    async logout() {
        return await this.api.authLogout();
    }

    async refreshToken() {
        return await this.api.authRefreshToken();
    }
}
