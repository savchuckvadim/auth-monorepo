# Модули Backend

## Обзор

Все бизнес-модули находятся в `src/modules/`. Каждый модуль представляет отдельную бизнес-область.

## Список модулей

### 1. `auth` - Аутентификация

**Назначение**: Регистрация, вход, выход, активация email, обновление токенов.

**Endpoints**:
- `POST /api/auth/registration` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/auth/activate/:link` - активация email
- `POST /api/auth/refresh` - обновление токена
- `GET /api/auth/logout` - выход

**Компоненты**:
- `AuthController` - REST контроллер
- `AuthService` - бизнес-логика
- `LoginDto`, `AuthenticatedUserDto` - DTO

**Зависимости**: `UserModule`, `TokenModule`, `MailModule`

Подробнее: [Документация по Auth](./auth.md)

---

### 2. `user` - Пользователи

**Назначение**: Управление пользователями.

**Endpoints**:
- `GET /api/user` - список всех пользователей
- `GET /api/user/:id` - пользователь по ID

**Компоненты**:
- `UserController` - REST контроллер
- `UserService` - бизнес-логика
- `UserRepository` - работа с БД
- `UserDto`, `CreateUserDto` - DTO

**Зависимости**: `TokenModule`

**Swagger**: [User API](https://api.sociopath-network.ru/docs/api#/User)

---

### 3. `post` - Посты

**Назначение**: Создание, получение, лайки, репосты постов.

**Endpoints**:
- `GET /api/post` - лента постов
- `POST /api/post` - создание поста
- `GET /api/post/:id` - пост по ID
- `PUT /api/post/:id` - обновление поста
- `DELETE /api/post/:id` - удаление поста
- `POST /api/post/:id/like` - лайк поста
- `POST /api/post/:id/repost` - репост

**Компоненты**:
- `PostController` - REST контроллер
- `PostService` - бизнес-логика
- `PostRepository` - работа с БД
- `PostGateway` - WebSocket для real-time обновлений
- `PostDto`, `CreatePostDto` - DTO

**Зависимости**: `TokenModule`, `S3Module`, `FollowersModule`

**Swagger**: [Post API](https://api.sociopath-network.ru/docs/api#/Post)

---

### 4. `chats` - Чаты

**Назначение**: Создание и управление чатами.

**Endpoints**:
- `GET /api/chats` - список чатов пользователя
- `POST /api/chats` - создание чата
- `GET /api/chats/:id` - информация о чате
- `PUT /api/chats/:id` - обновление чата

**Компоненты**:
- `ChatsController` - REST контроллер
- `ChatsService` - бизнес-логика
- `ChatsRepository` - работа с БД
- `CreateChatDto`, `ChatDto` - DTO

**Зависимости**: `TokenModule`

**Swagger**: [Chats API](https://api.sociopath-network.ru/docs/api#/Chats)

---

### 5. `messages` - Сообщения

**Назначение**: Отправка и получение сообщений в чатах.

**Endpoints**:
- `GET /api/messages/:chatId` - сообщения чата
- `POST /api/messages` - отправка сообщения

**Компоненты**:
- `MessagesController` - REST контроллер
- `MessagesService` - бизнес-логика
- `MessagesRepository` - работа с БД
- `MessagesGateway` - WebSocket для real-time сообщений
- `SocketStorageService` - хранение socket соединений
- `MessageDto`, `CreateMessageDto` - DTO

**Зависимости**: `ChatsModule`, `TokenModule`, `NotificationsModule`, `RedisModule`

**Swagger**: [Messages API](https://api.sociopath-network.ru/docs/api#/Messages)

Поддержка **Signal E2EE**: поля сообщения `isEncrypted`, ciphertext в `content`, связи с `Device`; см. [Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md).

---

### 6. `encryption` - Signal E2EE (ключи и устройства)

**Назначение**: каталог публичных ключей устройств (pre-key bundles), без расшифровки на сервере.

**Endpoints** (префикс `/api/encryption`, см. Swagger `Encryption`): регистрация устройства, обновление ключей, one-time pre-keys, выдача bundle для пользователя/устройства, fingerprint.

**Компоненты**: `EncryptionController`, `EncryptionService`, `EncryptionRateLimitGuard`.

**Зависимости**: `TokenModule`, Prisma.

Подробнее: [Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md).

---

### 7. `invitations` - Приглашения

**Назначение**: приглашения в защищённый приватный чат и другие сценарии (типы в `InvitationType`).

**Компоненты**: контроллер и сервис модуля `invitations`.

Связь с фронтом: `features/invitations`.

---

### 8. `calls` - Звонки

**Назначение**: Управление видеозвонками и аудиозвонками через LiveKit.

**Endpoints**:
- `POST /api/calls/token` - получение токена LiveKit

**Компоненты**:
- `CallsController` - REST контроллер
- `CallsService` - бизнес-логика
- `LiveKitService` - интеграция с LiveKit
- `CallsGateway` - WebSocket для управления звонками
- `OnlineUsersService` - отслеживание онлайн пользователей

**Swagger**: [Calls API](https://api.sociopath-network.ru/docs/api#/Calls)

**Mobile**: при офлайн-получателе возможен **VoIP push** через `PushDispatchService.sendIncomingCallVoip` — см. [Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md), [чеклист интеграции](./calls-push-integration.md).

---

### 9. `followers` - Подписки

**Назначение**: Подписка на пользователей, получение списка подписчиков и подписок.

**Endpoints**:
- `POST /api/followers/:userId` - подписка на пользователя
- `DELETE /api/followers/:userId` - отписка от пользователя
- `GET /api/followers/:userId/followers` - подписчики пользователя
- `GET /api/followers/:userId/following` - подписки пользователя

**Компоненты**:
- `FollowersController` - REST контроллер
- `FollowersService` - бизнес-логика
- `FollowersRepository` - работа с БД
- `FollowDto` - DTO

**Swagger**: [Followers API](https://api.sociopath-network.ru/docs/api#/Followers)

---

### 10. `profile` - Профили

**Назначение**: Управление профилями пользователей.

**Endpoints**:
- `GET /api/profile/:userId` - профиль пользователя
- `PUT /api/profile` - обновление профиля

**Компоненты**:
- `ProfileController` - REST контроллер
- `ProfileService` - бизнес-логика
- `ProfileRepository` - работа с БД
- `ProfileDto`, `UpdateProfileDto` - DTO

**Swagger**: [Profile API](https://api.sociopath-network.ru/docs/api#/Profile)

---

### 11. `token` - Токены

**Назначение**: Генерация и валидация JWT токенов.

**Компоненты**:
- `TokenService` - генерация и валидация токенов
- `TokenRepository` - работа с БД (хранение refresh токенов)
- `TokenPayloadDto`, `TokensDto` - DTO

**Используется**: `AuthModule`, `AccessTokenGuard`

---

### 12. `mail` - Email

**Назначение**: Отправка email через очереди Bull.

**Компоненты**:
- `MailService` - отправка email
- `MailProcessor` - обработка задач из очереди
- `EmailVerificationTemplate` - шаблон письма активации

**Очереди**: `QueueNames.MAIL`

---

### 13. `notifications` - Уведомления

**Назначение**: Real-time уведомления через WebSocket и **mobile push** (FCM, APNS, APNS VoIP).

**Компоненты**:
- `NotificationsGateway` — WebSocket namespace уведомлений
- `NotificationsController` — регистрация push-токенов (`POST /api/notifications/devices/register` и др.)
- `FcmPushService`, `ApnsPushService`, `ApnsVoipPushService`, `PushDispatchService`

**Используется**: `MessagesModule` (уведомления о новых сообщениях, fallback push если нет сокета), `CallsModule` (VoIP для входящего звонка).

Подробнее: [Уведомления](./notifications.md), [Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md), [чеклист звонков и push](./calls-push-integration.md).

---

### 14. `presence` - Статус онлайн

**Назначение**: Отслеживание статуса онлайн/офлайн пользователей.

**Компоненты**:
- `PresenceService` - бизнес-логика
- `PresenceGateway` - WebSocket gateway

---

### 15. `telegram` - Telegram интеграция

**Назначение**: Интеграция с Telegram для отправки сообщений.

**Endpoints**:
- `POST /api/telegram/send-message` - отправка сообщения в Telegram

**Компоненты**:
- `TelegramController` - REST контроллер
- `TelegramService` - бизнес-логика

**Swagger**: [Telegram API](https://api.sociopath-network.ru/docs/api#/Telegram)

---

## Структура модуля

Каждый модуль следует единой структуре:

```
modules/example/
├── example.module.ts      # Модуль NestJS
├── controllers/           # REST контроллеры
│   └── example.controller.ts
├── services/             # Бизнес-логика
│   └── example.service.ts
├── repositories/         # Работа с БД (опционально)
│   ├── example.repository.ts        # Интерфейс
│   └── example.prisma.repository.ts  # Реализация
├── dto/                  # Data Transfer Objects
│   └── example.dto.ts
├── socket/               # WebSocket gateways (опционально)
│   └── example.gateway.ts
└── index.ts              # Public API модуля
```

## Зависимости между модулями

```
auth → user, token, mail
user → token
post → token, s3, followers
chats → token
encryption → token
messages → chats, token, notifications, redis, encryption
calls → notifications, messages, token
followers → (независимый)
profile → (независимый)
```

## Swagger документация

Все модули документированы в Swagger:
- [Swagger UI](https://api.sociopath-network.ru/docs/api)

## Ссылки

- [Swagger API](https://api.sociopath-network.ru/docs/api)
- [Инструкция по добавлению модуля](./adding-module.md)
