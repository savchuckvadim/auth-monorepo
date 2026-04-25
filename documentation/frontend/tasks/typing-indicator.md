# Typing indicator

«{User} печатает…» в чате. Сделано только в памяти — без БД и персистентности.

## Состояние: ✅ web

## Контракты

- Клиент → сервер: `message:typing` `{ chatId }`. Клиент отправляет debounced:
  каждые 3 секунды, пока печатает, и stop-event при сбросе textarea.
- Сервер → клиенты комнаты: `user:typing` `{ chatId, userId, isTyping, userName }`.

## Файлы

- `apps/front/modules/entities/messages/lib/hooks/useTypingEmit.ts` — debounced
  emitter (эмитит первый tick сразу, следующий через 3с, stop-event на пустую строку).
- `apps/front/modules/entities/messages/lib/hooks/useTypingListener.ts` — слушает
  `user:typing`, хранит `Map<userId, {name, lastSeenAt}>`, очищает по TTL 5с.
- `apps/front/modules/entities/messages/ui/TypingDots/TypingDots.tsx` — три точки
  с CSS-анимацией.
- Интеграция: `ChatHeaderWidget` или отдельный `TypingIndicator` над инпутом —
  показывает «N пользователей печатают» через `TypingDots`.

## Edge-cases

- Автор сам себя не видит в «печатает» — гвардим `userId !== currentUserId`.
- Нескольких пользователей печатают одновременно: рендерим имена через запятую,
  ограничиваем 2 имени + «и ещё N».
- Таб в фоне: timeout остановит индикатор, WS не блокируется.
- Rate-limit: сервер не ограничивает, клиент сам debounce'ит.

## Mobile TODO

- Тот же хук (`useTypingEmit` без WS-специфики) пригоден. Нужен порт
  `TypingDots` на `react-native`.
