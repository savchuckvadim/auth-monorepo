# Messenger features expansion — master plan

Мастер-документ волны расширения мессенджера. Волна затрагивает бэк (NestJS),
веб (Next.js) и мобильную точку (в текущем workspace мобильное приложение
отсутствует — мобильные части задокументированы как follow-up и подхватятся
другим агентом при появлении `apps/sociopath/mobile`).

## Итерации и статус

| # | Что | Статус | Ссылки |
|---|-----|--------|--------|
| 1 | Context-меню сообщения: reply / edit / delete / copy (web + mobile) | ✅ сделано на web | [message-context-menu](../../frontend/tasks/message-context-menu.md) |
| 2 | Typing indicator (эвенты `message:typing`/`user:typing`, UI) | ✅ | [typing-indicator](../../frontend/tasks/typing-indicator.md) |
| 3 | `MessageType.CALL_EVENT` — пропущенные звонки как отдельная единица UI | ✅ | [call-event-messages](./call-event-messages.md) |
| 4 | Лайки сообщений (`MessageLike`, `likesCount`, realtime) | ✅ | [message-likes](./message-likes.md) |
| 5 | `MessageAttachment` — полиморфная модель вложений (IMAGE/VIDEO/FILE/VOICE/CIRCLE/POST_SHARE/FORWARD_SNAPSHOT) + загрузка + orphan cleanup | ✅ | [message-attachments](./message-attachments.md) |
| 6 | Web: рендер IMAGE/VIDEO/FILE + composer attach | ✅ | [message-attachments](./message-attachments.md) |
| 7 | Mobile: IMAGE/VIDEO/FILE | ⏭ отложено | — mobile отсутствует |
| 8 | Voice messages (web): `useVoiceRecorder`, waveform, `VoiceMessagePlayer` | ✅ | [voice-messages](../../frontend/tasks/voice-messages.md) |
| 9 | Video circles (web): `VideoCircleRecorderModal` + `CircleMessageVideo`, muted autoplay, tap unmute | ✅ | [video-circles](../../frontend/tasks/video-circles.md) |
| 10 | Forward + share-post: `POST /messages/forward`, `attachmentInputs POST_SHARE`, `ForwardMessagesModal`, `SharePostModal`, `ForwardedMessageCard`, `SharedPostCard` | ✅ | [message-forward-share](./message-forward-share.md) |
| 11 | Страница поста `/network/posts/:id` + placeholder под комменты | ✅ | [posts-comments (backend)](./posts-comments.md), [posts-comments (frontend)](../../frontend/tasks/posts-comments.md) |

## ADR

### ADR-1. Полиморфная модель `MessageAttachment`

Вместо отдельных таблиц для изображений, файлов, голосовых и пр. —
единая таблица `MessageAttachment` с `kind: MessageAttachmentKind` enum:
`IMAGE | VIDEO | AUDIO | VOICE | CIRCLE | FILE | POST_SHARE | FORWARD_SNAPSHOT`.
Для media-типов используются `url/mimeType/size/durationMs/width/height/
thumbnailUrl/waveform`; для `POST_SHARE` — `postId`; для `FORWARD_SNAPSHOT` —
`metadata JSON` со снимком исходного сообщения.

Почему так: позволяет одному сообщению нести гетерогенный набор вложений
(5 фоток + голосовое + пересылка), rendering-слой выбирает компонент по `kind`.

### ADR-2. Detached upload + orphan cleanup

Аттачменты грузятся отдельным `POST /messages/attachments/upload` до создания
сообщения, возвращается `attachmentId`. Клиент прикрепляет его к сообщению
через `attachmentIds: []` в `CreateMessageDto`. Если пользователь не отправил
сообщение — висит в БД как orphan. `MessageAttachmentsCleanupService`
(cron каждый час, с Redis-локом) сносит orphan'ы старше 24ч и чистит S3.

Альтернатива — multipart в одном запросе — плохо для UX: клиент не может
показать прогресс upload + немедленный preview, и нет возможности переиспользовать
upload при смене чата в модалке forward.

### ADR-3. `CALL_EVENT` вместо системного текстового сообщения

Старая схема «звонок пришёл/завершён» = `type=SYSTEM` + plain-text content.
Проблема: клиент не может отрендерить разные иконки (missed/outgoing/incoming),
не может показать длительность, не может локализовать. Решение —
`MessageType.CALL_EVENT` + `metadata: { callId, direction, status, durationMs, … }`.
Клиент рендерит компактный `CallEventNotice` по данным из metadata.

### ADR-4. Forward = snapshot, а не ссылка

Вариант «ссылка на исходник» ломается, если исходник удалили / потеряли доступ.
Снимаем plaintext + authorName + createdAt в `FORWARD_SNAPSHOT.metadata` в момент
пересылки. Запрещено форвардить из E2EE-чатов (iz mode ≠ NONE) — иначе
снапшот утекает в plaintext.

### ADR-5. Typing без отдельной таблицы

Typing живёт только в памяти gateway-процесса. Клиент шлёт
`message:typing` (debounced 3s), сервер транслирует `user:typing` всем в комнате.
TTL на клиенте 5с после последнего события — исчезает «набирает».
Нет persisted state: упала нода — просто перестали «печатать», это
нормально.

## Схемы БД (итог)

```prisma
model Message {
  // ...
  type          MessageType
  metadata      Json?
  isEdited      Boolean       @default(false)
  likesCount    Int           @default(0)
  attachments   MessageAttachment[]
  likes         MessageLike[]
}

model MessageLike {
  messageId String
  userId    String
  createdAt DateTime @default(now())
  @@id([messageId, userId])
}

model MessageAttachment {
  id          String                @id @default(uuid())
  kind        MessageAttachmentKind
  messageId   String?               // nullable → detached upload
  url         String?
  mimeType    String?
  size        Int?
  durationMs  Int?
  width       Int?
  height      Int?
  thumbnailUrl String?
  waveform    Json?
  postId      String?
  metadata    Json?
  createdAt   DateTime              @default(now())
}

enum MessageAttachmentKind { IMAGE VIDEO AUDIO VOICE CIRCLE FILE POST_SHARE FORWARD_SNAPSHOT }
enum MessageType { TEXT SYSTEM CALL_EVENT }
```

## REST API (дельта)

- `POST /messages/attachments/upload` — multipart: `file`, `kind`,
  опц. `durationMs`, `waveform` (json), `width`, `height`. Возвращает
  detached `MessageAttachmentDto`.
- `POST /messages` — `CreateMessageDto.attachmentIds?: string[]`,
  `attachmentInputs?: Array<{ kind, postId?, snapshot? }>`.
- `PATCH /messages/:id`, `DELETE /messages/:id` — уже были, в волне ничего не меняли.
- `POST /messages/:id/like` — toggle, возвращает `{ liked, likesCount }`.
- `GET /messages/:id/likes` — список пользователей.
- `POST /messages/forward` — `{ messageIds, targetChatIds }` → N×M новых сообщений
  с `FORWARD_SNAPSHOT`.

## WebSocket события (дельта)

- `message:updated` / `message:deleted` — уже были, используем для edit/delete.
- `message:liked` — `{ messageId, likesCount, likedByUserId, isLiked }`.
- `message:typing` (клиент → сервер), `user:typing` (сервер → клиент).

## Что НЕ вошло и почему

- Post comments — отдельная волна. Есть два taskdoc'а (backend, frontend) с
  полноценной спекой.
- Reactions (emoji picker) — ограничились single `like`. Расширение сведётся к
  ещё одной таблице `MessageReaction(messageId, userId, emoji)`, но UI существенно
  другой.
- E2EE-вложения — для сообщений с `isEncrypted=true` вложения запрещены на бэке
  (см. `MessagesService.createMessage`). Шифровать media — отдельная большая задача.
- Mobile — не был в workspace, все части помечены как follow-up.

## Выкатка

1. Prisma migrate (attachments, likes, metadata) — уже накатана на dev
   вручную через `prisma migrate diff` + `deploy` (shared БД без shadow).
2. Cron cleanup — включён, требует Redis (уже есть в инфраструктуре).
3. Orval regen (веб DTO) — пока через type-assertion в `useSendMessage`;
   при следующем `orval` станет типобезопасно само.
4. Мобильное приложение — при его появлении взять follow-up taskdoc'и и
   реализовать параллельные экраны. Все бэк-контракты готовы.
