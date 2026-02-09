# Поддержка множественных refresh токенов (множественные сессии/устройства)

## Проблема

Текущая реализация системы аутентификации не поддерживает работу пользователя с нескольких устройств одновременно. При логине с нового устройства (например, React Native) старый refresh token из браузера инвалидируется, что приводит к ошибке "Refresh token not found" при попытке обновить токен на старом устройстве.

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

    async removeToken(refreshToken: string): Promise<Token> {
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

    public async removeAllUserTokens(userId: string) {
        return await this.tokenRepository.removeAllUserTokens(userId);
    }

    public async removeExpiredTokens() {
        return await this.tokenRepository.removeExpiredTokens();
    }
}
```

#### Шаг 4: Обновить AuthService

**Файл**: `apps/api/src/modules/auth/services/auth.service.ts`

**Обновить метод `refreshToken`**:
```typescript
public async refreshToken(refreshToken: string, res: Response, req?: Request) {
    if (!refreshToken) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Refresh token not found');
    }

    // ✅ Валидируем токен
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    if (!userData?.userId) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Invalid refresh token');
    }

    // ✅ Ищем токен в БД по самому refreshToken
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!tokenFromDb) {
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Refresh token not found');
    }

    // ✅ Проверяем, что токен не истек (дополнительная проверка)
    if (tokenFromDb.expiresAt && tokenFromDb.expiresAt < new Date()) {
        await this.tokenService.removeToken(refreshToken);
        this.cookieService.clearAuthCookies(res as Response);
        throw new UnauthorizedException('Refresh token expired');
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
        throw new UnauthorizedException('User not found');
    }
    if (!user.isAcivated) {
        throw new UnauthorizedException('User not activated');
    }

    const isPasswordValid = await this.userService.comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
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

#### Шаг 5: Обновить AuthController

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
        throw new UnauthorizedException('Refresh token not found');
    }
    // ✅ Передаем Request в refreshToken
    const user = await this.authService.refreshToken(refreshToken, res, req);
    return user;
}
```

#### Шаг 6: Добавить задачу для очистки истекших токенов (опционально)

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

### База данных

- [ ] Проверить, что миграция применена успешно
- [ ] Проверить индексы в БД
- [ ] Проверить, что старые токены имеют `expiresAt`

## Дополнительные улучшения (опционально)

1. **Управление сессиями**: Добавить endpoint для просмотра всех активных сессий пользователя
2. **Удаление сессий**: Добавить endpoint для удаления конкретной сессии по `deviceId`
3. **Ограничение сессий**: Ограничить количество одновременных сессий (например, максимум 5)
4. **Уведомления**: Отправлять уведомление пользователю при логине с нового устройства

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
