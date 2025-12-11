import { Body, Controller, Get, HttpStatus, Param, Post, Res} from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/modules/user";
import { ConfigService } from "@nestjs/config";




@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    clientUrl: string
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
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
    async login(@Body() loginDto: CreateUserDto) {
        return await this.authService.login(loginDto);
    }

    @Post('logout')
    async logout(@Body() logoutDto: string) {
        return await this.authService.logout(logoutDto);
    }

    @Get('activate/:link')
    async activate(@Param('link')  link: string , @Res() res: Response) {
        const isActivated = await this.authService.activate(link);
        const redirectUrl = `${this.clientUrl}/login`;
        return res.redirect(HttpStatus.FOUND, redirectUrl);
    }



    @Get('refresh')
    async refreshToken(@Body() refreshToken: string) {
        return await this.authService.refreshToken(refreshToken);
    }

}
