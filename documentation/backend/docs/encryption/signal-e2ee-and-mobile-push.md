# Signal E2EE на API и мобильный push (FCM / APNS / VoIP)

Документ описывает **фактическое** устройство backend: хранение ciphertext и ключей, REST для Signal, а также доставку push при «спящем» клиенте и **VoIP push** для входящего звонка. Клиентское приложение React Native в этом репозитории **не документируется** — только контракты API и поведение сервера.

## Модель данных (Prisma)

### Чат и режим шифрования

- `Chat.encryptionMode`: `NONE` | `SIGNAL`. Задаётся при создании, индексируется.
- Поля **`disappearingMessageSeconds`**, **`scheduledDeletionAt`** — политики исчезающих сообщений и отложенного удаления чата (используются вместе с планировщиком в `ChatsModule`).

`ChatType` включает значение `SECRET`; ортогонально ему режим **`ChatEncryptionMode`** описывает именно E2EE Signal vs plaintext на сервере — в документации продуктовые «секретные чаты» обычно соответствуют приватному чату с `encryptionMode: SIGNAL`.

### Сообщения (E2EE поля)

У `Message` при `isEncrypted: true` поле **`content`** хранит **ciphertext** (как принято договориться с клиентом — в веб-клиенте это base64 от бинарного вывода libsignal). Дополнительно:

- `toDeviceId`, `senderDeviceId` — связь с таблицей `devices` (fan-out multi-device),
- `signalMessageType` — тип пакета Signal (pre-key / whisper и т.д.),
- `registrationId` — как у получателя/отправителя в протоколе.

Сервер не валидирует семантику ciphertext, только метаданные и доступ к чату.

### Устройства Signal

- `Device`: `clientDeviceId` (уникален глобально), публичные ключи, pre-keys, one-time pre-keys, `registrationId`.
- Связи `PreKey`, `OneTimePreKey` — как в типичной схеме Signal для сервера-каталога ключей.

### Push-устройства (не путать с Signal Device)

Модель **`PushDevice`**: платформа (`IOS` | `ANDROID` | `WEB`), провайдер (`FCM` | `APNS` | `APNS_VOIP`), токен, опционально **`voipToken`**, флаг активности. Один и тот же пользователь может иметь несколько записей.

## Модуль `encryption`

Путь: `apps/api/src/modules/encryption/`.

Защита: `AccessTokenGuard` + **`EncryptionRateLimitGuard`** на контроллере.

Основные маршруты (префикс API `/api`, тег Swagger `Encryption`):

| Метод | Путь | Назначение |
|--------|------|------------|
| POST | `/encryption/devices/register` | Регистрация устройства и загрузка pre-keys |
| GET | `/encryption/devices/me` | Список своих устройств |
| DELETE | `/encryption/devices/:clientDeviceId` | Удаление устройства |
| PUT | `/encryption/devices/:clientDeviceId/keys` | Обновление публичных ключей |
| POST | `/encryption/devices/:clientDeviceId/one-time-prekeys` | Догрузка one-time pre-keys |
| GET | `/encryption/devices/:clientDeviceId/one-time-prekeys/count` | Запас one-time ключей |
| GET | `/encryption/prekey-bundle/:userId` | Bundles для **всех** устройств пользователя |
| GET | `/encryption/prekey-bundle/:userId/:clientDeviceId` | Bundle для одного устройства |
| GET | `/encryption/users/:userId/fingerprint` | Отпечатки identity для проверки MITM |

Криптография на сервере **не выполняется** — только хранение и выдача публичного материала с проверкой прав (свой user / участник диалога — по реализации сервиса).

## Модуль `invitations`

Приглашения в защищённый приватный чат (`InvitationType.SECRET_PRIVATE` и др.) — `apps/api/src/modules/invitations/`. Связан с UX на фронте (`features/invitations`).

## Планировщик мессенджера

`MessengerScheduleService` в `apps/api/src/modules/chats/` периодически обрабатывает политики удаления сообщений/чатов (поля `expiresAt` у сообщений, `scheduledDeletionAt` у чата). Требуется, чтобы процесс API был запущен, иначе таймеры не отработают.

## Уведомления WebSocket и push

### WebSocket

`NotificationsGateway` (`/notifications`) шлёт in-app уведомления подключённым клиентам. Текущая аутентификация по `userId` в query — ограничение безопасности, см. [notifications.md](../notifications.md).

### Регистрация push-токенов

`NotificationsController` (`AccessTokenGuard`):

- `POST /api/notifications/devices/register` — тело `RegisterPushDeviceDto`: платформа, провайдер, основной `token`, опционально **`voipToken`** для iOS VoIP.
- `POST /api/notifications/devices/deactivate`
- `GET /api/notifications/devices` — активные устройства пользователя.

Реализация: `NotificationsService` (upsert по `token`, привязка к `userId`).

### Провайдеры отправки

Файлы в `apps/api/src/modules/notifications/push/`:

1. **`FcmPushService`** — Firebase Admin SDK. Инициализация из **`FCM_SERVICE_ACCOUNT_JSON`** (строка JSON) или **`FCM_SERVICE_ACCOUNT_PATH`** (путь к файлу). Отправка через `admin.messaging()`; для APNS внутри FCM задаются заголовки вроде `apns-priority`.
2. **`ApnsPushService`** — нативный APNS через пакет `apn`: ключ **`APNS_KEY_PATH`** или **`APNS_KEY`**, **`APNS_KEY_ID`**, **`APNS_TEAM_ID`**, topic по **`APNS_BUNDLE_ID`**.
3. **`ApnsVoipPushService`** — отдельный VoIP-провайдер: может использовать **`APNS_VOIP_*`** или fallback на обычные `APNS_*`. Topic: **`APNS_VOIP_TOPIC`** или `{APNS_BUNDLE_ID}.voip`. Уведомление с `apns-push-type: voip`, `pushType: 'voip'`.

**`PushDispatchService`**:

- `sendToUser(userId, payload)` — для каждого активного `PushDevice` пользователя вызывается провайдер из записи (`FCM` / `APNS` / `APNS_VOIP` — для обычных push используются FCM/APNS).
- `sendIncomingCallVoip(userId, payload)` — только устройства с **`provider: APNS_VOIP`** и заполненным токеном (см. `getActiveVoipDevicesForUser`).

Ошибки отправки приводят к **`deactivateToken`** для мёртвого токена.

### Когда уходит push

- **Новое сообщение** (`MessagesGateway`, событие после создания сообщения): если у получателя **нет** активных сокетов мессенджера, вызывается **`sendToUser`** с заголовком/телом уведомления; для E2EE в тексте используется плейсхолдер, не plaintext.
- **Входящий звонок** (`CallsGateway.handleCallInitiate`): если получатель **не онлайн** в `OnlineUsersService`, вызывается **`sendIncomingCallVoip`** с `data`: `type: incoming_call`, `callId`, `chatId`, `fromUserId`, `callType`.

Медиа звонка по-прежнему идёт через LiveKit; push только будит приложение / доставляет сигнал о вызове.

### Сводка переменных окружения

| Область | Переменные |
|--------|------------|
| FCM | `FCM_SERVICE_ACCOUNT_JSON` или `FCM_SERVICE_ACCOUNT_PATH` |
| APNS (alert) | `APNS_KEY` или `APNS_KEY_PATH`, `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_BUNDLE_ID` |
| APNS VoIP | `APNS_VOIP_KEY`, `APNS_VOIP_KEY_PATH`, `APNS_VOIP_KEY_ID`, `APNS_VOIP_TEAM_ID`, `APNS_VOIP_TOPIC` (частично опциональны за счёт fallback на обычные APNS переменные) |

`NODE_ENV === 'production'` влияет на sandbox/production у провайдера `apn`.

## Связанные документы

- [Уведомления (WebSocket)](../notifications.md)
- [Frontend: Signal E2EE](../../../frontend/docs/encryption/signal-e2ee-messenger.md)
- [Звонки и mobile push: статус интеграции (чеклист)](../calls-push-integration.md)
