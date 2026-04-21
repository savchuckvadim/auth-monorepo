# Сквозное шифрование для чатов (Backend) — статус

## Статус

**Реализовано:** модуль `encryption` (регистрация устройств, pre-key bundles, fingerprint, rate limiting), расширения `messages` / `chats` под ciphertext и multi-device, модуль `invitations`, планировщик политик удаления в `chats`.

Полное описание схемы БД, эндпоинтов и push: **[документация Signal E2EE и mobile push](../docs/encryption/signal-e2ee-and-mobile-push.md)**.

Фронт (клиент Signal): **[Signal E2EE (Next.js)](../../frontend/docs/encryption/signal-e2ee-messenger.md)**.

## Сделано

- Хранение публичных ключей устройств и выдача bundle для X3DH на клиентах.
- Сообщения с `isEncrypted`, привязкой к `Device`, типом Signal — без расшифровки на сервере.
- Multi-device: несколько записей сообщения (fan-out) на стороне клиента/сервиса сообщений согласно DTO.

## Остаётся (см. также follow-ups)

- Автоматическая ротация signed pre-keys на сервере по cron — уточнять по коду `EncryptionService` / операции.
- Групповой SIGNAL — при появлении требований.
- Медиа-E2EE LiveKit — на стороне клиентов; токены LiveKit без изменений для E2EE.

## Связанные задачи

- [Frontend E2EE](../../frontend/tasks/end-to-end-encryption.md)
- [Секретный чат (модель продукта)](./secret-chat-mode.md)
- [E2EE и мессенджер — follow-ups](./e2ee-messenger-followups.md)
