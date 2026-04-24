## Статус

**Реализовано:** множественные refresh-токены (несколько одновременных сессий / устройств), ротация с reuse-detection, атомарный claim против гонок, идемпотентный logout, суточная чистка истёкших токенов с batched delete и Redis-локом, контекст устройства (`deviceId` / `userAgent` / `ipAddress`) в записи токена. Клиентская часть: зеркальный `EnumAuthErrorCode` в `packages/nest-api` и `sociopath/mobile`, передача `x-device-id`, single-flight дедуп refresh'ей на мобильном.

Связанные follow-ups и риски: **[multiple-refresh-tokens-followups](./multiple-refresh-tokens-followups.md)**.
Фронт (web + middleware): **[Frontend multi-session auth](../../frontend/tasks/multiple-refresh-tokens.md)**.

## Архитектура

### Схема БД

Таблица `tokens` (`apps/api/prisma/schema.prisma`):

- `refreshToken` — `VARCHAR(512)`, `@unique`. Один и тот же токен не может повториться в БД — это дополнительная защита от коллизий и основа для атомарного claim.
- `userId` — индекс, позволяет быстро подтянуть все активные сессии пользователя и массово их ревокнуть.
- `expiresAt` — индекс, используется в проверке на истекшесть и в cron-чистке.
- `deviceId` / `userAgent` / `ipAddress` — метаданные сессии (nullable). Заполняются из заголовков запроса.
- `createdAt` / `updatedAt` — `DateTime` NOT NULL (старая схема имела nullable).

Миграция `20260424092832_add_multiple_refresh_tokens`: предварительная дедупликация дублей по `refresh_token`, добавление новых столбцов nullable, backfill `expires_at = createdAt + 30d`, подъём `NOT NULL`, индексы.

### Repository (`apps/api/src/modules/token/token.prisma.repository.ts`)

Методы `TokenRepository`:

- `saveToken(input)` — всегда `create` (не `update`), с метаданными устройства и явным `expiresAt`.
- `findTokenByRefreshToken` — по самому значению токена (не по userId).
- `findTokensByUserId` — все активные (`expiresAt > now`) токены пользователя.
- `removeToken` — идемпотентное удаление через `deleteMany`, не бросает `P2025` при отсутствии записи.
- `claimRefreshToken` — **атомарная заявка на ротацию**: `deleteMany where refreshToken=X`, возвращает `true` только тому параллельному вызову, чей DELETE зацепил строку (`count === 1`). Все конкуренты получают `false`.
- `removeAllUserTokens` — глобальный выход со всех устройств.
- `removeExpiredTokens(batchSize=1000)` — чанковое удаление; не держит длинный lock на больших таблицах.

### Service (`apps/api/src/modules/token/token.service.ts`)

- TTL: `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` с дефолтами `15m` / `30d` через `AUTH_DEFAULT_TTL`.
- `parseDurationToMs` (`src/lib/utils/duration.util.ts`) — общий парсер `ms / s / m / h / d / w`, ранее хардкод был в `CookieService`.
- `getAccessTtlMs` / `getRefreshTtlMs` / `getRefreshExpiresAt` — единая точка расчёта.
- `validateAccessToken` / `validateRefreshToken` — маппят `TokenExpiredError` / `JsonWebTokenError` в соответствующие коды `EnumAuthErrorCode`, вместо свободных строк.
- `claimRefreshToken` проксирует одноимённый метод репозитория.

### AuthService.refreshToken (ротация + reuse-detection)

Цепочка проверок в `apps/api/src/modules/auth/services/auth.service.ts`:

1. `refreshToken` отсутствует → `REFRESH_TOKEN_MISSING` + clear cookies.
2. `validateRefreshToken` — JWT-валидность (подпись, срок). При неудаче удаляем запись и бросаем соответствующий код.
3. `findTokenByRefreshToken` — запись в БД.
   - **Если JWT валиден, но записи нет** → это признак повторного использования ранее ротированного токена (украли). По рекомендации OAuth 2.0 RFC 6749 §10.4 вызываем `removeAllUserTokens(userId)` и отдаём `REFRESH_TOKEN_NOT_FOUND`. Все устройства пользователя выходят.
4. Owner check: если `record.userId !== jwtPayload.userId` — компрометация, чистим сессии обоих пользователей, `TOKEN_USER_MISMATCH`.
5. DB-level TTL: если `record.expiresAt < now` — запись удаляется, `REFRESH_TOKEN_EXPIRED`.
6. **Атомарный claim**: `claimRefreshToken(refreshToken)`. Только один из конкурирующих параллельных запросов получит `true`; остальные получают `false` и падают в ту же ветку reuse-detection, что и п.3.
7. Генерируем новую пару и сохраняем с `context` (deviceId/userAgent/ip).

### Контроллеры

`AuthController` и `AuthMobileController` принимают `@Req() req` и прокидывают `resolveAuthRequestInfo(req)` в сервис. Logout идемпотентен: `authService.logout` ничего не бросает, если токен отсутствует или уже удалён. Все `throw new UnauthorizedException(...)` используют `EnumAuthErrorCode`, свободных строк нет.

### Утилиты

`apps/api/src/lib/auth/utils/get-device-id.util.ts`:

- `DEVICE_ID_HEADER = 'x-device-id'` (+ регистронезависимый фолбэк).
- `resolveDeviceIdFromHeaders` / `resolveUserAgentFromHeaders` / `resolveIpFromRequest`.
- `resolveAuthRequestInfo(req)` — агрегатор, используется в контроллерах.

`apps/api/src/lib/utils/duration.util.ts`:

- `parseDurationToMs(input, fallback)` — единый парсер, чистые числа трактуются как миллисекунды.

### Cleanup (`apps/api/src/modules/token/token-cleanup.service.ts`)

- `@Cron(CronExpression.EVERY_DAY_AT_2AM)` в `TokenModule` (`ScheduleModule.forRoot()` уже в `AppModule`).
- **Redis distributed lock** (`locks:token-cleanup`, TTL 10 мин, `SET NX EX`): при нескольких инстансах API лок берёт только первый успевший. Если Redis недоступен — fail-open (лучше дважды почистить, чем никогда).
- Внутри — `TokenService.removeExpiredTokens()`, которая делает batched delete пачками по 1000, чтобы не держать длинную транзакцию.

### Trust proxy

`apps/api/src/main.ts` типизирован через `NestFactory.create<NestExpressApplication>`, вызван `app.set('trust proxy', 1)`. Без этого за nginx/Cloudflare `req.ip` равен IP прокси, а `x-forwarded-for` можно подделать браузером — IP/UA сессий были бы неинформативны.

### Мобильный клиент (orval-регенерация + сопровождение)

- `sociopath/mobile/app/api/lib/auth/auth-errors.const.ts` — зеркальный `EnumAuthErrorCode` + `isTokenError` (unrecoverable refresh-коды и локальные клиентские `No refresh token` / `Refresh token not found`).
- `sociopath/mobile/app/api/lib/auth/device-id.api.ts` — стабильный `deviceId` (`${platform}-${uuidv4()}`) в `SecureStore`, in-memory single-flight промис при первом создании.
- `with-token.interceptor.ts` — приклеивает `Authorization: Bearer ...` + `x-device-id` ко всем запросам.
- `refresh.interceptor.ts` — **single-flight дедупликация**: все одновременные 401 ждут один и тот же `getNewTokens()` и только потом ретраят свой исходный запрос. Без этого 5 одновременных 401 вызвали бы 5 refresh'ей, из которых после атомарного claim на сервере только один выиграл бы, а остальные выкинули бы залогиненного пользователя.

### Web-клиент

- `packages/nest-api/src/lib/auth-errors.const.ts` — зеркальный `EnumAuthErrorCode` + `isRefreshAuthError` / `isAuthError`, экспорт из `packages/nest-api/index.ts`.
- Axios-interceptor и `dispatchAuthSessionExpired` намеренно оставлены без хард-редиректа: при неудачном refresh бэкенд сам чистит серверные cookies, а Next.js middleware (`apps/front/middleware.ts`) на следующем навигационном запросе отправит пользователя в `/auth/login`. `/start` — публичный маршрут, и принудительный `window.location.href` из интерцептора ломал бы его UX.

## Потоки

**Login / Registration**

```
Client → POST /api/auth/(login|registration)
→ AuthController: resolveAuthRequestInfo(req) → AuthService
→ TokenService.generateTokens + saveToken(refreshToken, expiresAt, device context)
→ Prisma: INSERT новая строка в tokens (CREATE, не UPDATE)
→ Web: HttpOnly cookies через CookieService. Mobile: токены в теле ответа.
```

**Refresh (рутинный, одно устройство)**

```
Client → POST /api/auth/refresh (cookie) | /api/auth-mobile/refresh (body)
→ AuthService.refreshToken: JWT → findByRefreshToken → owner/TTL → claimRefreshToken (атомарный DELETE)
→ generateTokens + saveToken (новая строка, старая удалена)
→ новая пара клиенту; остальные сессии пользователя не затронуты.
```

**Refresh (параллельный, дедуплицирован)**

```
5 x 401 одновременно на клиенте
→ refresh.interceptor.ts: один shared Promise `refreshInFlight`
→ один POST /api/auth-mobile/refresh, один атомарный claim на сервере
→ 5 исходных запросов ретраятся с новым accessToken.
```

**Refresh (reuse-attack)**

```
Attacker → старый токен → JWT валиден, записи нет (или не взял claim)
→ AuthService.refreshToken: removeAllUserTokens(userId) + 401 REFRESH_TOKEN_NOT_FOUND
→ легитимный пользователь будет вынужден перелогиниться — цена защиты.
```

**Logout**

```
Client → GET /api/auth/logout | POST /api/auth-mobile/logout
→ AuthService.logout: removeToken(refreshToken) — идемпотентно, не бросает
→ Web: clearAuthCookies. Mobile: клиент чистит SecureStore.
→ Другие устройства пользователя продолжают работать.
```

**Cleanup (раз в сутки в 2:00)**

```
@Cron → TokenCleanupService.handleExpiredTokens
→ Redis SET NX EX locks:token-cleanup (первый инстанс в кластере)
→ removeExpiredTokens: цикл deleteMany пачками по 1000 пока есть строки < now
→ DEL locks:token-cleanup.
```

## Эндпоинты (OpenAPI через Swagger, регенерация orval)

- Web (`/api/auth/*`): `registration`, `login`, `activate/:link`, `logout`, `refresh`, `mobile/login` (legacy алиас в том же контроллере).
- Mobile (`/api/auth-mobile/*`): `registration`, `mobile/login`, `activate/:link`, `logout`, `refresh` — токены ходят в теле (нет cookies).
- Клиенты генерируются: `pnpm --filter @workspace/nest-api generate` и `pnpm --filter sociopath api:generate`.

## Коды ошибок

Определены в `apps/api/src/modules/token/token.type.ts` и **продублированы** в `packages/nest-api/src/lib/auth-errors.const.ts` и `sociopath/mobile/app/api/lib/auth/auth-errors.const.ts` — чтобы клиенты сравнивались с enum, а не со свободным текстом.

Группы: `ACCESS_TOKEN_*`, `REFRESH_TOKEN_*`, `TOKEN_USER_MISMATCH` / `TOKEN_NOT_FOUND`, `USER_NOT_FOUND` / `USER_NOT_ACTIVATED` / `INVALID_PASSWORD`.

## Связанные задачи

- [Frontend multi-session auth](../../frontend/tasks/multiple-refresh-tokens.md)
- [multiple-refresh-tokens — follow-ups](./multiple-refresh-tokens-followups.md)
