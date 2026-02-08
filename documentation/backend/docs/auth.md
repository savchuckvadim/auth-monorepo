# Аутентификация (Auth)

## Обзор

Система аутентификации использует JWT токены (access token + refresh token) с хранением в HttpOnly cookies для безопасности.

## Расположение модулей

```
src/modules/
├── auth/          # Модуль аутентификации
│   ├── auth.module.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── dtos/
│       └── login.dto.ts
├── token/         # Модуль работы с токенами
│   ├── token.service.ts
│   ├── token.repository.ts
│   └── token.dto.ts
└── user/          # Модуль пользователей
    └── user.service.ts
```

## Как работает аутентификация

### 1. Регистрация

**Endpoint**: `POST /api/auth/registration`

**Поток**:
1. Пользователь отправляет данные (email, password, name)
2. `AuthService.registration()` создает пользователя через `UserService`
3. Генерируется `activationLink` для активации email
4. Email с ссылкой активации отправляется в очередь (Bull)
5. Генерируются токены через `TokenService`
6. Токены сохраняются в cookies через `AuthCookieInterceptor`
7. Возвращается `AuthenticatedUserDto` с пользователем и токенами

**Код**:
```typescript
// modules/auth/services/auth.service.ts
public async registration(registerDto: CreateUserDto): Promise<AuthenticatedUserDto> {
    const user = await this.userService.createUser(registerDto);
    const baseUrl = this.configService.getOrThrow<string>('APP_URL')
    const activationLink = `${baseUrl}/api/auth/activate/${user.activationLink}`

    // Отправка в очередь для отправки письма
    await this.mailService.activationLink({
        email: user.email,
        name: user.name,
        activationLink: activationLink
    });

    return await this.generateTokens(user);
}
```

### 2. Вход (Login)

**Endpoint**: `POST /api/auth/login`

**Поток**:
1. Пользователь отправляет email и password
2. `AuthService.login()` проверяет пользователя:
   - Существует ли пользователь
   - Активирован ли аккаунт (`isAcivated`)
   - Правильный ли пароль
3. Генерируются токены
4. Токены сохраняются в cookies через `AuthCookieInterceptor`
5. Возвращается `AuthenticatedUserDto`

**Код**:
```typescript
public async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
        throw new UnauthorizedException('User not found');
    }
    if (!user.isAcivated) {
        throw new UnauthorizedException('User not activated');
    }

    const isPasswordValid = await this.userService.comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
    }

    return await this.generateTokens(new UserDto(user));
}
```

### 3. Подтверждение email (Activate)

**Endpoint**: `GET /api/auth/activate/:link`

**Поток**:
1. Пользователь переходит по ссылке из email
2. `AuthService.activate()` активирует пользователя по `activationLink`
3. Генерируются токены
4. Токены сохраняются в cookies
5. Пользователь автоматически авторизован

**Код**:
```typescript
public async activate(link: string) {
    const user = await this.userService.activateUser(link);
    return await this.generateTokens(user);
}
```

### 4. Обновление токена (Refresh)

**Endpoint**: `POST /api/auth/refresh`

**Поток**:
1. Frontend отправляет запрос (refresh token автоматически в cookie)
2. `AuthService.refreshToken()` получает refresh token из cookie
3. Валидируется refresh token через `TokenService`
4. Проверяется наличие токена в БД
5. Генерируются новые токены
6. Новые токены сохраняются в cookies
7. Возвращается `AuthenticatedUserDto`

**Код**:
```typescript
public async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Refresh token not found');
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await this.tokenService.findToken(userData?.userId || '');
    if (!tokenFromDb || !userData?.userId) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getUser(userData.userId);
    return await this.generateTokens(user);
}
```

### 5. Выход (Logout)

**Endpoint**: `GET /api/auth/logout`

**Поток**:
1. Удаляется refresh token из БД
2. Cookies очищаются
3. Возвращается `true`

**Код**:
```typescript
public async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
    return true;
}
```

## Работа с токенами

### TokenService

**Расположение**: `modules/token/token.service.ts`

**Методы**:
- `generateTokens(payload)` - генерация access и refresh токенов
- `validateAccessToken(token)` - валидация access token
- `validateRefreshToken(token)` - валидация refresh token
- `saveToken(userId, refreshToken)` - сохранение refresh token в БД
- `findToken(userId)` - поиск токена в БД
- `removeToken(refreshToken)` - удаление токена из БД

**Время жизни токенов**:
- Access token: 15 минут
- Refresh token: 30 дней

**Секреты**:
- Access token secret: `JWT_SECRET`
- Refresh token secret: `JWT_REFRESH_SECRET`

## Настройка Cookies

### CookieService

**Расположение**: `core/cookie/cookie.service.ts`

**Методы**:
- `setAccessToken(res, token)` - установка access token cookie
- `setRefreshToken(res, token)` - установка refresh token cookie
- `clearAuthCookies(res)` - очистка всех auth cookies
- `getRefreshToken(req)` - получение refresh token из cookie
- `getAccessToken(req)` - получение access token из cookie

### Настройки Cookies

```typescript
private getCookieOptions(maxAge?: 'access' | 'refresh'): CookieOptions {
    const domain = this.configService.get('CLIENT_DOMAIN');
    const isProd = this.isProd();

    const options: CookieOptions = {
        httpOnly: true,              // Недоступен из JavaScript
        secure: isProd,              // Только HTTPS в production
        sameSite: isProd ? 'none' : 'lax', // Защита от CSRF
        domain: isProd ? domain : 'localhost',
        path: '/'
    };

    if (maxAge) {
        options.maxAge = maxAge === 'access'
            ? 15 * 60 * 1000        // 15 минут
            : 30 * 24 * 60 * 60 * 1000 // 30 дней
    }
    return options;
}
```

**Параметры**:
- `httpOnly: true` - защита от XSS (JavaScript не может получить доступ)
- `secure: true` (в production) - только HTTPS
- `sameSite: 'none'` (в production) - для cross-origin запросов
- `domain` - домен для cookie
- `maxAge` - время жизни cookie

## Guards - Защита эндпоинтов

### AccessTokenGuard

**Расположение**: `core/guards/access-token.guard.ts`

**Назначение**: Проверяет наличие и валидность access token перед доступом к защищенным эндпоинтам.

**Как работает**:
1. Получает access token из заголовка `Authorization: Bearer <token>` или из cookie
2. Валидирует токен через `TokenService.validateAccessToken()`
3. Если токен валиден - добавляет `user` в `request`
4. Если токен невалиден - выбрасывает `UnauthorizedException`

**Использование**:
```typescript
// На уровне контроллера
@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {}

// На уровне метода
@Get()
@UseGuards(AccessTokenGuard)
async getProfile() {}
```

**Код**:
```typescript
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request & { user?: TokenPayloadDto }>();

        let accessToken: string | undefined;
        // 1) Берём из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            accessToken = authHeader.split(' ')[1];
        }

        // 2) fallback: берём из Cookies
        if (!accessToken && req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        if (!accessToken) {
            throw new UnauthorizedException('ACCESS_TOKEN_MISSING');
        }

        const user = await this.tokenService.validateAccessToken(accessToken);
        req.user = user; // Добавляем пользователя в request

        return true;
    }
}
```

## Decorators - Декораторы

### @CurrentUser()

**Расположение**: `core/decorators/auth/current-user.decorator.ts`

**Назначение**: Получает текущего авторизованного пользователя из request.

**Использование**:
```typescript
@Get()
async getProfile(@CurrentUser() user: TokenPayloadDto) {
    // user содержит { userId: string }
    return await this.service.getProfile(user.userId);
}

// Можно получить конкретное поле
@Get()
async getProfile(@CurrentUser('userId') userId: string) {
    return await this.service.getProfile(userId);
}
```

**Код**:
```typescript
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // Guard положил пользователя сюда
        return data ? user?.[data] : user;
    },
);
```

### @SetAuthCookie()

**Расположение**: `core/decorators/auth/set-auth-cookie.decorator.ts`

**Назначение**: Обертка над `AuthCookieInterceptor` для установки cookies с токенами.

**Использование**:
```typescript
@Post('login')
@SetAuthCookie() // Автоматически устанавливает cookies из response.tokens
async login(@Body() loginDto: LoginDto): Promise<AuthenticatedUserDto> {
    return await this.authService.login(loginDto);
}
```

## Interceptors - Перехватчики

### AuthCookieInterceptor

**Расположение**: `core/interceptors/auth-cookie.interceptor.ts`

**Назначение**: Автоматически устанавливает cookies с токенами из response.

**Как работает**:
1. Перехватывает response после выполнения метода
2. Проверяет наличие `data.tokens.accessToken` и `data.tokens.refreshToken`
3. Устанавливает cookies через `CookieService`
4. Удаляет `tokens` из response (чтобы не отправлять в body)

**Использование**:
```typescript
// Через декоратор
@Post('login')
@SetAuthCookie() // Использует AuthCookieInterceptor
async login() {}

// Напрямую
@Post('login')
@UseInterceptors(AuthCookieInterceptor)
async login() {}
```

**Код**:
```typescript
@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
    constructor(private cookieService: CookieService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            tap((data) => {
                if (data?.tokens?.accessToken) {
                    this.cookieService.setAccessToken(res, data.tokens.accessToken);
                }
                if (data?.tokens?.refreshToken) {
                    this.cookieService.setRefreshToken(res, data.tokens.refreshToken);
                }
                if (data?.tokens) {
                    delete data.tokens; // Удаляем из response
                }
            }),
        );
    }
}
```

## Получение Current User в запросах

### Как это работает?

1. **Guard проверяет токен** и добавляет `user` в `request`:
   ```typescript
   req.user = { userId: '...' };
   ```

2. **Декоратор @CurrentUser()** извлекает пользователя из request:
   ```typescript
   @Get()
   async getProfile(@CurrentUser() user: TokenPayloadDto) {
       // user = { userId: '...' }
   }
   ```

3. **Типизация** через `express.d.ts`:
   ```typescript
   // core/types/express.d.ts
   declare module 'express' {
       interface Request {
           user?: TokenPayloadDto;
       }
   }
   ```

## Отправка Email для подтверждения

### Как работает?

1. **Регистрация** вызывает `mailService.activationLink()`
2. **Задача добавляется в очередь Bull** (очередь `MAIL`)
3. **MailProcessor обрабатывает задачу**:
   - Генерирует HTML шаблон письма
   - Отправляет через SMTP (Nodemailer)
4. **Письмо содержит ссылку** вида: `https://api.sociopath-network.ru/api/auth/activate/{activationLink}`

**Код**:
```typescript
// modules/auth/services/auth.service.ts
await this.mailService.activationLink({
    email: user.email,
    name: user.name,
    activationLink: activationLink
});

// modules/mail/queue/mail.processor.ts
@Processor(QueueNames.MAIL)
export class MailProcessor {
    @Process('activation-link')
    async handleActivationLink(job: Job<EmailData>) {
        // Отправка email
    }
}
```

Подробнее см. [Документацию по очередям](./queues.md).

## Поток обновления токена (Refresh)

### На стороне Backend

1. **Запрос приходит** на `POST /api/auth/refresh`
2. **Refresh token извлекается из cookie** через `CookieService`
3. **Токен валидируется** через `TokenService.validateRefreshToken()`
4. **Проверяется наличие токена в БД** (чтобы убедиться, что он не был удален)
5. **Генерируются новые токены**
6. **Новые токены сохраняются в cookies**
7. **Возвращается новый `AuthenticatedUserDto`**

### На стороне Frontend

1. **Axios interceptor перехватывает 401 ошибку**
2. **Делает запрос на `/api/auth/refresh`** (refresh token автоматически в cookie)
3. **Получает новые токены** (автоматически в cookies)
4. **Повторяет оригинальный запрос**

Подробнее см. [Frontend документацию по Auth](../../frontend/docs/auth.md#axios-interceptor---автоматическое-обновление-токена).

## Безопасность

### Защита от XSS

- Токены хранятся в HttpOnly cookies → JavaScript не может получить доступ
- Даже если злоумышленник внедрит вредоносный код, он не сможет украсть токены

### Защита от CSRF

- `sameSite: 'none'` (в production) для cross-origin запросов
- `sameSite: 'lax'` (в development) для same-origin запросов

### Короткое время жизни access token

- Access token живет 15 минут
- При истечении автоматически обновляется через refresh token
- Если refresh token истек → пользователь должен войти заново

### Хранение refresh token в БД

- Refresh token сохраняется в БД при генерации
- При logout токен удаляется из БД
- При refresh проверяется наличие токена в БД

## Переменные окружения

```env
# JWT Secrets
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret

# URLs
APP_URL=https://api.sociopath-network.ru
CLIENT_URL=https://sociopath-network.ru
CLIENT_DOMAIN=sociopath-network.ru

# Mail (для отправки email)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email
MAIL_PASSWORD=your-password
```

## Ссылки

- [Swagger API Documentation](https://api.sociopath-network.ru/docs/api)
- [Frontend Auth Documentation](../../frontend/docs/auth.md)
