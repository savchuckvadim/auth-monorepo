import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUserDto, LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { CookieService } from '@/core/cookie';
import { CreateUserDto } from '@/modules/user';
import { ErrorResponseDto } from '@/core';

/**
 * AuthController для мобильного приложения
 *
 * с куками не работаем, так как мобильное приложение не использует куки.
 * Все токены отдаются в ответе на запрос.
 */

@ApiTags('Auth Mobile')
@Controller('auth-mobile')
export class AuthMobileController {
    clientUrl: string;
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
    ) {
        this.clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    }
    @ApiOperation({ summary: 'Registration' })
    @ApiBody({ type: CreateUserDto, description: 'Registration' })
    @ApiResponse({
        status: 200,
        description: 'User',
        type: AuthenticatedUserDto,
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        type: ErrorResponseDto,
    })
    @Post('registration')
    async registration(
        @Body() registerDto: CreateUserDto,
    ): Promise<AuthenticatedUserDto> {
        return await this.authService.registration(registerDto);
    }
    @ApiOperation({ summary: 'Login for mobile app' })
    @ApiBody({ type: LoginDto, description: 'Login for mobile app' })
    @ApiResponse({
        status: 200,
        description: 'User with tokens',
        type: AuthenticatedUserDto,
    })
    @Post('mobile/login')
    async login(@Body() loginDto: LoginDto): Promise<AuthenticatedUserDto> {
        const user = await this.authService.login(loginDto);
        console.log('login', user);
        return user;
    }

    @ApiOperation({ summary: 'Activate' })
    @ApiParam({ name: 'link', description: 'Activate link' })
    // @SetAuthCookie() // вызов interceptor через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor)
    @Get('activate/:link')
    async activate(@Param('link') link: string, @Res() res: Response) {
        const user = await this.authService.activate(link);
        const redirectUrl = `${this.clientUrl}/auth/login`;
        this.cookieService.setRefreshToken(res, user.tokens.refreshToken);
        this.cookieService.setAccessToken(res, user.tokens.accessToken);
        return res.redirect(HttpStatus.FOUND, redirectUrl);
    }

    @ApiOperation({ summary: 'Logout for mobile app' })
    @ApiBody({ type: RefreshTokenDto, description: 'Logout for mobile app' })
    @ApiResponse({ status: 200, description: 'Logout success', type: Boolean })
    @Post('logout')
    async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<boolean> {
        // Для мобильного приложения токен приходит в body, а не в куках
        await this.authService.logout(refreshTokenDto.refreshToken);
        return true;
    }

    @ApiOperation({ summary: 'Refresh token for mobile app' })
    @ApiBody({
        type: RefreshTokenDto,
        description: 'Refresh token for mobile app',
    })
    @ApiResponse({
        status: 200,
        description: 'User with tokens',
        type: AuthenticatedUserDto,
    })
    // @SetAuthCookie() // НЕ используем для мобильного приложения - токены возвращаются в ответе, а не в куках
    @Post('refresh')
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<AuthenticatedUserDto> {
        // Для мобильного приложения токен приходит в body, а не в куках
        const user = await this.authService.refreshToken(
            refreshTokenDto.refreshToken,
        );
        return user;
    }
}
