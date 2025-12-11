import { CreateUserDto, UserDto, UserService } from "@/modules/user";
import { Injectable } from "@nestjs/common";
import { SendMailActivationLinkUseCase } from "@/modules/mail";
import { TokenService } from "@/modules/token";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: SendMailActivationLinkUseCase,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
    ) { }

    public async registration(registerDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.createUser(registerDto);
        const baseUrl = this.configService.getOrThrow<string>('APP_URL')
        const activationLink = `${baseUrl}/api/auth/activate/${user.activationLink}`


        await this.mailService.activationLink({  //отправка в очередь для отправки письма
            email: user.email,
            name: user.name,
            activationLink: activationLink
        });



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
        await this.userService.activateUser(link);
        return true;
    }
    public async refreshToken(refreshToken: string) {
        return 'refreshToken';
    }




}
