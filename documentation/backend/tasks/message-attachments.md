# Message attachments — полиморфная модель

## Состояние: ✅ бэк, ✅ web (render + attach)

См. также ADR-1 и ADR-2 в `messenger-features-master-plan.md`.

## Схема

```prisma
enum MessageAttachmentKind {
  IMAGE VIDEO AUDIO VOICE CIRCLE FILE POST_SHARE FORWARD_SNAPSHOT
}

model MessageAttachment {
  id          String                @id @default(uuid())
  kind        MessageAttachmentKind
  messageId   String?
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
  @@index([messageId])
  @@index([messageId, id]) // для consistent reads
}
```

## Flow отправки с файлом

1. Клиент выбирает файл → `POST /messages/attachments/upload` (multipart).
   - Поля: `file` (required), `kind` (required), опц. `durationMs`, `waveform`,
     `width`, `height`.
   - Сервер кладёт в S3 под `attachments/<kind>/<userId>/<uuid>.<ext>`, возвращает
     detached `MessageAttachment` с `messageId=null`, `id`, `url`.
2. Клиент держит `attachmentId` локально, при отправке сообщения шлёт
   `POST /messages { chatId, content, attachmentIds: [id1, id2, …] }`.
3. Сервер в транзакции валидирует (принадлежит ли uploader, не прикреплён ли
   уже), связывает `attachment.messageId = newMessage.id`.

## Inline attachments (`attachmentInputs`)

Для типов без файла:

- `{ kind: 'POST_SHARE', postId }` — проверяется доступ к посту, записывается
  `postId`.
- `{ kind: 'FORWARD_SNAPSHOT', snapshot }` — создаётся через `forwardMessages`
  сервиса, а не клиентом напрямую.

Клиент может передать оба массива: `attachmentIds` + `attachmentInputs`, они
объединяются в порядке `[attachmentIds..., attachmentInputs...]`.

## Валидации

- `file.size` ≤ 100 MiB (регулируется env-переменной).
- `kind=IMAGE`: mime начинается с `image/`; ограничение ширины/высоты нет,
  но на клиенте есть down-sample.
- `kind=VIDEO|CIRCLE`: `video/*`, длительность ≤ 60с (для CIRCLE), ≤ 5мин
  (для VIDEO).
- `kind=VOICE|AUDIO`: `audio/*`.
- `kind=FILE`: whitelist по mime-прошивке (pdf, docx, xlsx, pptx, zip, txt, ...)
  либо размер ≤ лимита.
- Сообщения с `isEncrypted=true` — **запрет любых attachments** (шифрование
  media — вне scope).
- Пользователь не может прикрепить чужой attachment.

## Cleanup

`MessageAttachmentsCleanupService` (`@Cron('0 * * * *')`):

- Redis-lock `lock:msg-att-cleanup` с `NX EX 300`. Держит одна инстанция.
- `messagesRepository.deleteOrphanAttachments(ageHours: 24)` — удаляет записи,
  у которых `messageId IS NULL AND createdAt < now - 24h`, возвращая `url[]`.
- `s3Service.deleteFiles(urls)` — bulk delete в S3.
- Логирует число удалённых + ошибки S3 (не ре-райз, чтобы одна нерабочая запись
  не блокировала всё).

## События

- `message:new` после `createMessage` теперь включает `attachments[]` в payload.
- Отдельных событий `attachment:uploaded` нет: весь lifecycle виден клиенту
  через ответы REST-запросов.

## Что не реализовано, но предусмотрено

- Thumbnail-генерация на сервере (ffprobe/sharp) — поля `thumbnailUrl` уже
  есть, но пока пишет клиент (или не пишет вовсе).
- Video transcoding — видео грузится as-is, клиент играет родной mp4/webm.
- Progressive image (BlurHash) — есть поле `metadata` в базе, можно писать туда.
