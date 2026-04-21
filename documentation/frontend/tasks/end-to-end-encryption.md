# Сквозное шифрование для чатов (Next.js) — статус

## Статус

**Текстовый мессенджер с Signal E2EE для приватных чатов (`encryptionMode: SIGNAL`) и multi-device реализован** в `apps/front` (libsignal + IndexedDB, интеграция в `useSendMessage`, сокеты).

Каноническое описание архитектуры, файлов и отличий от обычных чатов: **[документация Signal E2EE](../docs/encryption/signal-e2ee-messenger.md)**.

Бэкенд (ключи, ciphertext, rate limit): **[Signal E2EE и mobile push](../../backend/docs/encryption/signal-e2ee-and-mobile-push.md)**.

## Сделано по сути задачи

- Регистрация Signal-устройства и pre-key bundles через API.
- Шифрование исходящих сообщений для каждого устройства получателя; расшифровка входящих.
- Отдельный приватный чат с тем же контактом для канала `SIGNAL` vs `NONE`.
- UI секретного чата (политики, приглашения) — см. `features/secret-chat`, `features/invitations`.

## Остаётся отдельными задачами

- **Медиа-E2EE (LiveKit)** — не входит в текущую реализацию текста; при необходимости — отдельный объём на клиентах звонков (см. [чат и WebRTC](../docs/chat-webrtc.md)).
- **Групповые чаты + SIGNAL** — на фронте явно запрещено в `useSendMessage`; требуется продуктовое решение и поддержка API.
- **Верификация fingerprint в UI**, полнота тестов, жёсткая политика кеша plaintext — см. [follow-ups по усилению](../../backend/tasks/e2ee-messenger-followups.md).

## Справочно: протокол Signal

Double Ratchet, X3DH, pre-keys; примитивы Curve25519 / AES-256 / HMAC — стандартная модель Signal; детали в коде `messenger-e2ee.ts` и внешней документации библиотеки.

## Связанные задачи

- [Режим секретного чата (модель двух chatId)](./secret-chat-mode.md)
- [Backend: E2EE](../../backend/tasks/end-to-end-encryption.md)
