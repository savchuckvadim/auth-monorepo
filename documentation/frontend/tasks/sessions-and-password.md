# Sessions & Password (Web + Mobile)

Web- и mobile-имплементация списка активных сессий, "выйти со всех устройств",
flow "забыл пароль" и "сменить пароль". Всё общается с бэкендом через Orval-
клиент и строго через `EnumAuthErrorCode` (никаких свободных текстов в if'ах).

Бэкенд: **[sessions-management](../../backend/tasks/sessions-management.md)** +
**[forgot-password](../../backend/tasks/forgot-password.md)**.
Открытые хвосты: **[sessions-management-followups](../../backend/tasks/sessions-management-followups.md)**
и **[forgot-password-followups](../../backend/tasks/forgot-password-followups.md)**.

## Web (`apps/front`)

### Feature-модули

```
apps/front/modules/features/
├── sessions/
│   ├── lib/api/SessionsService.ts         обёртка над Orval `getAuth()`
│   ├── lib/hooks/useSessions.ts           TanStack Query + мутации revoke
│   ├── lib/utils/session-meta.util.ts     парсер User-Agent + relative-time
│   └── ui/
│       ├── SessionItem.tsx                строка списка устройств
│       └── SessionsList.tsx               список + кнопка «выйти везде»
└── password/
    ├── lib/api/PasswordService.ts         forgot/reset/change
    ├── lib/hooks/usePasswordMutations.ts  3 отдельных мутации
    ├── lib/utils/password-errors.util.ts  маппинг EnumAuthErrorCode → текст
    └── ui/
        ├── ForgotPasswordForm.tsx         /auth/forgot-password
        ├── ResetPasswordForm.tsx          /auth/reset-password
        └── ChangePasswordForm.tsx         /network/settings
```

### Страницы Next.js

- `app/auth/forgot-password/page.tsx` — публичная, в `middleware.ts` занесена в
  `isPasswordRecoveryPage` (пропускается и для гостя, и для залогиненного).
  Шаблон — `AuthFormPageShell`, как у `/auth/login`.
- `app/auth/reset-password/page.tsx` — публичная. Форма берёт `?token=` из
  query через `useSearchParams` (завёрнуто в `<Suspense>` — требование
  Next.js App Router для CSR-хуков).
- `app/network/settings/page.tsx` — защищённая, показывает `SessionsList` и
  `ChangePasswordForm` в двух карточках. Доступ — через иконку шестерёнки в
  `Header` (рядом с темой и `Logout`).

### Роутинг и middleware

`middleware.ts` дополнен:

```ts
const isPasswordRecoveryPage =
    url.pathname.startsWith('/auth/forgot-password') ||
    url.pathname.startsWith('/auth/reset-password');
if (isPasswordRecoveryPage) {
    return NextResponse.next();
}
```

Почему не полагаться на `isAuthPage`: реальный сценарий — пользователь
получает письмо и открывает ссылку из того же браузера, где уже залогинен.
Стандартный `isAuthPage` в этом случае редиректит на `/network/me`, и сброс
ломается. Теперь страница пропускается в обоих состояниях.

Ссылка "Forgot password?" в `LoginAuthCardFooter` уже указывала на
`/auth/forgot-password` — теперь она наконец никуда не 404-ит.

### Взаимодействие с Orval

Web-клиент — `packages/nest-api`, клиент — `getAuth()`. Под `sessions`
используются `authListSessions`, `authRevokeSession`, `authRevokeAllSessions`;
под password — `authForgotPassword`, `authResetPassword`, `authChangePassword`.

`authRevokeAllSessions` на бэке чистит cookies. На фронте после успеха в
`SessionsList` делаем `window.location.replace('/auth/login')`, чтобы браузер
сразу перечитал cookie-состояние (без этого middleware отрабатывает только на
следующей навигации).

`authResetPassword` и `authForgotPassword` — публичные (без `accessToken`), но
axios всё равно прикладывает cookies на случай open-tab-сценария; бэк просто
игнорирует их в этих эндпоинтах.

### Обработка ошибок

`password-errors.util.ts` маппит коды на русскую текстовку:

| code                              | что показываем                                 |
| --------------------------------- | ---------------------------------------------- |
| `INVALID_PASSWORD`                | «Неверный текущий пароль»                      |
| `USER_NOT_FOUND`                  | «Пользователь не найден»                       |
| `PASSWORD_RESET_TOKEN_INVALID`    | «Ссылка недействительна — запросите новое…»    |
| `PASSWORD_RESET_TOKEN_EXPIRED`    | «Срок действия ссылки истёк…»                  |
| `PASSWORD_RESET_TOKEN_USED`       | «Ссылка уже была использована ранее»           |
| `PASSWORD_SAME_AS_OLD`            | «Новый пароль не должен совпадать со старым»   |

Все коды уже присутствуют в бэкендовском `EnumAuthErrorCode`. Зеркало на
клиенте — `packages/nest-api/src/lib/auth-errors.const.ts`; если туда
добавляются новые поля, не забыть отразить их в этом switch-case.

## Mobile (`sociopath/mobile`)

### Feature-модули

Структура один-в-один с web:

```
app/features/
├── sessions/  (SessionsService / useSessions / SessionItem / SessionsList)
└── password/  (PasswordService / usePasswordMutations / ForgotPasswordForm /
               ChangePasswordForm)
```

Разница с web-версией:

- `ChangePasswordForm` обязательно дочитывает `refreshToken` из SecureStore
  через `getRefreshToken()` и передаёт его в `ChangePasswordMobileDto.refreshToken`.
  Бэк по этому токену находит текущую сессию и НЕ ревокает её — пользователь
  остаётся залогиненным на этом устройстве.
- `ResetPasswordForm` на мобилке сейчас **не реализован**. Ссылка из письма
  ведёт на `${CLIENT_URL}/auth/reset-password` (web), поэтому обычный кейс —
  открыть письмо на десктопе. Если понадобится обрабатывать deep-link внутри
  приложения — см. followups.
- `SessionsList` принимает колбэк `onAllSessionsRevoked`: после успешного
  «выйти везде» мобилка сама чистит SecureStore и сбрасывает `user` в
  AuthProvider, что в `PrivateNavigator` переключает на Auth-экран.

### Экраны

- `screens/auth/Auth.tsx` → `AuthForm` переведён на трёхрежимный state:
  `'login' | 'register' | 'forgot'`. В режиме `forgot` рендерится
  `ForgotPasswordForm` из `@/features/password`. Ссылка «Забыли пароль?»
  отрисовывается только в `login`-режиме. `ForgotPasswordForm` принимает
  `onBackToLogin`, чтобы вернуть пользователя в `login`.
- `screens/settings/Settings.tsx` перекомпонован и теперь содержит:
  - карточку профиля (имя + email),
  - блок `SessionsList` («активные сессии» + «выйти везде»),
  - блок `ChangePasswordForm` (сменить пароль, оставив текущую сессию),
  - отдельную кнопку «Выйти с этого устройства» (старый `AuthService.logout()`).
- Тема экрана Settings — dark, соответствует новому стилю писем и start-page
  на вебе (`bg-[#212121]`, карточки `#1C1C1C`, бордер `#3A3A3A`, акцент
  `#F44848`).

### Orval-клиент

Использует `getAuthMobile()` из `app/api/generated/auth-mobile/auth-mobile.ts`,
методы:

- `authMobileListSessions`
- `authMobileRevokeSession(id)`
- `authMobileRevokeAllSessions`
- `authMobileForgotPassword`
- `authMobileResetPassword` (зарезервирован, сейчас не вызывается из UI)
- `authMobileChangePassword` (с `refreshToken`)

Бэк определяет «текущую» сессию по заголовку `x-device-id`, который
приклеивается на уровне axios-интерцептора (`device-id.api.ts`). Менять это
поведение на клиенте не требуется — всё уже работает с момента задачи
multi-refresh.

### Обработка ошибок

Модуль `features/password/lib/utils/password-errors.util.ts` дублирует логику
web-варианта и работает с локальным `EnumAuthErrorCode`
(`app/api/lib/auth/auth-errors.const.ts`). Новые коды (`PASSWORD_RESET_*`,
`PASSWORD_SAME_AS_OLD`) сейчас сравниваются со строками — мобильный enum их
ещё не содержит. См. followups.

## Открытые хвосты (фронт/мобилка)

- **`packages/nest-api/src/lib/auth-errors.const.ts`** и
  **`app/api/lib/auth/auth-errors.const.ts`** не содержат новых кодов
  (`PASSWORD_RESET_TOKEN_INVALID/EXPIRED/USED`, `PASSWORD_SAME_AS_OLD`,
  `SESSION_NOT_FOUND`). Пока сравниваем со строковыми литералами в
  `password-errors.util.ts`. Добавить коды в enum и прогнать по clients.
- **Mobile deep-link для reset-password**. Если в будущем будет нативный
  экран сброса — надо:
  1. Настроить universal link/app link на домене (`/auth/reset-password`);
  2. Написать экран в `screens/auth/ResetPassword.tsx` + роут в
     navigation stack;
  3. Использовать уже готовый `useResetPasswordMutation`.
- **Человекочитаемые названия устройств в списке сессий.** Парсер
  `session-meta.util.ts` (и web, и mobile) — умышленно простой. Если
  потребуется «iPhone 14 Pro в Берлине», нужен серверный enrichment
  (`User-Agent Client Hints` + GeoIP), парсить это на клиенте — боль.
- **Rate limiting кнопки "Отправить ссылку"/"Выйти везде"** — сейчас UI
  просто дизейблит кнопку, пока мутация в pending. Если бэк внедрит лимиты,
  надо ловить 429 и показывать «попробуйте через N секунд».
- **Отправка email вне очереди при запросе reset** — в `SessionsList` после
  `revokeAllSessions` мы делаем `window.location.replace` — заметили, что
  это выполняется **до** окончания `invalidateQueries`. Инвалидацию
  оставили «на всякий» — на случай, если `replace` заблокируется
  расширением браузера.
- **Документация UX-копии.** Текстовые строки на русском живут прямо в
  JSX. Если появится i18n — их нужно будет вынести в файл переводов.
