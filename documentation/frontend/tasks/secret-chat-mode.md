# Секретный / защищённый чат (модель продукта)

## Статус

Реализовано в монорепозитории (ветка `end-to-end-encryption`, коммиты с Signal E2EE). Подробное описание поведения и файлов: **[документация Signal E2EE (фронт)](../docs/encryption/signal-e2ee-messenger.md)**.

## Фактическая модель

- С обычным и защищённым (Signal E2EE) диалогом с одним контактом — **два разных чата** (`chatId`). Поле API: `Chat.encryptionMode`: `NONE` | `SIGNAL`.
- Режим задаётся **только при создании** чата и **не меняется**. Переход в UI — открыть другой чат или создать второй приватный с нужным `encryptionMode` (сервер вернёт существующий, если пара участников и режим уже совпадают).
- В режиме **`SIGNAL`** на сервере хранится **ciphertext** в `Message.content` с флагом `isEncrypted`; plaintext только на клиентах. Это **не** модель «только IndexedDB без сервера».

## Ориентиры по коду

- Поиск чата: `apps/front/modules/entities/chats/lib/utils/find-private-chat-with-peer.ts`
- Открыть или создать: `apps/front/modules/entities/chats/lib/hooks/useEnsurePrivateChat.ts`
- Текущий чат: `apps/front/modules/widgets/chat/chat-current/`
- Создание чата (чекбокс Signal): `apps/front/modules/widgets/chat/chat-create/`
- Строка в списке чатов: `apps/front/modules/widgets/chat/chat-list/ChatListItem/ChatListItem.tsx`

## Бэкенд

- Инварианты, ключи, push: [Signal E2EE и mobile push (backend)](../../backend/docs/encryption/signal-e2ee-and-mobile-push.md)

## Что можно сделать дальше (не блокирует работу)

- Сгенерировать Orval-клиент после поднятого API: `pnpm run generate` в `packages/nest-api` (см. README пакета).
- Опционально: `GET /chats/private-with-user?peerUserId=&encryptionMode=` — чтобы не искать чат в полном списке на клиенте.
- Групповые чаты + `SIGNAL`: на фронте отправка E2EE для групп отключена в `useSendMessage`.
