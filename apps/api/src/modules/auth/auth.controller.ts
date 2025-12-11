import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/modules/user";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dtos/login.dto";
import { CookieService } from "@/core/cookie";
import { AuthCookieInterceptor } from "@/core/interceptors/auth-cookie.interceptor";
import { SetAuthCookie } from "@/core/decorators/auth/set-auth-cookie.decorator";


/**
 * AuthController
 *
 * в контроллере реализовано для наглядности три варианта работы с куками:
 * 1. вставляем куку через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor) - Login endpoint
 * 2. вставляем куку через interceptor. interceptor вставляет куку в ответ - Activate endpoint
 * 3. вставляем куку вручную без декоратора и interceptor - Refresh endpoint
 */


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    clientUrl: string
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
    ) {
        this.clientUrl = this.configService.getOrThrow<string>('CLIENT_URL')
    }

    @ApiOperation({ summary: 'Registration' })
    @ApiBody({ type: CreateUserDto, description: 'Registration' })
    @Post('registration')
    async registration(@Body() registerDto: CreateUserDto) {
        return await this.authService.registration(registerDto);
    }


    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto, description: 'Login' })
    @UseInterceptors(AuthCookieInterceptor) // вызов interceptor без декоратора напрямую. interceptor вставляет куку в ответ
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {

        return await this.authService.login(loginDto);


    }
    @ApiOperation({ summary: 'Activate' })
    @ApiParam({ name: 'link', description: 'Activate link' })
    @SetAuthCookie() // вызов interceptor через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor)
    @Get('activate/:link')
    async activate(@Param('link') link: string, @Res() res: Response) {
        const user = await this.authService.activate(link);
        const redirectUrl = `${this.clientUrl}/login`;
        this.cookieService.setAuthCookie(res, user.refreshToken);
        return res.redirect(HttpStatus.FOUND, redirectUrl);
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const refreshToken = this.cookieService.getAuthCookie(req);

        await this.authService.logout(refreshToken);
        this.cookieService.clearAuthCookie(res);
        return refreshToken;
    }


    //refresh для нагядномти вставляем куку вручную  без декоратора и  interceptor
    @ApiOperation({ summary: 'Refresh token' })
    @Post('refresh')
    async refreshToken(@Res() res: Response, @Req() req: Request) {
        const refreshToken = this.cookieService.getAuthCookie(req);
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }
        return await this.authService.refreshToken(refreshToken);
    }

}
