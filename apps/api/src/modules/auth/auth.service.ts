import { CreateUserDto, UserDto, UserService } from "@/modules/user";
import { Injectable } from "@nestjs/common";
import { MailService } from "@/modules/mail";
import { TokenService } from "@/modules/token";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly tokenService: TokenService,
    ) { }

    public async registration(registerDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.createUser(registerDto);
        const activationLink = user.activationLink;

        await this.mailService.sendActivationLink(user.email, user.name, activationLink);
        const tokens = this.tokenService.generateTokens({ userId: user.id });
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        return new UserDto(
            user,
            tokens.accessToken,
            tokens.refreshToken
        );
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
