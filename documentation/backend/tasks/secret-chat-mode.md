# «Секретный чат» (Backend) — статус

Исторический черновик этого файла описывал отдельные сущности `SecretChatKey` / метаданные без ciphertext — **так в репозитории не сделано**.

## Как устроено сейчас

- **Защищённый диалог** = приватный чат с `Chat.encryptionMode: SIGNAL`. Ciphertext хранится в `Message.content`, ключи — в модуле **`encryption`** (таблица `devices` и pre-keys).
- Приглашения в такой чат — модуль **`invitations`**.
- Таймеры исчезновения / удаления чата — поля в `Chat` / `Message` + **`MessengerScheduleService`**.

Единая каноническая документация: **[Signal E2EE и mobile push](../docs/encryption/signal-e2ee-and-mobile-push.md)** и [фронт: модель двух chatId](../../frontend/tasks/secret-chat-mode.md).

## Связанные задачи

- [E2EE (backend)](./end-to-end-encryption.md)
- [E2EE follow-ups](./e2ee-messenger-followups.md)
