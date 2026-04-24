# Sessions management API

Управление активными refresh-сессиями пользователя: посмотреть, где он сейчас авторизован,
закрыть одну сессию, выйти со всех устройств. Работает поверх уже реализованного
[multiple refresh tokens](./multiple-refresh-tokens.md).

## Что сделано

### 1. Endpoints

Web (cookie-based): `AuthController` — `apps/api/src/modules/auth/controllers/auth.controller.ts`

- `GET    /api/auth/sessions`           — список активных сессий
- `DELETE /api/auth/sessions/:id`       — ревок конкретной сессии
- `DELETE /api/auth/sessions`           — logout со всех устройств (+ `clearAuthCookies`)

Mobile (Bearer-based): `AuthMobileController` — `apps/api/src/modules/auth/controllers/auth-mobile.controller.ts`

- `GET    /api/auth-mobile/sessions`
- `DELETE /api/auth-mobile/sessions/:id`
- `DELETE /api/auth-mobile/sessions`

Все эндпоинты защищены `AccessTokenGuard`. Swagger: `ApiBearerAuth`, `ApiUnauthorizedResponse`,
`ApiResponse` с типами → Orval сгенерирует `UseQuery`/`UseMutation` и TS-типы напрямую.

### 2. DTO

`apps/api/src/modules/auth/dtos/session.dto.ts`:

- `SessionDto` — `{ id, deviceId, userAgent, ipAddress, createdAt, updatedAt, expiresAt, isCurrent }`
- `SessionsBulkResultDto` — `{ revoked: number }`

Все поля размечены `@ApiProperty` / `@ApiPropertyOptional` с примерами, `nullable`, форматами —
Orval сгенерирует корректные TS-типы без ручных правок.

### 3. Service

`apps/api/src/modules/auth/services/sessions.service.ts` — `SessionsService`:

- `listSessions(userId, context)` — достаёт токены из БД, ставит `isCurrent` по `refreshToken`
  (web: из cookie) или `deviceId` (mobile: из заголовка `x-device-id`).
- `revokeSession(userId, sessionId)` — удаляет строку в `tokens` с проверкой владельца.
- `revokeAllSessions(userId, exceptRefreshToken?)` — удаляет все, опционально оставляя текущую.

### 4. Repository

Расширен `TokenRepository` (`apps/api/src/modules/token/token.repository.ts` +
`token.prisma.repository.ts`):

- `removeTokenByIdForUser(id, userId)` — удаление с `where: { id, userId }`, защищает от
  подстановки чужого id.
- `removeAllUserTokensExceptRefreshToken(userId, exceptRefreshToken)` — используется в
  `revokeAllSessions(except)` и при `change-password`.

### 5. Определение "текущей" сессии

| Клиент | Источник | Поле в БД |
|---|---|---|
| Web (Next.js) | `cookies.refreshToken` | `tokens.refreshToken` (точное совпадение) |
| Mobile (RN) | header `x-device-id` | `tokens.deviceId` |

Mobile не может положить refreshToken в GET, но всегда шлёт `x-device-id` — этого хватает для
метки `isCurrent`. Fallback-порядок: refreshToken > deviceId > false.

### 6. Swagger / Orval

В каждом эндпоинте:

- `ApiOperation({ summary, description })`
- `ApiResponse({ status, type })` с DTO-классами
- `ApiBearerAuth()` на защищённых ручках
- `ApiUnauthorizedResponse` с `ErrorResponseDto`

Это даёт Orval'у достаточно метаданных, чтобы сгенерировать строго типизированные хуки.

## На что обратить внимание

- `isCurrent` — чисто информационное поле для UI. Никакой бизнес-логики на нём на сервере не
  завязано: права проверяются по `userId` из access-токена.
- `revokeAllSessions` в web дополнительно чистит cookies в текущем ответе. Mobile сам очистит
  SecureStore после первого 401 на следующем refresh.
- При ревоке чужой сессии в API пользователь продолжает жить — access-токен у него ещё
  валиден до 15 минут. DB-record удалён, следующий `refresh` → 401 → логаут через middleware.
  Это ожидаемо: иначе пришлось бы таскать blacklist access-токенов.

## Follow-ups

См. [sessions-management-followups.md](./sessions-management-followups.md).
