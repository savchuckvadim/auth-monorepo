import { CreateUserDto, UserDto, UserService } from '@/modules/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SendMailActivationLinkUseCase } from '@/modules/mail';
import { TokenService } from '@/modules/token';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/login.dto';
import { AuthenticatedUserDto } from '../dtos/login.dto';
import { CookieService } from '@/core/cookie';
import { Response } from 'express';
import { EnumAuthErrorCode } from '@/modules/token/token.type';
import { AuthRequestInfo } from '@/lib';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: SendMailActivationLinkUseCase,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
    ) {}

    public async registration(
        registerDto: CreateUserDto,
        context?: AuthRequestInfo,
    ): Promise<AuthenticatedUserDto> {
        const user = await this.userService.createUser(registerDto);
        const baseUrl = this.configService.getOrThrow<string>('APP_URL');
        const activationLink = `${baseUrl}/api/auth/activate/${user.activationLink}`;

        await this.mailService.activationLink({
            email: user.email,
            name: user.name,
            activationLink: activationLink,
        });

        return await this.generateTokens(user, context);
    }

    public async login(loginDto: LoginDto, context?: AuthRequestInfo) {
        const user = await this.userService.getUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_FOUND);
        }
        if (!user.isAcivated) {
            throw new UnauthorizedException(
                EnumAuthErrorCode.USER_NOT_ACTIVATED,
            );
        }

        const isPasswordValid = await this.userService.comparePassword(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException(EnumAuthErrorCode.INVALID_PASSWORD);
        }

        return await this.generateTokens(new UserDto(user), context);
    }

    /**
     * Idempotent logout: removes the given refresh token record if it exists.
     * No-op (returns true) when the token is missing or already deleted,
     * so repeated logouts / page refreshes after logout never 401.
     */
    public async logout(refreshToken?: string | null): Promise<boolean> {
        if (!refreshToken) return true;
        try {
            await this.tokenService.removeToken(refreshToken);
        } catch {
            // swallow — we don't want logout to bubble up infra errors
        }
        return true;
    }

    public async activate(link: string, context?: AuthRequestInfo) {
        const user = await this.userService.activateUser(link);
        return await this.generateTokens(user, context);
    }

    public async refreshToken(
        refreshToken: string | null | undefined,
        res?: Response,
        context?: AuthRequestInfo,
    ) {
        const clearClientAuth = () => {
            if (res) this.cookieService.clearAuthCookies(res);
        };

        if (!refreshToken) {
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.REFRESH_TOKEN_MISSING,
            );
        }

        // 1) JWT validity (may throw REFRESH_TOKEN_EXPIRED / INVALID / ERROR).
        let userData: { userId: string } | null = null;
        try {
            userData =
                await this.tokenService.validateRefreshToken(refreshToken);
        } catch (err) {
            clearClientAuth();
            await this.tokenService.removeToken(refreshToken).catch(() => null);
            throw err;
        }

        if (!userData?.userId) {
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.REFRESH_TOKEN_INVALID,
            );
        }

        // 2) Lookup the record. JWT валиден, но записи нет — это признак
        // повторного использования ранее ротированного токена (reuse attack).
        // По рекомендации OAuth 2.0 (RFC 6749 §10.4) — убиваем ВСЕ сессии user'а.
        const tokenFromDb =
            await this.tokenService.findTokenByRefreshToken(refreshToken);
        if (!tokenFromDb) {
            await this.tokenService
                .removeAllUserTokens(userData.userId)
                .catch(() => 0);
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.REFRESH_TOKEN_NOT_FOUND,
            );
        }

        // 3) Owner check: JWT подписан для другого user'а, а запись лежит у нас.
        // Тоже трактуем как компрометацию → чистим сессии обоих.
        if (tokenFromDb.userId !== userData.userId) {
            await Promise.all([
                this.tokenService
                    .removeAllUserTokens(tokenFromDb.userId)
                    .catch(() => 0),
                this.tokenService
                    .removeAllUserTokens(userData.userId)
                    .catch(() => 0),
            ]);
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.TOKEN_USER_MISMATCH,
            );
        }

        // 4) DB-level TTL: страхует нас, если мы руками укоротили срок жизни
        // или часовой cleanup ещё не отработал.
        if (tokenFromDb.expiresAt && tokenFromDb.expiresAt < new Date()) {
            await this.tokenService.removeToken(refreshToken).catch(() => null);
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.REFRESH_TOKEN_EXPIRED,
            );
        }

        // 5) Атомарный claim: единственный параллельный запрос, чей DELETE
        // зацепит строку, получит true. Остальные получат false и упадут
        // в ветку reuse-detection выше на следующей попытке.
        const claimed = await this.tokenService.claimRefreshToken(refreshToken);
        if (!claimed) {
            await this.tokenService
                .removeAllUserTokens(userData.userId)
                .catch(() => 0);
            clearClientAuth();
            throw new UnauthorizedException(
                EnumAuthErrorCode.REFRESH_TOKEN_NOT_FOUND,
            );
        }

        // 6) Issue a fresh pair.
        const user = await this.userService.getUser(userData.userId);
        return await this.generateTokens(user, context);
    }

    private async generateTokens(
        user: UserDto,
        context?: AuthRequestInfo,
    ): Promise<AuthenticatedUserDto> {
        const tokens = this.tokenService.generateTokens({ userId: user.id });
        await this.tokenService.saveToken({
            userId: user.id,
            refreshToken: tokens.refreshToken,
            expiresAt: this.tokenService.getRefreshExpiresAt(),
            deviceId: context?.deviceId,
            userAgent: context?.userAgent,
            ipAddress: context?.ipAddress,
        });

        const result: AuthenticatedUserDto = {
            tokens,
            user,
        };
        return result;
    }
}
