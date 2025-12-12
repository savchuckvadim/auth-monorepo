import { CreateUserDto, UserDto, UserService } from "@/modules/user";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SendMailActivationLinkUseCase } from "@/modules/mail";
import { TokenService } from "@/modules/token";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "../dtos/login.dto";
import { AuthenticatedUserDto } from "../dtos/login.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: SendMailActivationLinkUseCase,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,

    ) { }

    public async registration(registerDto: CreateUserDto): Promise<AuthenticatedUserDto> {
        const user = await this.userService.createUser(registerDto);
        const baseUrl = this.configService.getOrThrow<string>('APP_URL')
        const activationLink = `${baseUrl}/api/auth/activate/${user.activationLink}`


        await this.mailService.activationLink({  //отправка в очередь для отправки письма
            email: user.email,
            name: user.name,
            activationLink: activationLink
        });


        return await this.generateTokens(user);

    }

    public async login(loginDto: LoginDto) {

        const user = await this.userService.getUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await this.userService.comparePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return await this.generateTokens(new UserDto(user));
    }


    public async logout(refreshToken: string) {
        await this.tokenService.removeToken(refreshToken);
        return true;
    }
    public async activate(link: string) {
        const user = await this.userService.activateUser(link);
        return await this.generateTokens(user);

    }
    public async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }
        const userData = await this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.tokenService.findToken(refreshToken);
        if (!tokenFromDb || !userData) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        console.log(userData);
        console.log(tokenFromDb);

        const user = await this.userService.getUser(userData.id);
        return await this.generateTokens(user);
    }
    private async generateTokens(user: UserDto): Promise<AuthenticatedUserDto> {

        const tokens = this.tokenService.generateTokens({ userId: user.id });
        await this.tokenService.saveToken(user.id, tokens.refreshToken);

        const result: AuthenticatedUserDto = {
            tokens,
            user: user
        }
        return result;
    }



}
