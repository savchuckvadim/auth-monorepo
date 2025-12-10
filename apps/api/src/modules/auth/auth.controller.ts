import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/modules/user";




@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
    async activate(@Param('link') link: string) {
        return await this.authService.activate(link);
    }

    @Get('refresh')
    async refreshToken(@Body() refreshToken: string) {
        return await this.authService.refreshToken(refreshToken);
    }

}
