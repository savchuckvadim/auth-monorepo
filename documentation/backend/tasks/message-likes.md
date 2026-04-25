# Message likes

Один "❤" на сообщение от каждого пользователя (single-reaction). Расширение до
эмодзи-палитры — отдельная задача.

## Состояние: ✅ бэк, ✅ web

## Схема

```prisma
model Message {
  likesCount Int @default(0)
  likes      MessageLike[]
}

model MessageLike {
  messageId String
  userId    String
  createdAt DateTime @default(now())
  @@id([messageId, userId])
}
```

## API

- `POST /messages/:id/like` — toggle. Транзакция:
  - если `MessageLike` существует → delete + `likesCount--`;
  - иначе → insert + `likesCount++`.
  Возвращает `{ liked: boolean, likesCount: number }`.
- `GET /messages/:id/likes?limit=&offset=` — пагинация списка пользователей.

## WebSocket

- Событие `message:liked` в комнату `chat:<chatId>`:
  `{ messageId, likesCount, likedByUserId, isLiked }`.
  Клиент обновляет кэш сообщения оптимистично и отслушивает событие, чтобы
  консистентно работать с counter'ом у всех участников.

## Edge-cases

- Лайк удалённого (`deletedAt != null`) сообщения — 400.
- Пользователь без read-доступа к чату — 403.
- Лайк собственного сообщения — разрешён (не блокируем).
- E2EE-сообщения — лайки разрешены (они считают metadata, не plaintext).

## Тесты

- e2e: toggle → counter 0→1→0, `GET /likes` возвращает правильного лайкера.
- race: двойной POST за 10мс → счётчик валиден (транзакция на уникальный ключ).
