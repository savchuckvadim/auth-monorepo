# OAuth авторизация и CAPTCHA (Backend)

## Назначение

Реализовать backend поддержку OAuth авторизации через Yandex, Google, Telegram и интеграцию CAPTCHA для защиты от ботов.

## Требования

### Функционал

1. **OAuth авторизация**:
   - Инициация OAuth через Yandex
   - Инициация OAuth через Google
   - Инициация OAuth через Telegram
   - Обработка OAuth callback
   - Создание/обновление пользователя при OAuth авторизации
   - Связывание OAuth аккаунтов с существующим аккаунтом

2. **CAPTCHA**:
   - Верификация CAPTCHA на backend
   - Поддержка различных провайдеров (Google reCAPTCHA, hCaptcha, Cloudflare Turnstile)
   - Интеграция CAPTCHA в endpoints логина и регистрации

## Архитектура

### Модели Prisma

**Добавить в `apps/api/prisma/schema.prisma`**:

```prisma
model OAuthAccount {
    id            String   @id @default(uuid())
    userId        String   @map("user_id") @db.VarChar(255)
    provider      String   @db.VarChar(50) // yandex, google, telegram
    providerId    String   @map("provider_id") @db.VarChar(255) // ID пользователя в провайдере
    email         String?  @db.VarChar(255)
    name          String?  @db.VarChar(255)
    avatar        String?  @db.VarChar(500)
    accessToken   String?  @map("access_token") @db.Text
    refreshToken  String?  @map("refresh_token") @db.Text
    expiresAt     DateTime? @map("expires_at")
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([provider, providerId])
    @@index([userId])
    @@index([provider, providerId])
    @@map("oauth_accounts")
}
```

**Обновить модель User**:

```prisma
model User {
    // ... существующие поля

    // OAuth relations
    oauthAccounts OAuthAccount[]
}
```

## Модули NestJS

### 1. Модуль OAuth

**Структура**:
```
modules/oauth/
├── oauth.module.ts
├── oauth.controller.ts
├── services/
│   ├── oauth.service.ts
│   ├── yandex-oauth.service.ts
│   ├── google-oauth.service.ts
│   └── telegram-oauth.service.ts
├── strategies/
│   ├── yandex.strategy.ts
│   ├── google.strategy.ts
│   └── telegram.strategy.ts
└── dto/
    ├── oauth-initiate.dto.ts
    └── oauth-callback.dto.ts
```

### 2. Модуль CAPTCHA

**Структура**:
```
modules/captcha/
├── captcha.module.ts
├── services/
│   ├── captcha.service.ts
│   ├── recaptcha.service.ts
│   ├── hcaptcha.service.ts
│   └── turnstile.service.ts
└── guards/
    └── captcha.guard.ts
```

## Детальная реализация

### 1. OAuth Service

**Основной сервис**:

```typescript
// oauth/services/oauth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user';
import { TokenService } from '@/modules/token';
import { OAuthAccountRepository } from '../repositories/oauth-account.repository';
import { YandexOAuthService } from './yandex-oauth.service';
import { GoogleOAuthService } from './google-oauth.service';
import { TelegramOAuthService } from './telegram-oauth.service';

@Injectable()
export class OAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly oauthAccountRepo: OAuthAccountRepository,
        private readonly yandexOAuth: YandexOAuthService,
        private readonly googleOAuth: GoogleOAuthService,
        private readonly telegramOAuth: TelegramOAuthService,
    ) {}

    /**
     * Инициирует OAuth авторизацию
     * Возвращает URL для редиректа на провайдера
     */
    async initiateOAuth(provider: 'yandex' | 'google' | 'telegram', state?: string): Promise<{ redirectUrl: string }> {
        const oauthState = state || this.generateState();

        let redirectUrl: string;

        switch (provider) {
            case 'yandex':
                redirectUrl = await this.yandexOAuth.getAuthorizationUrl(oauthState);
                break;
            case 'google':
                redirectUrl = await this.googleOAuth.getAuthorizationUrl(oauthState);
                break;
            case 'telegram':
                redirectUrl = await this.telegramOAuth.getAuthorizationUrl(oauthState);
                break;
            default:
                throw new Error(`Unsupported OAuth provider: ${provider}`);
        }

        // Сохраняем state в Redis или сессии для проверки при callback
        await this.saveOAuthState(oauthState, provider);

        return { redirectUrl };
    }

    /**
     * Обрабатывает OAuth callback
     * Обменивает код на токены, получает данные пользователя, создает/обновляет аккаунт
     */
    async handleCallback(
        provider: 'yandex' | 'google' | 'telegram',
        code: string,
        state: string,
    ): Promise<AuthenticatedUserDto> {
        // Проверяем state
        const savedState = await this.getOAuthState(state);
        if (!savedState || savedState.provider !== provider) {
            throw new UnauthorizedException('Invalid OAuth state');
        }

        // Обмениваем код на токены и получаем данные пользователя
        let userData: OAuthUserData;

        switch (provider) {
            case 'yandex':
                userData = await this.yandexOAuth.getUserData(code);
                break;
            case 'google':
                userData = await this.googleOAuth.getUserData(code);
                break;
            case 'telegram':
                userData = await this.telegramOAuth.getUserData(code);
                break;
            default:
                throw new Error(`Unsupported OAuth provider: ${provider}`);
        }

        // Ищем существующий OAuth аккаунт
        let oauthAccount = await this.oauthAccountRepo.findByProvider(provider, userData.providerId);

        if (oauthAccount) {
            // Обновляем существующий OAuth аккаунт
            oauthAccount = await this.oauthAccountRepo.update(oauthAccount.id, {
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                accessToken: userData.accessToken,
                refreshToken: userData.refreshToken,
                expiresAt: userData.expiresAt,
            });

            // Получаем пользователя
            const user = await this.userService.getUser(oauthAccount.userId);
            return await this.tokenService.generateTokens(user);
        }

        // Ищем пользователя по email (если есть)
        let user = userData.email
            ? await this.userService.getUserByEmail(userData.email).catch(() => null)
            : null;

        if (user) {
            // Связываем OAuth аккаунт с существующим пользователем
            await this.oauthAccountRepo.create({
                userId: user.id,
                provider,
                providerId: userData.providerId,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                accessToken: userData.accessToken,
                refreshToken: userData.refreshToken,
                expiresAt: userData.expiresAt,
            });

            return await this.tokenService.generateTokens(user);
        }

        // Создаем нового пользователя
        user = await this.userService.createUser({
            name: userData.name || 'Пользователь',
            email: userData.email || `${provider}-${userData.providerId}@oauth.local`,
            password: crypto.randomBytes(32).toString('hex'), // Случайный пароль
            role: 'user',
            isAcivated: true, // OAuth пользователи активированы автоматически
        });

        // Создаем OAuth аккаунт
        await this.oauthAccountRepo.create({
            userId: user.id,
            provider,
            providerId: userData.providerId,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
            expiresAt: userData.expiresAt,
        });

        // Если есть avatar, обновляем профиль
        if (userData.avatar) {
            await this.profileService.updateProfile(user.id, {
                avatar: userData.avatar,
            });
        }

        return await this.tokenService.generateTokens(user);
    }

    private generateState(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private async saveOAuthState(state: string, provider: string): Promise<void> {
        // Сохраняем в Redis с TTL 10 минут
        await this.redis.setex(`oauth:state:${state}`, 600, JSON.stringify({ provider }));
    }

    private async getOAuthState(state: string): Promise<{ provider: string } | null> {
        const data = await this.redis.get(`oauth:state:${state}`);
        if (!data) return null;
        return JSON.parse(data);
    }
}

interface OAuthUserData {
    providerId: string;
    email?: string;
    name?: string;
    avatar?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
}
```

### 2. Yandex OAuth Service

```typescript
// oauth/services/yandex-oauth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class YandexOAuthService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.getOrThrow<string>('YANDEX_CLIENT_ID');
        this.clientSecret = this.configService.getOrThrow<string>('YANDEX_CLIENT_SECRET');
        this.redirectUri = this.configService.getOrThrow<string>('YANDEX_REDIRECT_URI');
    }

    async getAuthorizationUrl(state: string): Promise<string> {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            state,
        });

        return `https://oauth.yandex.ru/authorize?${params.toString()}`;
    }

    async getUserData(code: string): Promise<OAuthUserData> {
        // Обмениваем код на токен
        const tokenResponse = await axios.post('https://oauth.yandex.ru/token', {
            grant_type: 'authorization_code',
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });

        const accessToken = tokenResponse.data.access_token;

        // Получаем данные пользователя
        const userResponse = await axios.get('https://login.yandex.ru/info', {
            headers: {
                Authorization: `OAuth ${accessToken}`,
            },
            params: {
                format: 'json',
            },
        });

        const user = userResponse.data;

        return {
            providerId: user.id,
            email: user.default_email,
            name: `${user.first_name} ${user.last_name}`.trim() || user.display_name,
            avatar: user.default_avatar_id
                ? `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200`
                : undefined,
            accessToken,
            expiresAt: tokenResponse.data.expires_in
                ? new Date(Date.now() + tokenResponse.data.expires_in * 1000)
                : undefined,
        };
    }
}
```

### 3. Google OAuth Service

```typescript
// oauth/services/google-oauth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleOAuthService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
        this.clientSecret = this.configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
        this.redirectUri = this.configService.getOrThrow<string>('GOOGLE_REDIRECT_URI');
    }

    async getAuthorizationUrl(state: string): Promise<string> {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'openid email profile',
            state,
            access_type: 'offline',
            prompt: 'consent',
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async getUserData(code: string): Promise<OAuthUserData> {
        // Обмениваем код на токен
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
        });

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        // Получаем данные пользователя
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = userResponse.data;

        return {
            providerId: user.id,
            email: user.email,
            name: user.name,
            avatar: user.picture,
            accessToken,
            refreshToken,
            expiresAt: tokenResponse.data.expires_in
                ? new Date(Date.now() + tokenResponse.data.expires_in * 1000)
                : undefined,
        };
    }
}
```

### 4. Telegram OAuth Service

```typescript
// oauth/services/telegram-oauth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class TelegramOAuthService {
    private readonly botToken: string;
    private readonly botUsername: string;

    constructor(private readonly configService: ConfigService) {
        this.botToken = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
        this.botUsername = this.configService.getOrThrow<string>('TELEGRAM_BOT_USERNAME');
    }

    async getAuthorizationUrl(state: string): Promise<string> {
        // Telegram использует специальный виджет для авторизации
        // Возвращаем URL для Telegram Login Widget
        const params = new URLSearchParams({
            bot_id: this.botUsername,
            origin: this.configService.getOrThrow<string>('CLIENT_URL'),
            request_access: 'write',
            state,
        });

        return `https://oauth.telegram.org/auth?${params.toString()}`;
    }

    async getUserData(authData: TelegramAuthData): Promise<OAuthUserData> {
        // Проверяем подпись Telegram
        const isValid = this.verifyTelegramAuth(authData);
        if (!isValid) {
            throw new UnauthorizedException('Invalid Telegram auth data');
        }

        return {
            providerId: authData.id.toString(),
            name: `${authData.first_name} ${authData.last_name || ''}`.trim(),
            avatar: authData.photo_url,
        };
    }

    private verifyTelegramAuth(authData: TelegramAuthData): boolean {
        const { hash, ...data } = authData;

        // Создаем строку для проверки
        const dataCheckString = Object.keys(data)
            .sort()
            .map(key => `${key}=${data[key]}`)
            .join('\n');

        // Создаем секретный ключ
        const secretKey = crypto
            .createHash('sha256')
            .update(this.botToken)
            .digest();

        // Вычисляем HMAC
        const hmac = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        return hmac === hash;
    }
}

interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}
```

### 5. CAPTCHA Service

```typescript
// captcha/services/captcha.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReCaptchaService } from './recaptcha.service';
import { HCaptchaService } from './hcaptcha.service';
import { TurnstileService } from './turnstile.service';

@Injectable()
export class CaptchaService {
    private readonly provider: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly recaptchaService: ReCaptchaService,
        private readonly hcaptchaService: HCaptchaService,
        private readonly turnstileService: TurnstileService,
    ) {
        this.provider = this.configService.get<string>('CAPTCHA_PROVIDER') || 'recaptcha';
    }

    async verify(token: string, remoteip?: string): Promise<boolean> {
        switch (this.provider) {
            case 'recaptcha':
                return await this.recaptchaService.verify(token, remoteip);
            case 'hcaptcha':
                return await this.hcaptchaService.verify(token, remoteip);
            case 'turnstile':
                return await this.turnstileService.verify(token, remoteip);
            default:
                throw new Error(`Unsupported CAPTCHA provider: ${this.provider}`);
        }
    }
}
```

**ReCAPTCHA Service**:

```typescript
// captcha/services/recaptcha.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ReCaptchaService {
    private readonly secretKey: string;
    private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    constructor(private readonly configService: ConfigService) {
        this.secretKey = this.configService.getOrThrow<string>('RECAPTCHA_SECRET_KEY');
    }

    async verify(token: string, remoteip?: string): Promise<boolean> {
        try {
            const response = await axios.post(this.verifyUrl, null, {
                params: {
                    secret: this.secretKey,
                    response: token,
                    remoteip,
                },
            });

            return response.data.success === true;
        } catch (error) {
            console.error('ReCAPTCHA verification error:', error);
            return false;
        }
    }
}
```

**hCaptcha Service**:

```typescript
// captcha/services/hcaptcha.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HCaptchaService {
    private readonly secretKey: string;
    private readonly verifyUrl = 'https://hcaptcha.com/siteverify';

    constructor(private readonly configService: ConfigService) {
        this.secretKey = this.configService.getOrThrow<string>('HCAPTCHA_SECRET_KEY');
    }

    async verify(token: string, remoteip?: string): Promise<boolean> {
        try {
            const response = await axios.post(this.verifyUrl, null, {
                params: {
                    secret: this.secretKey,
                    response: token,
                    remoteip,
                },
            });

            return response.data.success === true;
        } catch (error) {
            console.error('hCaptcha verification error:', error);
            return false;
        }
    }
}
```

**Turnstile Service**:

```typescript
// captcha/services/turnstile.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TurnstileService {
    private readonly secretKey: string;
    private readonly verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    constructor(private readonly configService: ConfigService) {
        this.secretKey = this.configService.getOrThrow<string>('TURNSTILE_SECRET_KEY');
    }

    async verify(token: string, remoteip?: string): Promise<boolean> {
        try {
            const response = await axios.post(this.verifyUrl, {
                secret: this.secretKey,
                response: token,
                remoteip,
            });

            return response.data.success === true;
        } catch (error) {
            console.error('Turnstile verification error:', error);
            return false;
        }
    }
}
```

### 6. CAPTCHA Guard

```typescript
// captcha/guards/captcha.guard.ts
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { CaptchaService } from '../services/captcha.service';
import { Request } from 'express';

@Injectable()
export class CaptchaGuard implements CanActivate {
    constructor(private readonly captchaService: CaptchaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const captchaToken = request.body?.captchaToken || request.query?.captchaToken;

        if (!captchaToken) {
            throw new BadRequestException('CAPTCHA token is required');
        }

        const remoteip = request.ip || request.headers['x-forwarded-for'] as string;
        const isValid = await this.captchaService.verify(captchaToken, remoteip);

        if (!isValid) {
            throw new BadRequestException('CAPTCHA verification failed');
        }

        return true;
    }
}
```

### 7. OAuth Controller

```typescript
// oauth/oauth.controller.ts
import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { OAuthService } from './services/oauth.service';
import { SetAuthCookie } from '@/core/decorators/auth/set-auth-cookie.decorator';

@ApiTags('OAuth')
@Controller('auth/oauth')
export class OAuthController {
    constructor(private readonly oauthService: OAuthService) {}

    @ApiOperation({ summary: 'Initiate OAuth' })
    @ApiQuery({ name: 'provider', enum: ['yandex', 'google', 'telegram'] })
    @Get(':provider/initiate')
    async initiateOAuth(
        @Param('provider') provider: 'yandex' | 'google' | 'telegram',
        @Query('state') state?: string,
    ) {
        return await this.oauthService.initiateOAuth(provider, state);
    }

    @ApiOperation({ summary: 'OAuth callback' })
    @ApiQuery({ name: 'code' })
    @ApiQuery({ name: 'state' })
    @ApiQuery({ name: 'provider', enum: ['yandex', 'google', 'telegram'] })
    @SetAuthCookie()
    @Get(':provider/callback')
    async callback(
        @Param('provider') provider: 'yandex' | 'google' | 'telegram',
        @Query('code') code: string,
        @Query('state') state: string,
    ) {
        return await this.oauthService.handleCallback(provider, code, state);
    }
}
```

### 8. Обновление Auth Controller

```typescript
// auth/auth.controller.ts (обновление)
import { UseGuards } from '@nestjs/common';
import { CaptchaGuard } from '@/modules/captcha';

@Controller('auth')
export class AuthController {
    // ... существующий код

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto })
    @UseGuards(CaptchaGuard) // Добавляем CAPTCHA guard
    @UseInterceptors(AuthCookieInterceptor)
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AuthenticatedUserDto> {
        // captchaToken уже проверен в CaptchaGuard
        const user = await this.authService.login(loginDto);
        return user;
    }

    @ApiOperation({ summary: 'Registration' })
    @ApiBody({ type: CreateUserDto })
    @UseGuards(CaptchaGuard) // Добавляем CAPTCHA guard
    @Post('registration')
    async registration(@Body() registerDto: CreateUserDto): Promise<AuthenticatedUserDto> {
        // captchaToken уже проверен в CaptchaGuard
        return await this.authService.registration(registerDto);
    }
}
```

### 9. Обновление DTO

```typescript
// auth/dtos/login.dto.ts (обновление)
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    captchaToken?: string; // Добавляем опциональный captchaToken
}
```

```typescript
// user/dto/user.dto.ts (обновление)
export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    captchaToken?: string; // Добавляем опциональный captchaToken
}
```

## Переменные окружения

```env
# OAuth Yandex
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
YANDEX_REDIRECT_URI=https://your-domain.com/api/auth/oauth/yandex/callback

# OAuth Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/oauth/google/callback

# OAuth Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_BOT_USERNAME=your-telegram-bot-username

# CAPTCHA
CAPTCHA_PROVIDER=recaptcha # или hcaptcha, turnstile
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

## Зависимости

### Установка пакетов

```bash
# Для OAuth (если не используется Passport)
npm install axios

# Для работы с Telegram (если нужны дополнительные библиотеки)
# npm install node-telegram-bot-api
```

## Связанные задачи

- [Frontend задача по OAuth и CAPTCHA](../frontend/tasks/oauth-captcha.md) - **обязательно** - реализация UI компонентов
- [Унификация форм логина и регистрации](../frontend/tasks/auth-forms-unification.md) - интеграция OAuth и CAPTCHA

## Этапы реализации

### Этап 1: База данных

- [ ] Добавить модель `OAuthAccount` в Prisma schema
- [ ] Создать миграцию
- [ ] Обновить модель User

### Этап 2: OAuth модуль

- [ ] Создать `OAuthService`
- [ ] Реализовать `YandexOAuthService`
- [ ] Реализовать `GoogleOAuthService`
- [ ] Реализовать `TelegramOAuthService`
- [ ] Создать `OAuthController`

### Этап 3: CAPTCHA модуль

- [ ] Создать `CaptchaService`
- [ ] Реализовать `ReCaptchaService`
- [ ] Реализовать `HCaptchaService`
- [ ] Реализовать `TurnstileService`
- [ ] Создать `CaptchaGuard`

### Этап 4: Интеграция

- [ ] Обновить `AuthController` для поддержки CAPTCHA
- [ ] Обновить DTO для поддержки `captchaToken`
- [ ] Интегрировать OAuth endpoints

### Этап 5: Тестирование

- [ ] Протестировать OAuth Yandex
- [ ] Протестировать OAuth Google
- [ ] Протестировать OAuth Telegram
- [ ] Протестировать CAPTCHA (разные провайдеры)
- [ ] Протестировать комбинацию OAuth + CAPTCHA
