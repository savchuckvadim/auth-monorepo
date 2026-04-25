# Video circles (Telegram-style)

Короткие круглые видеокружки. На веб сделаны, на мобилке — follow-up.

## Состояние: ✅ web, ⏭ mobile

## Запись (web)

- `apps/front/modules/widgets/chat/chat-current/ChatInputWidget/VideoCircleRecorderModal.tsx`
  — полноэкранный overlay.
- Реюзаем `useCamera` из `apps/front/modules/features/post/CreatePost/lib/useCamera.ts`
  (та же самая логика getUserMedia, старт/стоп `MediaRecorder`).
- CSS `clip-path: circle(50%)` плюс `aspect-square` для круглого preview.
- Ограничение длительности: до 60с, автостоп + визуальный ring-таймер.
- При успешной записи blob загружается через `useUploadMessageAttachment`
  с `kind=CIRCLE`, добавляется в `attachmentDrafts` и становится частью
  следующего сообщения.

## Воспроизведение (web)

- `apps/front/modules/entities/messages/ui/MessageAttachmentList/CircleMessageVideo.tsx`.
- 240×240px, `clip-path: circle(50%)`, `muted autoPlay loop playsInline`.
- Tap unmute: клик → `video.muted = false`, появляется иконка звука.
- Не показываем progress bar — используем нативный `<video controls={false}>`.

## Mobile TODO

- `expo-camera` `recordAsync({ maxDuration: 60 })`, preview в круглой `View`
  с `borderRadius: width/2 + overflow: hidden`.
- `expo-av` `Video` с `isMuted + isLooping` для playback.

## UX-нюансы

- Кружочек — отдельная сущность от VIDEO. Отправка одного кружка без текста —
  разрешена (messageContent может быть пустой, см. `useSendMessage`).
- Видимый только один кружок в сообщении (validated на клиенте, бэк не блокирует,
  но UX настраивается, чтобы не путать с VIDEO).
