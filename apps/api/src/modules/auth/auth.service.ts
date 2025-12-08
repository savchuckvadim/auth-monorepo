import { CreateUserDto } from "@/modules/user";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AuthService {
    constructor() { }

    public async registration(registerDto: CreateUserDto) {
        return 'register';
    }

    public async login(loginDto: CreateUserDto) {
        return 'login';
    }

    public async logout(refreshToken: string) {
        return 'logout';
    }
    public async activate(link: string) {
        return 'activate';
    }
    public async refreshToken(refreshToken: string) {
        return 'refreshToken';
    }




}
