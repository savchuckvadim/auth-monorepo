import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services//auth.service';
import { SessionsService } from '../services/sessions.service';
import { PasswordResetService } from '../password-reset/password-reset.service';
import { CreateUserDto } from '@/modules/user';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUserDto, LoginDto } from '../dtos/login.dto';
import { SessionDto, SessionsBulkResultDto } from '../dtos/session.dto';
import {
    ChangePasswordDto,
    ForgotPasswordDto,
    PasswordActionResultDto,
    ResetPasswordDto,
} from '../dtos/password.dto';
import { CookieService } from '@/core/cookie';
import { AuthCookieInterceptor } from '@/core/interceptors/auth-cookie.interceptor';
import { SetAuthCookie } from '@/core/decorators/auth/set-auth-cookie.decorator';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';
import { ErrorResponseDto } from '@/core';
import { resolveAuthRequestInfo, resolveDeviceIdFromHeaders } from '@/lib';

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
    clientUrl: string;
    constructor(
        private readonly authService: AuthService,
        private readonly sessionsService: SessionsService,
        private readonly passwordResetService: PasswordResetService,
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
        @Req() req: Request,
    ): Promise<AuthenticatedUserDto> {
        return await this.authService.registration(
            registerDto,
            resolveAuthRequestInfo(req),
        );
    }

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto, description: 'Login' })
    @ApiResponse({
        status: 200,
        description: 'User',
        type: AuthenticatedUserDto,
    })
    @UseInterceptors(AuthCookieInterceptor) // вызов interceptor без декоратора напрямую. interceptor вставляет куку в ответ
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request,
    ): Promise<AuthenticatedUserDto> {
        return await this.authService.login(
            loginDto,
            resolveAuthRequestInfo(req),
        );
    }

    @ApiOperation({ summary: 'Activate' })
    @ApiParam({ name: 'link', description: 'Activate link' })
    @SetAuthCookie() // вызов interceptor через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor)
    @Get('activate/:link')
    async activate(
        @Param('link') link: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = await this.authService.activate(
            link,
            resolveAuthRequestInfo(req),
        );
        const redirectUrl = `${this.clientUrl}/auth/login`;
        this.cookieService.setRefreshToken(res, user.tokens.refreshToken);
        this.cookieService.setAccessToken(res, user.tokens.accessToken);
        return res.redirect(HttpStatus.FOUND, redirectUrl);
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 200, description: 'User', type: Boolean })
    @Get('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<boolean> {
        // Идемпотентно: если refreshToken отсутствует или уже удалён,
        // просто чистим cookies и возвращаем true.
        const refreshToken = this.cookieService.getRefreshToken(req);
        await this.authService.logout(refreshToken);
        this.cookieService.clearAuthCookies(res);
        return true;
    }

    @ApiOperation({ summary: 'Refresh token' })
    @ApiResponse({
        status: 200,
        description: 'User',
        type: AuthenticatedUserDto,
    })
    @SetAuthCookie() // вызов interceptor через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor)
    @Post('refresh')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthenticatedUserDto> {
        const refreshToken = this.cookieService.getRefreshToken(req);
        return await this.authService.refreshToken(
            refreshToken,
            res,
            resolveAuthRequestInfo(req),
        );
    }

    // ============ Sessions management (logout everywhere / list / revoke) ============

    @ApiOperation({
        summary: 'Получить список активных сессий текущего пользователя',
        description:
            'Возвращает все неистёкшие refresh-сессии (одна сессия = одно устройство/браузер). У той, из которой сделан текущий запрос, `isCurrent = true`.',
    })
    @ApiResponse({
        status: 200,
        description: 'Список сессий',
        type: [SessionDto],
    })
    @ApiUnauthorizedResponse({
        description: 'Access token отсутствует или невалиден',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Get('sessions')
    async listSessions(
        @CurrentUser() user: TokenPayloadDto,
        @Req() req: Request,
    ): Promise<SessionDto[]> {
        return await this.sessionsService.listSessions(user.userId, {
            refreshToken: this.cookieService.getRefreshToken(req),
            deviceId: resolveDeviceIdFromHeaders(req.headers),
        });
    }

    @ApiOperation({
        summary: 'Ревокнуть конкретную сессию (другое устройство)',
        description:
            'Удаляет одну refresh-сессию по её ID. Сервер сверяет `userId` — чужую сессию ревокнуть нельзя, даже передав её id.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID сессии (tokens.id)',
        example: '3fbe2a6a-1234-4a3b-9c7e-1234567890ab',
    })
    @ApiResponse({
        status: 200,
        description: 'Сессия удалена',
        type: SessionsBulkResultDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Access token отсутствует или невалиден',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Delete('sessions/:id')
    async revokeSession(
        @CurrentUser() user: TokenPayloadDto,
        @Param('id') id: string,
    ): Promise<SessionsBulkResultDto> {
        return await this.sessionsService.revokeSession(user.userId, id);
    }

    @ApiOperation({
        summary: 'Выйти со всех устройств',
        description:
            'Удаляет ВСЕ refresh-сессии текущего пользователя, включая текущую. После вызова клиент получит 401 на следующем `refresh` и будет перенаправлен на /auth/login.',
    })
    @ApiResponse({
        status: 200,
        description: 'Все сессии удалены',
        type: SessionsBulkResultDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Access token отсутствует или невалиден',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Delete('sessions')
    async revokeAllSessions(
        @CurrentUser() user: TokenPayloadDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<SessionsBulkResultDto> {
        const result = await this.sessionsService.revokeAllSessions(
            user.userId,
        );
        this.cookieService.clearAuthCookies(res);
        return result;
    }

    // ============ Password flow (forgot / reset / change) ============

    @ApiOperation({
        summary: 'Запросить письмо со ссылкой для сброса пароля',
        description:
            'Всегда отвечает `{ success: true }` независимо от того, существует ли пользователь с таким email — чтобы не раскрывать наличие учётных записей.',
    })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Письмо поставлено в очередь (или проигнорировано)',
        type: PasswordActionResultDto,
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        type: ErrorResponseDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
        @Req() req: Request,
    ): Promise<PasswordActionResultDto> {
        await this.passwordResetService.requestReset(
            dto.email,
            resolveAuthRequestInfo(req),
        );
        return { success: true };
    }

    @ApiOperation({
        summary: 'Установить новый пароль по одноразовому токену из письма',
        description:
            'Потребляет токен, обновляет пароль пользователя и ревокает ВСЕ refresh-сессии. Пользователь должен заново войти везде.',
    })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Пароль обновлён',
        type: PasswordActionResultDto,
    })
    @ApiUnauthorizedResponse({
        description:
            'Токен не найден, уже использован или истёк (`PASSWORD_RESET_TOKEN_*`)',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        type: ErrorResponseDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    async resetPassword(
        @Body() dto: ResetPasswordDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<PasswordActionResultDto> {
        await this.passwordResetService.resetPassword(dto.token, dto.password);
        // На всякий случай чистим cookie в том же браузере: если reset делали
        // из-под авторизованной сессии — она всё равно уже ревокнута.
        this.cookieService.clearAuthCookies(res);
        return { success: true };
    }

    @ApiOperation({
        summary: 'Сменить пароль авторизованным пользователем',
        description:
            'Требует подтверждения старого пароля. Ревокает все refresh-сессии пользователя КРОМЕ текущей (из cookie), чтобы пользователь не был разлогинен на своём же устройстве.',
    })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Пароль изменён',
        type: PasswordActionResultDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Неверный текущий пароль (`INVALID_PASSWORD`)',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Validation failed / `PASSWORD_SAME_AS_OLD`',
        type: ErrorResponseDto,
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('change-password')
    async changePassword(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: ChangePasswordDto,
        @Req() req: Request,
    ): Promise<PasswordActionResultDto> {
        await this.passwordResetService.changePassword(
            user.userId,
            dto.oldPassword,
            dto.newPassword,
            this.cookieService.getRefreshToken(req),
        );
        return { success: true };
    }
}
