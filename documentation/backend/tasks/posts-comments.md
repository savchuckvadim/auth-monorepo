# Posts — комментарии (отдельная волна)

Комментарии под постом — отдельный функциональный пласт, намеренно вынесен из волны
«Messenger features expansion», потому что затрагивает модель постов, модерацию,
ленту уведомлений и поиск, и делать его «по пути» рискованно.

На веб-странице `/network/posts/:id` и в мобильном `PostScreen` уже есть placeholder
под комментарии (empty-state) — UI-слот готов. Этот taskdoc описывает, что предстоит
сделать на бэке.

## 1. Модель данных

Новая Prisma-модель:

```prisma
model PostComment {
  id         String   @id @default(uuid()) @db.VarChar(255)
  postId     String   @map("post_id") @db.VarChar(255)
  authorId   String   @map("author_id") @db.VarChar(255)
  parentId   String?  @map("parent_id") @db.VarChar(255)
  content    String   @db.Text
  likesCount Int      @default(0) @map("likes_count")
  editedAt   DateTime? @map("edited_at") @db.Timestamp(6)
  deletedAt  DateTime? @map("deleted_at") @db.Timestamp(6)
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamp(6)

  post   Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent PostComment?  @relation("PostCommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  children PostComment[] @relation("PostCommentReplies")
  likes  PostCommentLike[]

  @@index([postId, createdAt])
  @@index([parentId])
}

model PostCommentLike {
  commentId String   @map("comment_id") @db.VarChar(255)
  userId    String   @map("user_id") @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamp(6)

  comment PostComment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([commentId, userId])
}
```

Плюс на `Post` — `commentsCount Int @default(0)`.

## 2. Контракты API

- `GET /posts/:postId/comments?limit=&cursor=&parentId=` — курсорная пагинация по
  `createdAt DESC`. Если `parentId` пустой — только корневые; иначе — ответы на
  указанный комментарий. Возвращает `{ items, nextCursor }`.
- `POST /posts/:postId/comments` — `{ content, parentId? }`. Проверка read-доступа
  к посту (тот же guard, что и на `GET /posts/:id`).
- `PATCH /comments/:id` — только автор, только пока `createdAt` не старше 24ч,
  пишем `editedAt`.
- `DELETE /comments/:id` — мягкое (ставим `deletedAt`), UI показывает "удалено".
- `POST /comments/:id/like` / `DELETE /comments/:id/like` — счётчик.
- `GET /comments/:id/likes?limit=&cursor=` — список лайкеров.

## 3. События и WebSocket

Стрим в комнату `post:<postId>` (новая комната, по аналогии с `chat:<chatId>`):

- `post:comment_created` — `{ comment }`
- `post:comment_updated` — `{ commentId, content, editedAt }`
- `post:comment_deleted` — `{ commentId }`
- `post:comment_liked` — `{ commentId, likesCount, likedByUserId, isLiked }`

Для уведомлений автору поста — отдельный канал `notifications:<userId>`.

## 4. Модерация и лимиты

- Rate-limit: 10 комментариев в минуту на пользователя.
- Максимальная длина — 2000 символов.
- Глубина ответов — 1 (плоская модель replies). Если нужны деревья — обсуждать отдельно.
- Бан-лист матов/спам — через внешний сервис или собственный stop-list (вторая фаза).

## 5. Миграция постов

- Для существующих постов `commentsCount` проставлять 0 при миграции.
- Индексы `(postId, createdAt)`, `(parentId)` — обязательны, иначе пагинация просядет.

## 6. Тесты

- e2e:
  - гость не может комментировать;
  - автор может редактировать свой коммент ≤24ч;
  - удалённый коммент не возвращается в `GET /posts/:id/comments`;
  - лайк commentId → счётчик инкрементится, повторный лайк не меняет;
  - ответ на удалённый родительский коммент — 404.
- unit: ограничитель длины, трансформация DTO.

## 7. Связь с соседними фичами

- Уведомления — подпишемся на существующий механизм уведомлений пользователю
  (автор поста получает "N прокомментировал твой пост").
- Поиск по комментариям — вне scope этой волны.
- Репосты — комментарии не переносятся (каждый репост — свой поток).
