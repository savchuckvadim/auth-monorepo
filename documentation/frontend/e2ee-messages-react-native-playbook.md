# React Native: E2EE сообщений (Signal + тот же API)

Краткий чеклист для мобильного клиента при той же семантике, что и веб (`Chat.encryptionMode`, модуль `/api/encryption`, сообщения с ciphertext).

## Сервер

- Режим чата: `encryptionMode: NONE | SIGNAL` задаётся **только при создании** чата. Смена режима у существующего чата не поддерживается — нужен **новый** `chatId`.
- Регистрация устройства: `POST /api/encryption/devices/register` (тело как в OpenAPI / веб-клиенте).
- Bundles: `GET /api/encryption/prekey-bundle/:userId`.
- Отправка в `SIGNAL`: `POST /api/messages` с `isEncrypted`, `content` (base64 ciphertext), `toDeviceId`, `senderDeviceId`, `signalMessageType`, опционально `registrationId`.

## Клиент RN

1. **Secure storage** вместо `localStorage`: сохранять `clientDeviceId`, при необходимости `serverDeviceId` (id строки в таблице `devices`), те же ключи, что и веб хранит в IndexedDB — либо положить туда же логику через обёртку хранилища.
2. **Libsignal**: та же библиотека или совместимая реализация Signal Protocol; адрес сессии — `(recipientUserId, stableDeviceNumber(clientDeviceId))` как на вебе.
3. **Multi-device**: на каждое устройство получателя — отдельное шифрование и отдельный `POST /api/messages` (как на вебе).
4. **Расшифровка входящих**: по `senderId`, `senderClientDeviceId` (из API при отдаче сообщения с `fromDevice`), `content`, `signalMessageType`.
5. **Токены**: все запросы с тем же JWT / cookie-потоком, что и остальной API.

## Продукт

- «Сделать секретным» = новый чат с `encryptionMode: SIGNAL`, а не переключатель на старом чате.
