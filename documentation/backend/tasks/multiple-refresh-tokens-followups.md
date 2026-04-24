# Multiple refresh tokens — доработки и риски

Задачи и зазоры, обнаруженные после внедрения множественных refresh-токенов ([основная задача](./multiple-refresh-tokens.md)). Не дублируют общий бэклог — фиксируют то, на что обратить внимание при приоритизации.

## Безопасность

1. **Хранение refresh-токенов в plaintext.** В таблице `tokens` поле `refresh_token` лежит как есть. Утечка БД → компрометация всех активных сессий. Рекомендация — хранить `SHA-256` от значения токена: в `saveToken` хешируем при записи, в `findTokenByRefreshToken` / `claimRefreshToken` / `removeToken` хешируем приходящее значение перед запросом. Требует миграции (новый столбец `refresh_token_hash`, backfill, снятие `@unique` со старого, повешение `@unique` на хеш).

2. **Слабые JWT-секреты в `.env`.** `JWT_ACCESS_SECRET='secret'` / `JWT_REFRESH_SECRET='refresh-secret'` годятся только для dev. Для prod генерировать через `openssl rand -base64 64` и хранить в секретах окружения. Ротация секретов делает живые access/refresh токены невалидными — это ок для аварийной ротации, но под плановую нужен дуал-секрет / keyring.

3. **`trust proxy = 1` жёстко.** Если в проде окажется > 1 прокси в цепочке (например, Cloudflare → nginx → app), число надо поднять. Проверять по заголовку `x-forwarded-for` на prod-стенде.

4. **Нет лимита одновременных сессий.** Один пользователь может накопить сколько угодно refresh-токенов. Обычно ставят мягкий лимит (5–10 активных), при превышении вытесняют самые старые.

5. **Нет уведомлений о логине с нового устройства.** После `AuthService.login` с новым `deviceId` можно слать email / push — классический antifraud-сигнал.

6. **Cookies `maxAge` хардкодит 15м / 30д.** `apps/api/src/core/cookie/cookie.service.ts` не использует `TokenService.getAccessTtlMs / getRefreshTtlMs`. Если увеличите TTL токена в `.env`, cookie всё равно умрёт раньше — получим лишний refresh-флоу или ранний редирект. Нужно пробросить TTL из `TokenService` в `CookieService`.

7. **Reuse-detection выкидывает легитимного пользователя при любой серверной гонке claim'а.** Это осознанная цена за безопасность, но на слабой сети мобильный может попадать под неё чаще, чем хотелось бы. Аудит продакшн-логов `REFRESH_TOKEN_NOT_FOUND` после деплоя обязателен — если всплеск, повышать окно single-flight дедупа на клиентах или добавлять grace-period на сервере.

## Функциональные пробелы

8. **Нет API сессий.** Методы репозитория `findTokensByUserId` / `removeAllUserTokens` есть, но контроллеры отсутствуют. Нужны:
   - `GET /api/auth/sessions` — список активных устройств пользователя (с `deviceId` / `userAgent` / `ipAddress` / `createdAt`).
   - `DELETE /api/auth/sessions/:id` — ревок конкретной сессии.
   - `DELETE /api/auth/sessions` — logout everywhere (глобальный выход, полезно при смене пароля).

9. **Смена пароля не ревокает сессии.** После успешной смены пароля желательно звать `removeAllUserTokens(userId)` — стандартная практика.

10. **Нет метрик.** `TokenCleanupService` только пишет в лог. Полезно отдавать количество удалённых токенов, длительность чистки и взятие лока в Prometheus / OpenTelemetry — чтобы видеть, что cron вообще срабатывает в проде.

## Инфраструктура

11. **Redis fail-open в cleanup.** Сейчас при недоступности Redis чистка всё равно запускается — это сознательный выбор (лучше дважды почистить, чем никогда). Для сценария "Redis отвалился на всех инстансах одновременно" возможен двойной DELETE одних и тех же строк — это безопасно (idempotent), но может создать нагрузку. Альтернатива — advisory lock в самом MySQL (`GET_LOCK`).

12. **Orval после изменения DTO.** Любая правка `RefreshTokenDto` / `AuthenticatedUserDto` / `EnumAuthErrorCode` требует регенерации: `pnpm --filter @workspace/nest-api generate` и `pnpm --filter sociopath api:generate`.

## E2E / тестирование

13. **Unit-тесты `TokenService.parseDurationToMs` и `AuthService.refreshToken`** — ключевая логика и легко ломается при рефакторинге. Сейчас тестов нет.

14. **Сценарии для QA:** мультилогин web+RN, logout на одном устройстве не роняет другое, reuse-attack (взять старый токен из логов и подставить — должно убивать все сессии), гонка (две одновременные refresh на одном и том же токене — первая работает, вторая ловит reuse).

## Ссылки

- [Основная задача](./multiple-refresh-tokens.md)
- [Frontend multi-session auth](../../frontend/tasks/multiple-refresh-tokens.md)
