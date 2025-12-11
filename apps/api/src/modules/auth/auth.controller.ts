import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/modules/user";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dtos/login.dto";
import { CookieService } from "@/core/cookie";




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

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {

        const user = await this.authService.login(loginDto);

        this.cookieService.setAuthCookie(res, user.refreshToken);

        return user;
    }


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


    @Post('refresh')
    async refreshToken( @Res() res: Response , @Req() req: Request) {
        const refreshToken = this.cookieService.getAuthCookie(req);
        if(!refreshToken){
            throw new UnauthorizedException('Refresh token not found');
        }
        return await this.authService.refreshToken(refreshToken);
    }

}
