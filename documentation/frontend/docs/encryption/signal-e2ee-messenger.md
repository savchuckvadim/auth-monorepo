# Signal E2EE и «секретные» чаты (Next.js)

## Роль сервера

Сервер **не расшифровывает** сообщения. Для чатов с `encryptionMode: SIGNAL` он хранит **ciphertext** в поле `Message.content`, размечает флаги `isEncrypted`, `signalMessageType`, `toDeviceId`, `senderDeviceId`, `registrationId` и раздаёт **публичные** ключи устройств (pre-key bundles) через модуль `encryption`. Обмен plaintext происходит только на клиентах.

Обычный приватный чат (`encryptionMode: NONE`) хранит текст как есть; защищённый канал с тем же контактом — **отдельный** `chatId` с `SIGNAL` (см. ниже).

## Обычный vs Signal: две переписки на одного собеседника

- **`Chat.encryptionMode`** задаётся **только при создании** чата (`POST /api/chats`) и **не меняется** через PATCH.
- Одна пара участников может иметь **два** приватных чата: `NONE` и `SIGNAL` — сервер дедуплицирует по паре + режиму.
- В UI «переключение» — это переход между двумя `chatId` или создание второго чата с нужным режимом.

Кодовые точки:

- Поиск существующего приватного чата: `apps/front/modules/entities/chats/lib/utils/find-private-chat-with-peer.ts`
- Создание/открытие: `apps/front/modules/entities/chats/lib/hooks/useEnsurePrivateChat.ts`
- Создание с чекбоксом Signal: `apps/front/modules/widgets/chat/chat-create/`
- Шапка и переключение канала: `apps/front/modules/widgets/chat/chat-current/`

## Стек на клиенте

- Библиотека: **`@privacyresearch/libsignal-protocol-typescript`** (Signal Protocol: X3DH, сессии, Double Ratchet внутри `SessionCipher`).
- Персистентное хранилище ключей и сессий: **IndexedDB** — `apps/front/modules/entities/encryption/lib/signal-idb-storage.ts`.
- Высокоуровневая логика: `apps/front/modules/entities/encryption/lib/messenger-e2ee.ts`.

### Адресация устройств

- Libsignal ожидает адрес `(userId, deviceId: number)`. Строковый `clientDeviceId` с API маппится в число через **`stableDeviceNumber()`** (стабильный хеш), см. комментарии в `messenger-e2ee.ts`.
- На сервере устройство имеет строку **`clientDeviceId`** и внутренний UUID строки `Device.id`; в сообщениях используются связи `toDeviceId` / `senderDeviceId` на таблицу `devices`.

### Multi-device (исходящее)

Для каждого устройства получателя запрашивается pre-key bundle (`GET /api/encryption/prekey-bundle/:userId`), строится сессия, шифруется **отдельный** ciphertext; на сервер уходит несколько сообщений (fan-out по устройствам).

### Входящее

Расшифровка по паре отправитель + `senderClientDeviceId` / типу Signal; порядок по одному отправителю/устройству должен быть **последовательным** (см. комментарии в `messenger-e2ee.ts`).

### Кеш plaintext (UX)

В `messenger-e2ee.ts` описан компромисс: кеш расшифрованного/отправленного текста может жить в **localStorage** (`signal-*-plaintext-cache.ts`) — это не часть протокола и важно учитывать в модели угроз.

## Интеграция в мессенджер

- Отправка: `apps/front/modules/entities/chats/lib/hooks/useSendMessage.ts` — для `SIGNAL` и приватного чата вызывается E2EE; **групповые чаты с SIGNAL отключены** (явная ошибка пользователю).
- Сокеты: `useChatSocket.ts` — события доставляют уже сохранённое сообщение; клиент расшифровывает при отображении.
- Приглашения в защищённый диалог: `apps/front/modules/features/invitations/`
- Политики исчезающих сообщений / таймеры удаления чата: `apps/front/modules/features/secret-chat/` (согласовано с планировщиком на API, см. backend-док).

## Отличия превью и уведомлений

Сервер в сокетах/уведомлениях для зашифрованных сообщений подставляет плейсхолдеры (например `[E2EE message]` в потоке уведомлений на backend), чтобы не слать plaintext в push.

## Связанные документы

- [Backend: Signal, ключи и push](../../../backend/docs/encryption/signal-e2ee-and-mobile-push.md)
- [Задача: режим секретного чата (фактическая модель)](../../tasks/secret-chat-mode.md)
