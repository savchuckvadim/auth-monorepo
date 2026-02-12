# Поддержка множественных refresh токенов (множественные сессии/устройства)

## Проблема

Текущая реализация системы аутентификации не поддерживает работу пользователя с нескольких устройств одновременно. При логине с нового устройства (например, React Native) старый refresh token из браузера инвалидируется, что приводит к ошибке "Refresh token not found" при попытке обновить токен на старом устройстве.

### Конкретная проблема пользователя

**Сценарий воспроизведения**:
1. **Пользователь логинится в браузере 1** → создается refresh token A, сохраняется в БД
2. **Пользователь логинится в браузере 2** → создается refresh token B, который **заменяет** токен A в БД (из-за `saveToken` который обновляет существующий)
3. **Пользователь разлогинивается с браузера 1** → удаляется refresh token B (так как в cookie браузера 1 может быть токен B после обновления страницы, или происходит путаница)
4. **Пользователь обновляет страницу в браузере 1** → frontend пытается обновить токен через `/api/auth/refresh` → получает ошибку `"Invalid refresh token"` (resultCode: 1)

**Дополнительные проблемы**:
- Logout не работает с первого раза (возможно, из-за проблем с cookie или асинхронности)
- После logout при обновлении страницы возникает ошибка "Invalid refresh token"
- Нет констант/enums для всех возможных ошибок аутентификации

### Текущее поведение

1. **Пользователь логинится в браузере** → создается refresh token A, сохраняется в БД
2. **Пользователь логинится в React Native** → создается refresh token B, который **заменяет** токен A в БД
3. **Браузер пытается обновить токен A** → токен не найден в БД → ошибка "Refresh token not found"
4. **React Native пытается обновить токен B** → если был еще один логин, токен тоже не найден

### Корневая причина

В текущей реализации:
- Таблица `tokens` хранит только **один** refresh token на пользователя (связь один-к-одному через `userId`)
- Метод `saveToken` в `TokenPrismaRepository` **обновляет** существующий токен вместо создания нового
- Метод `refreshToken` в `AuthService` ищет токен по `userId`, а не по самому `refreshToken`, что небезопасно
- Метод `logout` не проверяет существование токена перед удалением, что может привести к ошибкам
- Нет централизованных констант для всех ошибок аутентификации - используются строковые литералы

## Текущая архитектура

### База данных

**Схема Prisma** (`apps/api/prisma/schema.prisma`):
```prisma
model Token {
    id           String @id @default(uuid())
    userId       String @map("user_id") @db.VarChar(255)
    refreshToken String @map("refresh_token") @db.VarChar(255)

    createdAt DateTime? @default(now())
    updatedAt DateTime? @default(now())

    user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

    @@map("tokens")
}
```

**Проблема**: Нет уникального индекса на `refreshToken`, нет поддержки множественных токенов.

### Backend код

#### 1. TokenPrismaRepository (`apps/api/src/modules/token/token.prisma.repository.ts`)

**Текущая реализация `saveToken`**:
```typescript
async saveToken(userId: string, refreshToken: string): Promise<Token> {
    const tokenData = await this.prisma.token.findFirst({
        where: { userId },
    });
    if (tokenData) {
        // ❌ ПРОБЛЕМА: Обновляет существующий токен, заменяя старый
        return await this.prisma.token.update({
            where: { id: tokenData.id },
            data: { refreshToken },
        });
    }
    return await this.prisma.token.create({
        data: { userId, refreshToken },
    });
}
```

**Текущая реализация `findToken`**:
```typescript
async findToken(userId: string): Promise<Token | null> {
    // ❌ ПРОБЛЕМА: Ищет по userId, а не по самому refreshToken
    const token = await this.prisma.token.findFirst({
        where: { userId },
    });
    return token || null;
}
```

**Текущая реализация `removeToken`**:
```typescript
async removeToken(refreshToken: string): Promise<Token> {
    // ✅ Правильно: ищет по самому refreshToken
    const token = await this.prisma.token.findFirst({
        where: { refreshToken },
    });
    if (!token) {
        throw new NotFoundException('Token not found');
    }
    return await this.prisma.token.delete({
        where: { id: token.id },
    });
}
```

#### 2. AuthService (`apps/api/src/modules/auth/services/auth.service.ts`)

**Текущая реализация `refreshToken`**:
```typescript
public async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Refresh token not found');
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken);

    // ❌ ПРОБЛЕМА: Ищет токен по userId, а не по самому refreshToken
    const tokenFromDb = await this.tokenService.findToken(userData?.userId || '');
    if (!tokenFromDb || !userData?.userId) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Invalid refresh token');
    }

    // ❌ ПРОБЛЕМА: Не проверяет, что переданный токен совпадает с токеном в БД

    const user = await this.userService.getUser(userData.userId);
    return await this.generateTokens(user);
}
```

**Проблема**: Метод не проверяет, что переданный `refreshToken` совпадает с токеном в БД. Можно использовать любой валидный refresh token от этого пользователя.

#### 3. AuthController (`apps/api/src/modules/auth/controllers/auth.controller.ts`)

**Текущая реализация `logout`**:
```typescript
@Get('logout')
async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<boolean> {
    const refreshToken = this.cookieService.getRefreshToken(req);
    await this.authService.logout(refreshToken);
    this.cookieService.clearAuthCookies(res);
    return true;
}
```

**Текущая реализация `refreshToken`**:
```typescript
@Post('refresh')
async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthenticatedUserDto> {
    const refreshToken = this.cookieService.getRefreshToken(req);
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res);
        throw new UnauthorizedException('Refresh token not found');
    }
    const user = await this.authService.refreshToken(refreshToken, res);
    return user;
}
```

### Frontend код

**Axios Interceptor** (`packages/nest-api/src/lib/back-api.ts`):
```typescript
$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const isRefresh = error.response.request.responseURL.includes('auth/refresh');

    if (error.response.status === 401 && error.config && !isRefresh) {
        const originalRequest = error.config;
        try {
            const res = await $api.post('/api/auth/refresh');
            if (res.data.resultCode === EResultCode.SUCCESS) {
                return $api(originalRequest);
            }
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН');
        }
    }
    throw error;
});
```

**Особенность**: Refresh token автоматически отправляется в cookie благодаря `withCredentials: true`. Frontend не требует изменений, так как токены управляются через HttpOnly cookies.

## Решение

### 1. Изменения в базе данных

#### Шаг 1: Обновить схему Prisma

**Файл**: `apps/api/prisma/schema.prisma`

**Изменения**:
1. Убрать ограничение "один токен на пользователя"
2. Добавить уникальный индекс на `refreshToken` (чтобы один токен не мог быть использован дважды)
3. Добавить индекс на `userId` для быстрого поиска всех токенов пользователя
4. Опционально: добавить поля `deviceId`, `userAgent`, `ipAddress` для управления сессиями

**Новая схема**:
```prisma
model Token {
    id           String   @id @default(uuid())
    userId       String   @map("user_id") @db.VarChar(255)
    refreshToken String   @unique @map("refresh_token") @db.VarChar(255) // ✅ Уникальный индекс

    // Опционально: для управления сессиями
    deviceId     String?  @map("device_id") @db.VarChar(255)
    userAgent    String?  @map("user_agent") @db.VarChar(500)
    ipAddress    String?  @map("ip_address") @db.VarChar(45) // IPv6 max length

    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    expiresAt    DateTime @map("expires_at") // ✅ Для очистки истекших токенов

    user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

    @@index([userId]) // ✅ Для быстрого поиска всех токенов пользователя
    @@index([expiresAt]) // ✅ Для очистки истекших токенов
    @@map("tokens")
}
```

#### Шаг 2: Создать миграцию

```bash
cd apps/api
npx prisma migrate dev --name add_multiple_refresh_tokens
```

**Важно**: Перед миграцией нужно:
1. Удалить дубликаты токенов (если есть) - оставить только последний токен для каждого пользователя
2. Добавить `expiresAt` для существующих токенов (рассчитать на основе `createdAt` + 30 дней)

**SQL для подготовки данных** (выполнить перед миграцией):
```sql
-- Удалить дубликаты, оставить только последний токен для каждого пользователя
DELETE t1 FROM tokens t1
INNER JOIN tokens t2
WHERE t1.user_id = t2.user_id
  AND t1.created_at < t2.created_at;

-- Добавить expiresAt для существующих токенов (30 дней с момента создания)
UPDATE tokens
SET expires_at = DATE_ADD(created_at, INTERVAL 30 DAY)
WHERE expires_at IS NULL;
```

### 2. Изменения в Backend

#### Шаг 1: Обновить TokenRepository интерфейс

**Файл**: `apps/api/src/modules/token/token.repository.ts`

**Добавить методы**:
```typescript
export abstract class TokenRepository {
    abstract saveToken(userId: string, refreshToken: string, deviceId?: string, userAgent?: string, ipAddress?: string): Promise<Token>;
    abstract findToken(refreshToken: string): Promise<Token | null>; // ✅ Изменить: искать по refreshToken, а не userId
    abstract findTokenByUserId(userId: string): Promise<Token[]>; // ✅ Новый метод: найти все токены пользователя
    abstract removeToken(refreshToken: string): Promise<Token>;
    abstract removeAllUserTokens(userId: string): Promise<number>; // ✅ Новый метод: удалить все токены пользователя
    abstract removeExpiredTokens(): Promise<number>; // ✅ Новый метод: очистить истекшие токены
}
```

#### Шаг 2: Обновить TokenPrismaRepository

**Файл**: `apps/api/src/modules/token/token.prisma.repository.ts`

**Новая реализация**:
```typescript
@Injectable()
export class TokenPrismaRepository implements TokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveToken(
        userId: string,
        refreshToken: string,
        deviceId?: string,
        userAgent?: string,
        ipAddress?: string
    ): Promise<Token> {
        // ✅ Всегда создаем новый токен, не обновляем существующий
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 дней

        return await this.prisma.token.create({
            data: {
                userId,
                refreshToken,
                deviceId,
                userAgent,
                ipAddress,
                expiresAt,
            },
        });
    }

    async findToken(refreshToken: string): Promise<Token | null> {
        // ✅ Ищем по самому refreshToken
        const token = await this.prisma.token.findFirst({
            where: {
                refreshToken,
                expiresAt: {
                    gt: new Date(), // ✅ Проверяем, что токен не истек
                },
            },
        });
        return token || null;
    }

    async findTokenByUserId(userId: string): Promise<Token[]> {
        // ✅ Найти все активные токены пользователя
        return await this.prisma.token.findMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async removeToken(refreshToken: string): Promise<Token | null> {
        // ✅ Проверяем существование токена перед удалением
        const token = await this.prisma.token.findFirst({
            where: { refreshToken },
        });
        if (!token) {
            // ✅ Не выбрасываем ошибку, если токен уже удален (идемпотентность)
            return null;
        }
        return await this.prisma.token.delete({
            where: { id: token.id },
        });
    }

    async removeAllUserTokens(userId: string): Promise<number> {
        // ✅ Удалить все токены пользователя (например, при смене пароля)
        const result = await this.prisma.token.deleteMany({
            where: { userId },
        });
        return result.count;
    }

    async removeExpiredTokens(): Promise<number> {
        // ✅ Очистить истекшие токены (можно вызывать по cron)
        const result = await this.prisma.token.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }
}
```

#### Шаг 3: Обновить TokenService

**Файл**: `apps/api/src/modules/token/token.service.ts`

**Добавить методы**:
```typescript
@Injectable()
export class TokenService {
    // ... существующие методы ...

    public async saveToken(
        userId: string,
        refreshToken: string,
        deviceId?: string,
        userAgent?: string,
        ipAddress?: string
    ) {
        return await this.tokenRepository.saveToken(userId, refreshToken, deviceId, userAgent, ipAddress);
    }

    public async findToken(refreshToken: string) {
        // ✅ Изменить: искать по refreshToken, а не userId
        return await this.tokenRepository.findToken(refreshToken);
    }

    public async findTokenByUserId(userId: string) {
        return await this.tokenRepository.findTokenByUserId(userId);
    }

    public async removeToken(refreshToken: string) {
        // ✅ Возвращаем null если токен не найден (идемпотентность)
        return await this.tokenRepository.removeToken(refreshToken);
    }

    public async removeAllUserTokens(userId: string) {
        return await this.tokenRepository.removeAllUserTokens(userId);
    }

    public async removeExpiredTokens() {
        return await this.tokenRepository.removeExpiredTokens();
    }
}
```

#### Шаг 3.1: Обновить AuthService.logout

**Файл**: `apps/api/src/modules/auth/services/auth.service.ts`

**Обновить метод `logout`**:
```typescript
public async logout(refreshToken: string) {
    // ✅ Проверяем существование токена перед удалением
    if (!refreshToken) {
        // Если токена нет, просто возвращаем true (идемпотентность)
        return true;
    }

    // ✅ Удаляем токен (может вернуть null, если токен уже удален)
    await this.tokenService.removeToken(refreshToken);
    return true;
}
```

#### Шаг 4: Добавить константы ошибок

**Файл**: `apps/api/src/modules/token/token.type.ts`

**Обновить EnumAuthErrorCode**:
```typescript
export enum EnumAuthErrorCode {
    // Access Token ошибки
    ACCESS_TOKEN_MISSING = 'ACCESS_TOKEN_MISSING',
    ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
    ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
    ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR',

    // Refresh Token ошибки
    REFRESH_TOKEN_MISSING = 'REFRESH_TOKEN_MISSING',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
    REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
    REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR',

    // User ошибки
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_ACTIVATED = 'USER_NOT_ACTIVATED',
    INVALID_PASSWORD = 'INVALID_PASSWORD',

    // Token ошибки
    TOKEN_USER_MISMATCH = 'TOKEN_USER_MISMATCH',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
}

export enum EnumAuthSecrets {
    ACCESS_TOKEN = 'JWT_ACCESS_SECRET',
    REFRESH_TOKEN = 'JWT_REFRESH_SECRET',
}
```

#### Шаг 5: Обновить AuthService

**Файл**: `apps/api/src/modules/auth/services/auth.service.ts`

**Обновить метод `refreshToken`**:
```typescript
public async refreshToken(refreshToken: string, res: Response, req?: Request) {
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_MISSING);
    }

    // ✅ Валидируем токен
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    if (!userData?.userId) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_INVALID);
    }

    // ✅ Ищем токен в БД по самому refreshToken
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!tokenFromDb) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_NOT_FOUND);
    }

    // ✅ Проверяем, что токен не истек (дополнительная проверка)
    if (tokenFromDb.expiresAt && tokenFromDb.expiresAt < new Date()) {
        await this.tokenService.removeToken(refreshToken);
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_EXPIRED);
    }

    // ✅ Проверяем, что токен принадлежит правильному пользователю
    if (tokenFromDb.userId !== userData.userId) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Token user mismatch');
    }

    // ✅ Удаляем старый токен перед созданием нового (опционально, можно оставить оба)
    await this.tokenService.removeToken(refreshToken);

    // ✅ Генерируем новые токены
    const user = await this.userService.getUser(userData.userId);

    // ✅ Извлекаем информацию об устройстве из запроса (если нужно)
    const deviceId = req?.headers['x-device-id'] as string | undefined;
    const userAgent = req?.headers['user-agent'];
    const ipAddress = req?.ip || req?.socket.remoteAddress;

    return await this.generateTokens(user, deviceId, userAgent, ipAddress);
}
```

**Обновить метод `generateTokens`**:
```typescript
private async generateTokens(
    user: UserDto,
    deviceId?: string,
    userAgent?: string,
    ipAddress?: string
): Promise<AuthenticatedUserDto> {
    const tokens = this.tokenService.generateTokens({ userId: user.id });

    // ✅ Сохраняем новый токен с информацией об устройстве
    await this.tokenService.saveToken(
        user.id,
        tokens.refreshToken,
        deviceId,
        userAgent,
        ipAddress
    );

    const result: AuthenticatedUserDto = {
        tokens,
        user: user
    };
    return result;
}
```

**Обновить методы `login` и `registration`**:
```typescript
public async login(loginDto: LoginDto, req?: Request) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
        throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_FOUND);
    }
    if (!user.isAcivated) {
        throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_ACTIVATED);
    }

    const isPasswordValid = await this.userService.comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException(EnumAuthErrorCode.INVALID_PASSWORD);
    }

    // ✅ Передаем информацию об устройстве
    const deviceId = req?.headers['x-device-id'] as string | undefined;
    const userAgent = req?.headers['user-agent'];
    const ipAddress = req?.ip || req?.socket.remoteAddress;

    return await this.generateTokens(new UserDto(user), deviceId, userAgent, ipAddress);
}

public async registration(registerDto: CreateUserDto, req?: Request): Promise<AuthenticatedUserDto> {
    const user = await this.userService.createUser(registerDto);
    const baseUrl = this.configService.getOrThrow<string>('APP_URL');
    const activationLink = `${baseUrl}/api/auth/activate/${user.activationLink}`;

    await this.mailService.activationLink({
        email: user.email,
        name: user.name,
        activationLink: activationLink
    });

    // ✅ Передаем информацию об устройстве
    const deviceId = req?.headers['x-device-id'] as string | undefined;
    const userAgent = req?.headers['user-agent'];
    const ipAddress = req?.ip || req?.socket.remoteAddress;

    return await this.generateTokens(user, deviceId, userAgent, ipAddress);
}
```

#### Шаг 6: Обновить AuthController

**Файл**: `apps/api/src/modules/auth/controllers/auth.controller.ts`

**Обновить методы**:
```typescript
@Post('login')
async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request // ✅ Добавить Request для получения информации об устройстве
): Promise<AuthenticatedUserDto> {
    const user = await this.authService.login(loginDto, req);
    return user;
}

@Post('mobile/login')
async mobileLogin(
    @Body() loginDto: LoginDto,
    @Req() req: Request // ✅ Добавить Request
): Promise<AuthenticatedUserDto> {
    const user = await this.authService.login(loginDto, req);
    return user;
}

@Post('registration')
async registration(
    @Body() registerDto: CreateUserDto,
    @Req() req: Request // ✅ Добавить Request
): Promise<AuthenticatedUserDto> {
    return await this.authService.registration(registerDto, req);
}

@Post('refresh')
async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
): Promise<AuthenticatedUserDto> {
    const refreshToken = this.cookieService.getRefreshToken(req);
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res);
        throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_MISSING);
    }
    // ✅ Передаем Request в refreshToken
    const user = await this.authService.refreshToken(refreshToken, res, req);
    return user;
}

@Get('logout')
async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
): Promise<boolean> {
    const refreshToken = this.cookieService.getRefreshToken(req);
    // ✅ Logout идемпотентен - если токена нет, просто очищаем cookies
    await this.authService.logout(refreshToken);
    this.cookieService.clearAuthCookies(res);
    return true;
}
```

#### Шаг 7: Добавить задачу для очистки истекших токенов

**Файл**: `apps/api/src/modules/token/token-cleanup.service.ts` (новый файл)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from './token.service';

@Injectable()
export class TokenCleanupService {
    private readonly logger = new Logger(TokenCleanupService.name);

    constructor(private readonly tokenService: TokenService) {}

    @Cron(CronExpression.EVERY_DAY_AT_2AM) // Запускать каждый день в 2:00
    async handleCron() {
        this.logger.log('Starting expired tokens cleanup...');
        const deletedCount = await this.tokenService.removeExpiredTokens();
        this.logger.log(`Deleted ${deletedCount} expired tokens`);
    }
}
```

**Зарегистрировать в модуле** (`apps/api/src/modules/token/token.module.ts`):
```typescript
import { TokenCleanupService } from './token-cleanup.service';

@Module({
    // ...
    providers: [
        // ...
        TokenCleanupService,
    ],
})
export class TokenModule {}
```

**Важно**: Убедиться, что `@nestjs/schedule` установлен и импортирован в `AppModule`:
```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        // ...
        ScheduleModule.forRoot(),
    ],
})
export class AppModule {}
```

#### Шаг 8: Обновить все места использования строковых ошибок

**Найти и заменить все строковые литералы на константы из `EnumAuthErrorCode`**:

**Файл**: `apps/api/src/modules/auth/services/auth.service.ts`
```typescript
import { EnumAuthErrorCode } from '@/modules/token/token.type';

// Заменить:
// throw new UnauthorizedException('User not found');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_FOUND);

// Заменить:
// throw new UnauthorizedException('User not activated');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_ACTIVATED);

// Заменить:
// throw new UnauthorizedException('Invalid password');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.INVALID_PASSWORD);
```

**Файл**: `apps/api/src/modules/auth/controllers/auth.controller.ts`
```typescript
import { EnumAuthErrorCode } from '@/modules/token/token.type';

// Заменить все строковые ошибки на константы
```

### 3. Изменения на Frontend

**Frontend не требует изменений**, так как:
- Refresh token автоматически отправляется в cookie через `withCredentials: true`
- Axios interceptor уже корректно обрабатывает refresh токены
- HttpOnly cookies работают одинаково для всех устройств

**Опционально**: Если нужно отслеживать устройства на фронтенде, можно добавить заголовок `x-device-id`:

**Файл**: `packages/nest-api/src/lib/back-api.ts`

```typescript
// ✅ Опционально: добавить deviceId в заголовки
const getDeviceId = (): string => {
    if (typeof window !== 'undefined') {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }
    return '';
};

const $api = axios.create({
    baseURL: url,
    withCredentials: true,
    headers: {
        ...headers,
        'x-device-id': getDeviceId(), // ✅ Опционально
    },
});
```

## Взаимосвязи и зависимости

### Поток аутентификации

1. **Логин/Регистрация**:
   ```
   Client → POST /api/auth/login
   → AuthController.login()
   → AuthService.login()
   → TokenService.generateTokens()
   → TokenService.saveToken() → TokenPrismaRepository.saveToken()
   → Prisma: CREATE новый токен в БД
   → Возврат токенов клиенту
   ```

2. **Refresh Token**:
   ```
   Client → POST /api/auth/refresh (с refreshToken в cookie)
   → AuthController.refreshToken()
   → AuthService.refreshToken()
   → TokenService.validateRefreshToken() (валидация JWT)
   → TokenService.findToken(refreshToken) → TokenPrismaRepository.findToken(refreshToken)
   → Prisma: FIND токен по refreshToken (не по userId!)
   → Проверка: токен существует, не истек, принадлежит правильному пользователю
   → TokenService.removeToken() (удаляем старый)
   → TokenService.generateTokens() → создаем новый
   → TokenService.saveToken() → сохраняем новый в БД
   → Возврат новых токенов клиенту
   ```

3. **Logout**:
   ```
   Client → GET /api/auth/logout (с refreshToken в cookie)
   → AuthController.logout()
   → AuthService.logout()
   → TokenService.removeToken(refreshToken) → TokenPrismaRepository.removeToken(refreshToken)
   → Prisma: DELETE токен по refreshToken
   → Очистка cookies
   ```

### Зависимости модулей

```
AuthModule
  ├── TokenModule
  │     ├── TokenService
  │     ├── TokenRepository (интерфейс)
  │     └── TokenPrismaRepository (реализация)
  ├── UserModule
  ├── MailModule
  └── CookieService (Core)
```

## Тестирование

### Сценарии для проверки

1. **Множественные сессии**:
   - Логин в браузере → получить токен A
   - Логин в React Native → получить токен B
   - Обновить токен A в браузере → должно работать
   - Обновить токен B в React Native → должно работать

2. **Безопасность**:
   - Попытка использовать истекший токен → должна вернуть ошибку
   - Попытка использовать токен другого пользователя → должна вернуть ошибку
   - Попытка использовать несуществующий токен → должна вернуть ошибку

3. **Logout**:
   - Logout в браузере → удаляется только токен A
   - Токен B в React Native → должен продолжать работать

4. **Очистка истекших токенов**:
   - Создать токен с истекшим `expiresAt`
   - Запустить cleanup задачу
   - Проверить, что токен удален

## Чеклист выполнения

### Backend

- [ ] Обновить схему Prisma (`schema.prisma`)
  - [ ] Добавить `@@unique` на `refreshToken`
  - [ ] Добавить `@@index` на `userId` и `expiresAt`
  - [ ] Добавить поля `deviceId`, `userAgent`, `ipAddress`, `expiresAt` (опционально)
- [ ] Создать и применить миграцию
  - [ ] Подготовить данные (удалить дубликаты, добавить `expiresAt`)
  - [ ] Запустить `prisma migrate dev`
- [ ] Обновить `TokenRepository` интерфейс
  - [ ] Изменить сигнатуру `findToken` (по `refreshToken`, а не `userId`)
  - [ ] Добавить методы `findTokenByUserId`, `removeAllUserTokens`, `removeExpiredTokens`
- [ ] Обновить `TokenPrismaRepository`
  - [ ] Изменить `saveToken` (всегда создавать новый токен)
  - [ ] Изменить `findToken` (искать по `refreshToken`)
  - [ ] Реализовать новые методы
- [ ] Обновить `TokenService`
  - [ ] Обновить методы для работы с новой логикой
- [ ] Обновить `AuthService`
  - [ ] Изменить `refreshToken` (проверка по `refreshToken`, валидация)
  - [ ] Обновить `generateTokens`, `login`, `registration` (передача информации об устройстве)
- [ ] Обновить `AuthController`
  - [ ] Добавить `@Req() req: Request` в методы для получения информации об устройстве
- [ ] Добавить `TokenCleanupService` (опционально)
  - [ ] Создать сервис для очистки истекших токенов
  - [ ] Настроить cron задачу
- [ ] Обновить тесты (если есть)
- [ ] Обновить документацию (`documentation/backend/docs/auth.md`)

### Frontend

- [ ] Проверить, что refresh token interceptor работает корректно
- [ ] Опционально: добавить `x-device-id` заголовок в axios
- [ ] Обновить обработку ошибок для новых кодов ошибок из `EnumAuthErrorCode`

### База данных

- [ ] Проверить, что миграция применена успешно
- [ ] Проверить индексы в БД
- [ ] Проверить, что старые токены имеют `expiresAt`

## Дополнительные улучшения (опционально)

1. **Управление сессиями**: Добавить endpoint для просмотра всех активных сессий пользователя
2. **Удаление сессий**: Добавить endpoint для удаления конкретной сессии по `deviceId`
3. **Ограничение сессий**: Ограничить количество одновременных сессий (например, максимум 5)
4. **Уведомления**: Отправлять уведомление пользователю при логине с нового устройства
5. **Логирование**: Добавить логирование всех операций с токенами для отладки

## Решение проблемы с logout

### Проблема
После logout при обновлении страницы возникает ошибка "Invalid refresh token". Это происходит потому что:
1. При logout удаляется токен из БД
2. При обновлении страницы frontend пытается обновить токен через `/api/auth/refresh`
3. Токен уже удален → ошибка "Invalid refresh token"

### Решение
1. **Идемпотентность logout**: Если токен уже удален, не выбрасывать ошибку
2. **Проверка существования токена**: В `removeToken` возвращать `null` если токен не найден
3. **Очистка cookies**: Всегда очищать cookies при logout, даже если токен не найден
4. **Обработка на frontend**: При получении ошибки "Invalid refresh token" после logout, перенаправлять на страницу логина

## Связанные файлы

### Backend
- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/token/token.repository.ts`
- `apps/api/src/modules/token/token.prisma.repository.ts`
- `apps/api/src/modules/token/token.service.ts`
- `apps/api/src/modules/auth/services/auth.service.ts`
- `apps/api/src/modules/auth/controllers/auth.controller.ts`
- `apps/api/src/modules/token/token.module.ts`

### Frontend
- `packages/nest-api/src/lib/back-api.ts` (опциональные изменения)

### Документация
- `documentation/backend/docs/auth.md` (обновить после реализации)

## Решение проблемы с logout и "Invalid refresh token"

### Проблема

**Сценарий воспроизведения**:
1. Пользователь логинится в браузере 1 → создается refresh token A
2. Пользователь логинится в браузере 2 → создается refresh token B (заменяет токен A в БД)
3. Пользователь разлогинивается с браузера 1 → удаляется refresh token B (так как в cookie браузера 1 может быть токен B после обновления страницы)
4. Пользователь обновляет страницу в браузере 1 → frontend пытается обновить токен через `/api/auth/refresh` → получает ошибку `"Invalid refresh token"` (resultCode: 1)

**Дополнительные проблемы**:
- Logout не работает с первого раза (возможно, из-за проблем с cookie или асинхронности)
- После logout при обновлении страницы возникает ошибка "Invalid refresh token"
- Нет констант/enums для всех возможных ошибок аутентификации

### Решение

#### 1. Идемпотентность logout

**Проблема**: Если токен уже удален или не существует, `removeToken` выбрасывает ошибку `NotFoundException`.

**Решение**: Изменить `removeToken` чтобы возвращать `null` если токен не найден (идемпотентность):

```typescript
// apps/api/src/modules/token/token.prisma.repository.ts
async removeToken(refreshToken: string): Promise<Token | null> {
    const token = await this.prisma.token.findFirst({
        where: { refreshToken },
    });
    if (!token) {
        // ✅ Не выбрасываем ошибку, если токен уже удален (идемпотентность)
        return null;
    }
    return await this.prisma.token.delete({
        where: { id: token.id },
    });
}
```

#### 2. Обновить AuthService.logout

**Проблема**: `logout` не обрабатывает случай, когда токен уже удален.

**Решение**: Сделать logout идемпотентным:

```typescript
// apps/api/src/modules/auth/services/auth.service.ts
public async logout(refreshToken: string) {
    // ✅ Проверяем существование токена перед удалением
    if (!refreshToken) {
        // Если токена нет, просто возвращаем true (идемпотентность)
        return true;
    }

    // ✅ Удаляем токен (может вернуть null, если токен уже удален)
    await this.tokenService.removeToken(refreshToken);
    return true;
}
```

#### 3. Обновить AuthController.logout

**Проблема**: При logout не всегда очищаются cookies, если токен не найден.

**Решение**: Всегда очищать cookies при logout:

```typescript
// apps/api/src/modules/auth/controllers/auth.controller.ts
@Get('logout')
async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
): Promise<boolean> {
    const refreshToken = this.cookieService.getRefreshToken(req);
    // ✅ Logout идемпотентен - если токена нет, просто очищаем cookies
    await this.authService.logout(refreshToken);
    this.cookieService.clearAuthCookies(res);
    return true;
}
```

#### 4. Добавить константы ошибок

**Проблема**: Используются строковые литералы для ошибок, нет централизованного управления.

**Решение**: Расширить `EnumAuthErrorCode` всеми возможными ошибками:

```typescript
// apps/api/src/modules/token/token.type.ts
export enum EnumAuthErrorCode {
    // Access Token ошибки
    ACCESS_TOKEN_MISSING = 'ACCESS_TOKEN_MISSING',
    ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
    ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
    ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR',

    // Refresh Token ошибки
    REFRESH_TOKEN_MISSING = 'REFRESH_TOKEN_MISSING',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
    REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
    REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR',

    // User ошибки
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_ACTIVATED = 'USER_NOT_ACTIVATED',
    INVALID_PASSWORD = 'INVALID_PASSWORD',

    // Token ошибки
    TOKEN_USER_MISMATCH = 'TOKEN_USER_MISMATCH',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
}
```

#### 5. Заменить все строковые ошибки на константы

**Файл**: `apps/api/src/modules/auth/services/auth.service.ts`

```typescript
import { EnumAuthErrorCode } from '@/modules/token/token.type';

// Заменить:
// throw new UnauthorizedException('User not found');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_FOUND);

// Заменить:
// throw new UnauthorizedException('User not activated');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.USER_NOT_ACTIVATED);

// Заменить:
// throw new UnauthorizedException('Invalid password');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.INVALID_PASSWORD);

// Заменить:
// throw new UnauthorizedException('Refresh token not found');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_MISSING);

// Заменить:
// throw new UnauthorizedException('Invalid refresh token');
// на:
throw new UnauthorizedException(EnumAuthErrorCode.REFRESH_TOKEN_INVALID);
```

**Файл**: `apps/api/src/modules/auth/controllers/auth.controller.ts`

```typescript
import { EnumAuthErrorCode } from '@/modules/token/token.type';

// Заменить все строковые ошибки на константы
```

### Тестирование решения

1. **Логин с двух браузеров**:
   - Логин в браузере 1 → должен работать
   - Логин в браузере 2 → должен работать
   - Оба токена должны существовать в БД

2. **Logout**:
   - Logout в браузере 1 → должен удалить только токен браузера 1
   - Logout в браузере 2 → должен удалить только токен браузера 2
   - Повторный logout → не должен выбрасывать ошибку (идемпотентность)

3. **Обновление страницы после logout**:
   - После logout обновить страницу → должен перенаправить на страницу логина
   - Не должно быть ошибки "Invalid refresh token"

4. **Обработка ошибок**:
   - Все ошибки должны использовать константы из `EnumAuthErrorCode`
   - Frontend должен корректно обрабатывать все коды ошибок

## Решение проблемы на Frontend

### Проблема

**Сценарий**:
1. Пользователь разлогинивается → токены удаляются из БД, cookies очищаются
2. Пользователь обновляет страницу → middleware видит отсутствие токенов → редирект на `/auth/login` ✅
3. **НО**: Если cookies не очистились полностью или остались старые токены:
   - Middleware видит токены в cookies → пропускает на защищенную страницу
   - Страница загружается и делает запрос к API
   - API возвращает 401 (токен невалидный)
   - Axios interceptor пытается refresh → получает ошибку "Invalid refresh token"
   - **ПРОБЛЕМА**: Interceptor просто выбрасывает ошибку, НЕ ДЕЛАЕТ РЕДИРЕКТ на `/auth/login`
   - Пользователь остается на странице с ошибкой

### Корневая причина

1. **Axios Interceptor** (`packages/nest-api/src/lib/back-api.ts`):
   - При ошибке refresh просто логирует "НЕ АВТОРИЗОВАН" и выбрасывает ошибку
   - НЕ ДЕЛАЕТ РЕДИРЕКТ на `/auth/login`
   - НЕ ОЧИЩАЕТ cookies

2. **Next.js Middleware** (`apps/front/middleware.ts`):
   - Проверяет только наличие токенов в cookies (не валидность!)
   - Если токены есть → пропускает на защищенную страницу
   - НО токены могут быть невалидными (удалены из БД после logout)

### Решение

#### Шаг 1: Обновить Axios Interceptor

**Файл**: `packages/nest-api/src/lib/back-api.ts`

**Проблема**: При ошибке refresh interceptor не делает редирект и не очищает cookies.

**Решение**: Добавить редирект и очистку cookies при ошибке refresh:

```typescript
import { AUTH_ACCESS_TOKEN_NAME_PUBLIC, AUTH_REFRESH_TOKEN_NAME_PUBLIC } from './consts/auth.consts';

$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Проверяем, что это не запрос на refresh
        const isRefresh = error.response?.request?.responseURL?.includes('auth/refresh');

        // Если получили 401 и это не запрос на refresh
        if (error.response?.status === 401 && error.config && !isRefresh) {
            const originalRequest = error.config;

            try {
                // Пытаемся обновить токен
                const res = await $api.post('/api/auth/refresh');

                if (res.data.resultCode === EResultCode.SUCCESS) {
                    // Повторяем оригинальный запрос
                    return $api(originalRequest);
                }
            } catch (refreshError) {
                // ✅ Ошибка refresh - токен невалидный или истек
                console.log('НЕ АВТОРИЗОВАН - токен невалидный');

                // ✅ Очищаем cookies на клиенте
                if (typeof document !== 'undefined') {
                    // Удаляем cookies
                    document.cookie = `${AUTH_ACCESS_TOKEN_NAME_PUBLIC}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    document.cookie = `${AUTH_REFRESH_TOKEN_NAME_PUBLIC}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

                    // ✅ Редирект на страницу логина
                    window.location.href = '/auth/login';
                }

                // Выбрасываем ошибку, чтобы компоненты могли обработать
                throw refreshError;
            }
        }

        // ✅ Если это ошибка refresh (401 на /auth/refresh)
        if (error.response?.status === 401 && isRefresh) {
            console.log('Ошибка refresh токена - редирект на логин');

            // ✅ Очищаем cookies на клиенте
            if (typeof document !== 'undefined') {
                document.cookie = `${AUTH_ACCESS_TOKEN_NAME_PUBLIC}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${AUTH_REFRESH_TOKEN_NAME_PUBLIC}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

                // ✅ Редирект на страницу логина
                window.location.href = '/auth/login';
            }
        }

        throw error;
    }
);
```

**Альтернативное решение** (более чистое): Создать утилиту для очистки cookies и редиректа:

**Файл**: `packages/nest-api/src/lib/auth-utils.ts` (новый файл)

```typescript
import { AUTH_ACCESS_TOKEN_NAME_PUBLIC, AUTH_REFRESH_TOKEN_NAME_PUBLIC } from '../consts/auth.consts';

/**
 * Очищает auth cookies и редиректит на страницу логина
 */
export const clearAuthAndRedirect = () => {
    if (typeof document === 'undefined') {
        return; // SSR
    }

    // Очищаем cookies
    const cookieOptions = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `${AUTH_ACCESS_TOKEN_NAME_PUBLIC}=; ${cookieOptions}`;
    document.cookie = `${AUTH_REFRESH_TOKEN_NAME_PUBLIC}=; ${cookieOptions}`;

    // Редирект на страницу логина
    window.location.href = '/auth/login';
};
```

**Обновить interceptor**:

```typescript
import { clearAuthAndRedirect } from './auth-utils';

$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isRefresh = error.response?.request?.responseURL?.includes('auth/refresh');

        if (error.response?.status === 401 && error.config && !isRefresh) {
            const originalRequest = error.config;

            try {
                const res = await $api.post('/api/auth/refresh');
                if (res.data.resultCode === EResultCode.SUCCESS) {
                    return $api(originalRequest);
                }
            } catch (refreshError) {
                // ✅ Ошибка refresh - очищаем cookies и редиректим
                clearAuthAndRedirect();
                throw refreshError;
            }
        }

        // ✅ Если это ошибка refresh (401 на /auth/refresh)
        if (error.response?.status === 401 && isRefresh) {
            clearAuthAndRedirect();
        }

        throw error;
    }
);
```

#### Шаг 2: Улучшить Middleware (опционально)

**Проблема**: Middleware проверяет только наличие токенов, а не их валидность.

**Решение**: Можно добавить проверку валидности токенов, но это требует запроса к API, что может замедлить middleware.

**Альтернатива**: Middleware остается как есть (проверяет только наличие), а валидация происходит на уровне API и обрабатывается через interceptor.

**Файл**: `apps/front/middleware.ts` (без изменений, но можно добавить комментарий):

```typescript
export async function middleware(req: NextRequest) {
    const accessToken = await req.cookies.get(AUTH_ACCESS_TOKEN_NAME_PUBLIC);
    const refreshToken = await req.cookies.get(AUTH_REFRESH_TOKEN_NAME_PUBLIC);

    const hasToken = accessToken || refreshToken;
    // ⚠️ ВАЖНО: Middleware проверяет только наличие токенов, не валидность
    // Валидация происходит на уровне API и обрабатывается через axios interceptor

    // ... остальной код
}
```

#### Шаг 3: Обработка ошибок в компонентах (опционально)

Если нужно обрабатывать ошибки аутентификации в компонентах:

**Файл**: `apps/front/modules/shared/lib/hooks/useAuthError.ts` (новый файл)

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthAndRedirect } from '@workspace/nest-api';

export const useAuthError = (error: Error | null) => {
    const router = useRouter();

    useEffect(() => {
        if (error && error.message?.includes('Invalid refresh token')) {
            clearAuthAndRedirect();
        }
    }, [error]);
};
```

### Тестирование решения на Frontend

1. **Logout и обновление страницы**:
   - Logout → cookies должны очиститься
   - Обновить страницу → должен быть редирект на `/auth/login`
   - Не должно быть ошибки "Invalid refresh token" на странице

2. **Ошибка refresh токена**:
   - Удалить токен из БД вручную
   - Обновить страницу → должен быть редирект на `/auth/login`
   - Cookies должны быть очищены

3. **Ошибка при запросе с невалидным токеном**:
   - Сделать запрос с невалидным токеном
   - Interceptor должен попытаться refresh
   - При ошибке refresh → должен быть редирект на `/auth/login`
   - Cookies должны быть очищены

### Чеклист для Frontend

- [ ] Обновить axios interceptor для редиректа при ошибке refresh
- [ ] Добавить очистку cookies при ошибке refresh
- [ ] Создать утилиту `clearAuthAndRedirect` (опционально, но рекомендуется)
- [ ] Протестировать сценарий logout → обновление страницы
- [ ] Протестировать сценарий с невалидным токеном
- [ ] Убедиться, что редирект работает корректно
