import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor() { }

    @Post('registration')
    async register(@Body() registerDto: string) {
        return 'registration';
    }

    @Post('login')
    async login(@Body() loginDto: string) {
        return 'login';
    }

    @Post('logout')
    async logout(@Body() logoutDto: string) {
        return 'logout';
    }

    @Get('activate/:link')
    async activate(@Param('link') link: string) {
        return 'activate';
    }

    @Get('refresh')
    async refresh() {
        return 'refresh';
    }
}
