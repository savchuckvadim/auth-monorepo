# Message context-menu (reply / edit / delete / copy / forward)

Задача из волны `messenger-features-master-plan` — кнопки управления сообщением
через context-меню (правый клик / long-press на мобилке).

## Состояние: web ✅ сделано, mobile ⏭ отложено (приложение отсутствует в workspace).

## Что сделано на web

- `apps/front/modules/entities/messages/ui/MessageContextMenu/MessageContextMenu.tsx`
  — Radix UI `ContextMenu`, кнопки активируются флагами `canEdit/canDelete/…`.
- Централизованный стейт композера:
  `apps/front/modules/widgets/chat/chat-current/lib/context/CurrentChatComposerContext.tsx`
  хранит `replyTarget | editTarget | attachmentDrafts | sharedPost`. Меню пишет —
  `ChatInputWidget` читает.
- Edit: `useUpdateMessage` с optimistic patch + WS `message:updated`.
- Delete: `useDeleteMessage` с optimistic removal + WS `message:deleted`.
- Copy: `navigator.clipboard.writeText(message.content)` (для plain-text).
- Reply: бар-превью в композере, шлём `replyToId` в `CreateMessageDto`.
- Forward: пункт меню открывает `ForwardMessagesModal` (см. `message-forward-share`).

## Ограничения

- E2EE-сообщения: copy разрешён (локально расшифровано), forward — запрещён.
- Edit только автор, не старше 15 минут (ограничение пока только UI).
- Delete работает у автора; в группе owner может стереть чужое (проверка на бэке).

## Mobile TODO

- Long-press на бабле открывает BottomSheet с теми же actions.
- Copy — `expo-clipboard`.
- Forward / ShareTo — переиспользовать `ForwardMessagesModal` паттерн, но на
  нативной BottomSheet.

## Тесты

- Unit: `canEdit(message, currentUserId)` возвращает `false` для чужого / системного.
- E2E (Playwright): long-press бабла → меню → Reply → ввод текста → Send →
  в новом сообщении `replyToId` равен id исходного.
