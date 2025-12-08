import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/modules/user";
import { User } from "generated/prisma";
import { CurrentUser } from "@/core/decorators/auth/current-user.decorator";



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
    async activate(@Param('link') link: string) {
        return await this.authService.activate(link);
    }

    @Get('refresh')
    async refreshToken(@Body() refreshToken: string) {
        return await this.authService.refreshToken(refreshToken);
    }
 
}
