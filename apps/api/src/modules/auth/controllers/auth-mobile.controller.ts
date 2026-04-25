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
import { AuthService } from '../services/auth.service';
import { SessionsService } from '../services/sessions.service';
import { PasswordResetService } from '../password-reset/password-reset.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUserDto, LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { MobileLogoutDto } from '../dtos/mobile-logout.dto';
import { SessionDto, SessionsBulkResultDto } from '../dtos/session.dto';
import {
    ChangePasswordMobileDto,
    ForgotPasswordDto,
    PasswordActionResultDto,
    ResetPasswordDto,
} from '../dtos/password.dto';
import { CookieService } from '@/core/cookie';
import { CreateUserDto } from '@/modules/user';
import { ErrorResponseDto } from '@/core';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto, TokenService } from '@/modules/token';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { resolveAuthRequestInfo, resolveDeviceIdFromHeaders } from '@/lib';

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
        private readonly sessionsService: SessionsService,
        private readonly passwordResetService: PasswordResetService,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
        private readonly tokenService: TokenService,
        private readonly notificationsService: NotificationsService,
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
    @ApiOperation({ summary: 'Login for mobile app' })
    @ApiBody({ type: LoginDto, description: 'Login for mobile app' })
    @ApiResponse({
        status: 200,
        description: 'User with tokens',
        type: AuthenticatedUserDto,
    })
    @Post('mobile/login')
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
    // @SetAuthCookie() // вызов interceptor через декоратор. декоратор просто обертка для UseInterceptors(AuthCookieInterceptor)
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

    @ApiOperation({
        summary: 'Logout for mobile app',
        description:
            'Идемпотентно ревокает refresh-сессию. Если передан `installationId` ' +
            '(PushDevice.id), запись push-устройства жёстко удаляется, чтобы бэк ' +
            'сразу прекратил слать пуши на это устройство и не ждал, когда ' +
            'APNS/FCM вернёт 410/NotRegistered на следующей отправке.',
    })
    @ApiBody({ type: MobileLogoutDto, description: 'Logout for mobile app' })
    @ApiResponse({ status: 200, description: 'Logout success', type: Boolean })
    @Post('logout')
    async logout(@Body() body: MobileLogoutDto): Promise<boolean> {
        // Удаляем push-устройство ДО ревокации refresh-токена, пока он ещё валиден
        // и можно безопасно достать userId. Сначала пробуем по записи в БД (быстро
        // и не зависит от валидности подписи), затем фоллбэк на верификацию JWT.
        if (body.installationId) {
            const userId = await this.resolveUserIdFromRefreshToken(
                body.refreshToken,
            );
            if (userId) {
                try {
                    await this.notificationsService.removeDevice(
                        userId,
                        body.installationId,
                    );
                } catch {
                    // logout не должен падать из-за ошибок чистки push-устройств
                }
            }
        }

        // Для мобильного приложения токен приходит в body, а не в куках.
        // Идемпотентно: если токена нет в БД — просто возвращаем true.
        await this.authService.logout(body.refreshToken);
        return true;
    }

    private async resolveUserIdFromRefreshToken(
        refreshToken: string,
    ): Promise<string | null> {
        const stored =
            await this.tokenService.findTokenByRefreshToken(refreshToken);
        if (stored?.userId) return stored.userId;

        const payload =
            await this.tokenService.validateRefreshToken(refreshToken);
        return payload?.userId ?? null;
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
    @Post('refresh')
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Req() req: Request,
    ): Promise<AuthenticatedUserDto> {
        return await this.authService.refreshToken(
            refreshTokenDto.refreshToken,
            undefined,
            resolveAuthRequestInfo(req),
        );
    }

    // ============ Sessions management (mobile) ============

    @ApiOperation({
        summary: 'Mobile: список активных сессий',
        description:
            'Текущая сессия определяется по заголовку `x-device-id` (мобилка шлёт его на каждом запросе).',
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
            deviceId: resolveDeviceIdFromHeaders(req.headers),
        });
    }

    @ApiOperation({ summary: 'Mobile: ревок конкретной сессии' })
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
        summary: 'Mobile: выйти со всех устройств',
        description:
            'Удаляет все refresh-сессии пользователя, включая текущую. Мобильное приложение само очистит SecureStore после 401 на следующем refresh.',
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
    ): Promise<SessionsBulkResultDto> {
        return await this.sessionsService.revokeAllSessions(user.userId);
    }

    // ============ Password flow (mobile) ============

    @ApiOperation({
        summary: 'Mobile: запросить письмо со ссылкой для сброса пароля',
        description:
            'Отвечает одинаково независимо от того, существует ли аккаунт. Ссылка в письме ведёт на web-страницу `${CLIENT_URL}/auth/reset-password`.',
    })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Письмо поставлено в очередь',
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
        summary: 'Mobile: установить новый пароль по токену из письма',
        description:
            'Потребляет токен и ревокает все refresh-сессии. Мобилка при следующем запросе получит 401 и очистит SecureStore.',
    })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Пароль обновлён',
        type: PasswordActionResultDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Токен невалиден/использован/истёк',
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
    ): Promise<PasswordActionResultDto> {
        await this.passwordResetService.resetPassword(dto.token, dto.password);
        return { success: true };
    }

    @ApiOperation({
        summary: 'Mobile: сменить пароль (авторизованный пользователь)',
        description:
            'Ревокает все сессии, кроме текущей (если передан refreshToken). Иначе ревокает ВСЕ сессии.',
    })
    @ApiBody({ type: ChangePasswordMobileDto })
    @ApiResponse({
        status: 200,
        description: 'Пароль изменён',
        type: PasswordActionResultDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Неверный текущий пароль',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        type: ErrorResponseDto,
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('change-password')
    async changePassword(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: ChangePasswordMobileDto,
    ): Promise<PasswordActionResultDto> {
        await this.passwordResetService.changePassword(
            user.userId,
            dto.oldPassword,
            dto.newPassword,
            dto.refreshToken ?? null,
        );
        return { success: true };
    }
}
