# Multi-session auth (Frontend + Mobile) — статус

## Статус

**Реализовано:** клиентская часть под множественные refresh-токены. Web: зеркальный `EnumAuthErrorCode`, отказ от хард-редиректа из axios-интерцептора (редирект делает middleware). Mobile: стабильный `deviceId` и `x-device-id` заголовок, single-flight дедуп одновременных refresh'ей, синхронизированные коды ошибок.

Бэкенд и общая архитектура: **[Backend multiple-refresh-tokens](../../backend/tasks/multiple-refresh-tokens.md)**.
Открытые вопросы: **[multiple-refresh-tokens-followups](../../backend/tasks/multiple-refresh-tokens-followups.md)**.

## Web (`apps/front` + `packages/nest-api`)

### Коды ошибок

`packages/nest-api/src/lib/auth-errors.const.ts` — зеркальный enum `EnumAuthErrorCode` (значения 1 в 1 с `apps/api/src/modules/token/token.type.ts`) + хелперы:

- `isRefreshAuthError(message)` — коды, после которых refresh-флоу исчерпан и нужен релогин (`REFRESH_TOKEN_*`, `TOKEN_USER_MISMATCH`, `TOKEN_NOT_FOUND`).
- `isAuthError(message)` — любой код аутентификации.

Экспорт из `packages/nest-api/index.ts`, так что потребители импортируют:

```ts
import { EnumAuthErrorCode, isRefreshAuthError } from '@workspace/nest-api';
```

### Interceptor и middleware — разделение ответственности

Интерцептор в `packages/nest-api/src/lib/back-api.ts` оставлен без хард-редиректа (`window.location.href = '/auth/login'` намеренно не возвращаем). Почему:

1. **Backend чистит cookies сам** — при неудачном refresh `AuthService.refreshToken` вызывает `CookieService.clearAuthCookies(res)`. Клиенту не нужно дублировать это на `document.cookie`.
2. **Middleware уже редиректит** — `apps/front/middleware.ts` на каждой навигации проверяет cookies и при их отсутствии отправляет на `/auth/login`.
3. **`/start` — публичный маршрут.** Жёсткий редирект из интерцептора ломал бы страницу `/start`: пользователь мог заходить туда без авторизации, но любой внутренний API-запрос фонит 401 → интерцептор бы насильно уводил его со `/start`. Теперь поток такой: запрос фейлится → компонент получает ошибку → пользователь остаётся, где был; при явной навигации в защищённую зону middleware его перехватит.

`dispatchAuthSessionExpired` в `packages/nest-api/src/lib/auth-session-expired.ts` оставлен заготовкой (без `window.dispatchEvent`). Если потребуется централизованно сбрасывать Redux / zustand / отключать сокеты при истечении сессии — раскомментировать `dispatchEvent` и подписаться в корневом провайдере. Хард-редиректа там быть не должно по тем же причинам выше.

### Middleware

`apps/front/middleware.ts` без изменений: проверяет **наличие** токенов в cookies, не валидность. Валидация происходит на API и транслируется через interceptor. Публичные маршруты (`/auth/*`, `/start`, и т.д.) пропускаются явно.

## Mobile (`sociopath/mobile`)

### Стабильный device id

`app/api/lib/auth/device-id.api.ts`:

- Генерирует `${Platform.OS}-${Platform.Version}-${uuidv4()}` при первом запуске, сохраняет в `expo-secure-store` (ключ `EnumAuthType.DEVICE_ID`).
- In-memory single-flight промис `deviceIdPromise` защищает от гонки: если одновременно стартуют два запроса и `deviceId` ещё не создан, оба получат одно и то же значение.
- Переживает logout — бэкенд может связать новую сессию с тем же физическим устройством и показать её в списке активных сессий.

`app/api/lib/auth/auth.type.ts` дополнен `EnumAuthType.DEVICE_ID` и константой `DEVICE_ID_HEADER = 'x-device-id'`.

### Token interceptor

`app/api/lib/interceptors/with-token.interceptor.ts` параллельно достаёт accessToken и deviceId и приклеивает к каждому запросу:

```
Authorization: Bearer <accessToken>
x-device-id: <stable-device-id>
```

Параллельно через `Promise.all`, чтобы не увеличивать latency запроса.

### Refresh interceptor — single-flight

`app/api/lib/interceptors/refresh.interceptor.ts`:

- Общий модульный `refreshInFlight: Promise<void> | null`.
- Все одновременные 401 ждут один и тот же `getNewTokens()`; только после него ретраят свой исходный запрос.
- После резолва `refreshInFlight` сбрасывается в `null`.

**Зачем это нужно:** на бэкенде ротация атомарна (`claimRefreshToken`), только один из параллельных refresh'ей получит новую пару. Без single-flight на клиенте 5 одновременных 401 → 5 параллельных refresh'ей → 4 из них упали бы в reuse-detection и выкинули бы залогиненного пользователя из приложения.

### Коды ошибок

`app/api/lib/auth/auth-errors.const.ts`:

- `EnumAuthErrorCode` (зеркальный, значения совпадают с сервером).
- `isTokenError` распознаёт unrecoverable refresh-коды (`REFRESH_TOKEN_*`, `TOKEN_USER_MISMATCH`, `TOKEN_NOT_FOUND`) **и** локальные клиентские сентинелы (`No refresh token`, `Refresh token not found`), которые бросают наши хелперы `getNewTokens` / `AuthService.ts` при пустом SecureStore.
- Старый `AUTH_ERRORS` оставлен с пометкой `@deprecated` — просто переименован в значения enum'а. Существующие вызовы `isTokenError(errorMessage)` в `refresh.interceptor.ts` и `useAuthCheck.tsx` работают без правок.

## Orval

После любых изменений backend DTO / OpenAPI-спеки перегенерируем клиентов:

```
pnpm --filter @workspace/nest-api generate
pnpm --filter sociopath api:generate
```

## Тесты (QA-сценарии)

1. **Две сессии, logout одной не роняет другую.** Залогиниться в web и RN под одним аккаунтом. Logout в web → RN продолжает работать, API-запросы проходят.
2. **Параллельный refresh (mobile).** Инициировать экран, который стреляет 5+ API одновременно. Перед этим вручную истечь access (или вырубить сеть и поднять) — должно быть ровно **одно** обращение к `/auth-mobile/refresh` и все исходные запросы успешно ретраятся.
3. **Reuse-attack.** Снять refresh-токен из логов, залогиниться повторно этим же клиентом, затем подставить старый токен в запрос — должны выйти **все** сессии пользователя (ожидаемо по OAuth 2.0 RFC 6749 §10.4).
4. **`/start` при истёкшей сессии.** Открыть `/start`, дождаться истечения access. Любой API-запрос с этой страницы фейлится — пользователь остаётся на `/start`, редиректа не происходит. При переходе в защищённую зону — middleware отправит в `/auth/login`.
5. **Logout после logout'а.** Повторный вызов `/auth/logout` не должен падать 401.

## Связанные задачи

- [Backend multiple-refresh-tokens](../../backend/tasks/multiple-refresh-tokens.md)
- [Backend follow-ups](../../backend/tasks/multiple-refresh-tokens-followups.md)
