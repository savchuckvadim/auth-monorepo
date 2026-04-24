# Sessions & Password (Front + Mobile) — Follow-ups

Клиентские хвосты, которые не попали в основную ветку задачи. Бэкендовые
обсуждаются отдельно в `backend/tasks/sessions-management-followups.md` и
`backend/tasks/forgot-password-followups.md`.

## Синхронизация `EnumAuthErrorCode` ✅ done

- [x] ~~Добавить в `packages/nest-api/src/lib/auth-errors.const.ts` коды:
  `PASSWORD_RESET_TOKEN_INVALID`, `PASSWORD_RESET_TOKEN_EXPIRED`,
  `PASSWORD_RESET_TOKEN_USED`, `PASSWORD_SAME_AS_OLD`, `SESSION_NOT_FOUND`.~~
- [x] ~~Продублировать в mobile `app/api/lib/auth/auth-errors.const.ts`.~~
- [x] ~~Перевести `features/password/lib/utils/password-errors.util.ts` (и web,
  и mobile) на использование enum вместо магических строк.~~

Риск был: если бэкенд переименует `PASSWORD_RESET_TOKEN_INVALID` → что-то
другое, клиент про это не узнает, пока не получит багрепорт. Enum-зеркало это
ловит — теперь `tsc` падает на невалидных значениях.

## UX-улучшения Sessions

- [x] ~~Иконка устройства по `platform` из deviceId (`android-13-uuid` /
  `ios-17.4-uuid`) вместо парсинга User-Agent.~~ — реализовано через
  `resolveSessionPlatform()` в `features/sessions/lib/utils/session-meta.util.ts`:
  приоритет у префикса `deviceId`, UA остаётся fallback-ом. На web иконка
  выбирается из `lucide-react` (`Smartphone` / `Monitor` / `Laptop`), на
  мобилке — emoji (📱 / 🖥️ / 💻 / 🌐).
- [x] ~~Полный datetime через `title`/`longPress` для `updatedAt`.~~ На web
  `title` был и раньше; на мобилке добавили `onLongPress` → `Alert` с
  точными `createdAt` / `updatedAt` / `expiresAt` и хинт «зажмите, чтобы
  увидеть точные даты».
- [x] ~~На web `SessionsList` — скелетон вместо центрального спиннера.~~
  Рендерим 3 `SessionItemSkeleton` на `animate-pulse` — layout совпадает с
  реальным айтемом, нет скачка.
- [x] ~~Indicator "Создана только что" для только что авторизованных устройств
  (< 30 мин).~~ `isRecentlyCreated(session.createdAt)` +
  бейдж «Только что» (янтарный, не перекрывает «Текущая сессия»).
- [ ] Кнопка "revoke all except current" — бэкенд её уже поддерживает через
  `change-password`, но отдельного эндпоинта пока нет. Когда появится —
  добавить в UI (см. backend followups).

## UX-улучшения Password flow

- [x] ~~Подсказка по силе пароля в `ResetPasswordForm` / `ChangePasswordForm`.~~
  Лёгкая эвристика (длина + 4 класса символов) — `password-strength.util.ts`,
  UI — `PasswordStrengthMeter` (4 сегмента + подпись). Без zxcvbn, чтобы
  не тащить +200KB в бандл. Код дублируется на web и mobile (нельзя шарить
  из-за зависимости web на `@workspace/ui`).
- [x] ~~Предзаполнение email в `ForgotPasswordForm`, если пользователь уже
  пытался логиниться.~~ Через `sessionStorage` (`forgot-prefill.util.ts`):
  `LoginForm` на submit пишет hint, `ForgotPasswordForm` при монтировании
  его consume-ит (одноразово, с TTL 1ч). Через query string сознательно
  не передаём, чтобы email не утекал в `Referer`.
- [ ] После успешного reset на web — auto-login. **Заблокировано бэкендом**:
  `POST /auth/password-reset` сейчас возвращает только `{ success: true }`
  и не отдаёт токены. Варианты: (a) бэк в ответ на reset возвращает пару
  tokens как при login, (b) клиент делает отдельный login с введённым
  паролем, но для этого нужен email — а его на reset-странице нет (токен
  непрозрачный). Лучше дождаться backend-изменения, см. backend followups.

## Mobile-специфика

- [ ] Deep-link на `/auth/reset-password?token=...` → нативный экран сброса.
  Требует: universal links в `app.json`, экран `ResetPassword.tsx`, маршрут
  в `PrivateNavigator` (вне защищённой зоны).
- [ ] Биометрия перед `change-password` (FaceID/TouchID) через
  `expo-local-authentication`.
- [ ] «Забыли пароль?» в native-языке операционной системы (i18n, сейчас
  хардкод на русском).

## Наблюдаемость

- [ ] Логировать на фронте количество попыток reset-password и показывать
  пользователю CAPTCHA после N неудач (бэк в followups требует rate-limit —
  фронт должен корректно отрисовать 429).
- [ ] Отправка в Sentry при непредвиденных кодах от password-эндпоинтов
  (сейчас они молча попадают в ветку `default` `password-errors.util.ts`).

## Design tokens

- [ ] Цвета `#212121 / #1C1C1C / #3A3A3A / #F44848` на мобилке сейчас
  захардкожены строками. Желательно вынести в `shared/style/colors.ts` и
  использовать через константы (как в web-темах).
- [ ] Dark-email-шаблоны на бэке (`mail/templates/shared/theme.ts`) дублируют
  ту же палитру — при смене брендинга менять в двух местах, не забыть.

## Тесты

- [ ] E2E-тест (Cypress / Playwright) на full reset-flow:
  `/auth/login` → «Forgot password?» → письмо (перехватываем на бэке)
  → `/auth/reset-password?token=...` → новый пароль → логин.
- [ ] Unit-тесты на `buildSessionDisplay` / `formatRelative` (парсинг UA и
  относительное время — классические кандидаты на опечатки).
