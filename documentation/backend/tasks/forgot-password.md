# Forgot / Reset / Change Password

Полный flow восстановления доступа и смены пароля: "забыл пароль" (без логина) и
"сменить пароль" (авторизованный пользователь).

## Что сделано

### 1. БД: таблица `password_reset_tokens`

Новая модель в `prisma/schema.prisma`:

```prisma
model PasswordResetToken {
    id         String    @id @default(uuid())
    userId     String    @map("user_id") @db.VarChar(255)
    tokenHash  String    @unique @map("token_hash") @db.VarChar(128)
    expiresAt  DateTime  @map("expires_at")
    consumedAt DateTime? @map("consumed_at")
    ipAddress  String?   @map("ip_address") @db.VarChar(45)
    userAgent  String?   @map("user_agent") @db.VarChar(500)
    createdAt  DateTime  @default(now()) @map("created_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

    @@index([userId])
    @@index([expiresAt])
    @@map("password_reset_tokens")
}
```

Миграция: `prisma/migrations/20260424104623_add_password_reset_tokens/`.

**Важно:** в БД лежит только SHA-256-хеш токена. Plaintext уходит пользователю в
письме и больше нигде не существует — даже утечка дампа БД не даст злоумышленнику
воспользоваться ссылками.

### 2. Endpoints

Web (`AuthController` — `apps/api/src/modules/auth/controllers/auth.controller.ts`):

- `POST /api/auth/forgot-password`   `{ email }` → `{ success: true }` (всегда 200)
- `POST /api/auth/reset-password`    `{ token, password }` → `{ success: true }`
- `POST /api/auth/change-password`   `{ oldPassword, newPassword }` (auth) → `{ success: true }`

Mobile (`AuthMobileController`):

- `POST /api/auth-mobile/forgot-password`
- `POST /api/auth-mobile/reset-password`
- `POST /api/auth-mobile/change-password` — DTO `ChangePasswordMobileDto` дополнительно
  содержит опциональный `refreshToken`, чтобы текущая мобильная сессия пережила ревок.

### 3. DTO — `apps/api/src/modules/auth/dtos/password.dto.ts`

- `ForgotPasswordDto` — `{ email }`, `@IsEmail`
- `ResetPasswordDto` — `{ token, password }`, `@IsPassword` (8–32 символа)
- `ChangePasswordDto` — `{ oldPassword, newPassword }`, оба `@IsPassword`
- `ChangePasswordMobileDto` — то же + `refreshToken?`
- `PasswordActionResultDto` — `{ success: boolean }`

Все поля размечены `@ApiProperty` с `example`, `minLength`, `maxLength`, `format` —
Orval сгенерирует корректные типы и JSDoc в клиентах.

### 4. Service

`apps/api/src/modules/auth/password-reset/password-reset.service.ts` — `PasswordResetService`:

- `requestReset(email, context?)`:
  - Не раскрывает наличие пользователя (user enumeration защита): всегда возвращает `void`.
  - Если пользователь не найден или не активирован — делает **псевдо-работу** (bcrypt
    случайного мусора), чтобы время ответа не выдавало результат.
  - Генерит `randomBytes(32).toString('base64url')` — plaintext в письмо, SHA-256 в БД.
  - Ставит письмо в очередь `SendMailPasswordResetUseCase → QueueNames.MAIL →
    JobNames.MAIL_PASSWORD_RESET` → `MailService.sendPasswordReset`.
  - Ссылка: `${CLIENT_URL}/auth/reset-password?token=<plaintext>`.
  - TTL: 30 минут (или `PASSWORD_RESET_EXPIRES_IN` из env).

- `resetPassword(plaintextToken, newPassword)`:
  - Хеширует вход, находит запись, `timingSafeEqual` для защиты от time-based oracle.
  - Отдельные ветки ошибок: `PASSWORD_RESET_TOKEN_INVALID`, `_USED`, `_EXPIRED`.
  - В транзакции: обновляет `users.password`, ставит `consumedAt`, подчищает все
    остальные незавершённые токены этого юзера.
  - После транзакции: `tokenService.removeAllUserTokens(userId)` — ревок ВСЕХ refresh-сессий
    (стандартная практика: после сброса юзер должен перелогиниться везде).

- `changePassword(userId, oldPassword, newPassword, currentRefreshToken?)`:
  - Проверяет старый пароль `bcrypt.compare`.
  - Блокирует "новый == старый" (`PASSWORD_SAME_AS_OLD`).
  - Сохраняет новый hash.
  - `removeAllUserTokensExceptRefreshToken(userId, currentRefreshToken)` — все другие
    устройства разлогиниваются, текущее остаётся.

### 5. Repository

`apps/api/src/modules/auth/password-reset/password-reset.{repository,prisma.repository}.ts`:

- `createForUser(input)` — в **транзакции** удаляет все старые токены юзера и создаёт новый.
  Гарантирует: "одновременный активный токен только один".
- `findByTokenHash(tokenHash)` / `markConsumed(id)` / `deleteAllForUser(userId)`.
- `removeStaleTokens(batchSize?)` — чистит истёкшие и потреблённые пачками.

### 6. Mail

- `apps/api/src/modules/mail/templates/password-reset.template.tsx` — react-email шаблон
  в едином стиле с `email-verification`.
- `apps/api/src/modules/mail/dtos/password-reset.dto.ts` — `SendMailPasswordResetDto`
  (email, name, resetLink, expiresInMinutes).
- `MailService.sendPasswordReset` + use-case `SendMailPasswordResetUseCase` → диспатч в Bull-очередь.
- Новый `JobNames.MAIL_PASSWORD_RESET`, обработчик в `MailProcessor`.

### 7. Новые коды ошибок (`EnumAuthErrorCode`)

```
PASSWORD_RESET_TOKEN_INVALID
PASSWORD_RESET_TOKEN_EXPIRED
PASSWORD_RESET_TOKEN_USED
PASSWORD_SAME_AS_OLD
SESSION_NOT_FOUND
```

Фронт-пакет `packages/nest-api/src/lib/auth-errors.const.ts` нужно синхронизировать — добавлено
в TODO для клиентской части (см. frontend tasks).

### 8. Новый env

```
PASSWORD_RESET_EXPIRES_IN=30m
```

Формат как у `JWT_ACCESS_EXPIRES_IN` — парсится `parseDurationToMs`.

## Безопасность

- **User enumeration**: `forgot-password` всегда 200, включая искусственную задержку на
  несуществующих email (тот же bcrypt).
- **Plaintext never stored**: БД хранит только SHA-256.
- **One-shot**: `consumedAt` + uniq по `tokenHash` + удаление всех прочих токенов юзера при
  создании нового → повторное использование невозможно.
- **TTL**: 30 минут по умолчанию.
- **Timing-safe compare**: `crypto.timingSafeEqual` на сравнении хешей.
- **Mass session revoke on reset**: все refresh-токены ревокаются, злоумышленник не
  продолжит жить на украденной сессии.
- **Same-password guard**: `PASSWORD_SAME_AS_OLD` — не даёт "обойти" change-password
  тем же паролем и не превращает флоу в no-op.

## Swagger / Orval

На каждом эндпоинте:

- `@ApiOperation({ summary, description })`
- `@ApiBody({ type: ... })`
- `@ApiResponse({ status: 200, type: PasswordActionResultDto })`
- `@ApiBadRequestResponse({ type: ErrorResponseDto })` для валидации
- `@ApiUnauthorizedResponse({ type: ErrorResponseDto })` для bad-token
- `@HttpCode(200)` — чтобы `forgot-password` не уходил с 201

Это всё, что нужно Orval'у для генерации строго типизированных хуков на фронте/моб.

## Follow-ups

См. [forgot-password-followups.md](./forgot-password-followups.md).
