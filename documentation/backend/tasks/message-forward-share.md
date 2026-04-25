# Forward + Share-post

Пересылка сообщений и прикрепление поста к сообщению.

## Состояние: ✅ бэк, ✅ web

## API

### `POST /messages/forward`

```ts
// request
{ messageIds: string[], targetChatIds: string[] }
// response
{ created: Array<{ chatId: string, message: MessageDto }> }
```

Алгоритм (в сервисе `MessagesService.forwardMessages`):

1. Загружаем исходники по `messageIds` (с `chat`, `sender`).
2. Для каждого — проверяем read-доступ у текущего пользователя и что
   `isEncrypted=false` и `chat.encryptionMode === NONE`. Иначе 403.
3. Для каждого `(source × target)` в цикле:
   - проверяем write-доступ в target-chat;
   - проверяем, что target-chat тоже `encryptionMode === NONE` (иначе 403);
   - создаём новое `Message { type: TEXT, content: '' }` + `MessageAttachment
     { kind: FORWARD_SNAPSHOT, metadata: { sourceMessageId, sourceChatId,
     senderId, senderName, content, createdAt, type } }`;
   - эмитим `message:new` в target-chat.
4. Возвращаем список созданных.

Массив пересылок — атомарный per-source-per-target (если один упадёт, остальные
остаются). Для клиента это удобно, потому что UI всё равно показывает тосты по
результату.

### `POST /messages` с `attachmentInputs=[{kind: POST_SHARE, postId}]`

Встраивается в общий flow создания сообщения. Проверки в `createMessage`:

- Post существует и виден пользователю (reuse guard из `PostsService`).
- Запрещено в E2EE-чатах.
- Несколько POST_SHARE в одном сообщении разрешено (Telegram позволяет, и это
  нормально для «поделись несколькими картинами одним постом»).

## Клиентские модалки

- `ForwardMessagesModal` — multi-select чатов (исключаем `SIGNAL`), поиск по имени.
- `SharePostModal` — две вкладки (Мои / Лента), поиск по тексту поста; при
  выборе кладёт `sharedPost` в `CurrentChatComposerContext`, `ChatInputWidget`
  показывает bar-превью, на `Send` — вставляется в `attachmentInputs`.

## Рендер

- `ForwardedMessageCard` — серая полоска слева, «Пересланное от {sender}», 3
  строки текста, без аватара (чтобы не путать с reply).
- `SharedPostCard` — карточка с thumbnail (если есть), автором и 3 строками
  текста; при клике — переход на `/network/posts/:postId`.

## Ограничения и follow-ups

- Для FORWARD_SNAPSHOT не переносятся вложения исходника — только текст. Forward
  сообщения с картинкой в MVP показывает «Пересланное от …» без самой картинки.
  В следующей волне — копировать ссылку на `MessageAttachment` или дублировать.
- POST_SHARE не обновляется, если пост отредактировали — клиент запрашивает
  пост по `postId` при рендере, так что видит актуальную версию.
- Если пост удалили — `SharedPostCard` показывает заглушку «Пост недоступен».
