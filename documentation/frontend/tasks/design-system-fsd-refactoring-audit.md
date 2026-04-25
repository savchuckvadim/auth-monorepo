# Design System и FSD-рефакторинг frontend-приложения

## Назначение

Провести системный рефакторинг `apps/front`, чтобы приложение опиралось на собственную дизайн-систему и аккуратные FSD-границы. Цель не просто "почистить компоненты", а привести UI и кодовую архитектуру к состоянию, где:

- UI-компоненты удобно переиспользовать в любом месте без копирования Tailwind-классов.
- Состояния кнопок, списков, карточек, форм, пустых/error/loading блоков выглядят единообразно.
- `entities`, `features`, `widgets`, `processes`, `shared` имеют понятные границы.
- Модули сообщений, чатов, постов, профиля, auth/settings не копят несвязанные ответственности.
- Старый/неиспользуемый код удаляется или переносится в правильный слой.

Эта задача дополняет и конкретизирует [создание дизайн-системы](./design-system.md), [рефакторинг](./refactoring.md), [Filter/Search](./filter-search-components.md), [auth forms unification](./auth-forms-unification.md), [people page](./people-page.md), [posts design](./posts-design.md), [performance optimization](./performance-optimization.md), [testing](./testing.md).

## Текущее состояние

Проект уже частично следует FSD:

- `app/` содержит Next routes и route wrappers.
- `modules/shared` содержит UI, socket/lib утилиты, form wrappers.
- `modules/entities` содержит доменные сущности: `messages`, `chats`, `post`, `user`, `profile`, `followers`, `presence`, `encryption`.
- `modules/features` содержит пользовательские действия: password, chat modals, secret chat settings, calls, notifications, post creation.
- `modules/widgets` содержит крупные композиции страниц: header, navigation, chat current/list/create, profile blocks, call wrapper.
- `modules/processes` содержит auth/routing.

Но приложение уже достаточно большое, и появились типичные признаки накопленного долга:

- Часть design-system паттернов живёт в `modules/shared/ui`, часть напрямую в `@workspace/ui/components/*`, часть дублируется в feature/widget коде.
- В `entities/messages` накопились UI, client-only flows, socket/cache logic, message actions, attachments, voice/circle UI, forward/reply/edit concerns.
- В `features/post/CreatePost` есть крупный feature с камерой, upload, audio, media preview и legacy-файлом.
- В `features/notifiactions` остался legacy Redux notification slice/toast после перехода на `AppToast`.
- В `widgets/chat/chat-current` скопилась composer-логика, которую уже начали выносить, но нужно довести до устойчивого FSD-паттерна.
- Есть множество прямых импортов shadcn-примитивов (`Button`, `Input`, `Card`, `Avatar`, `Textarea`) вместо собственных DS-компонентов.
- Есть точечные wrappers (`AppButton`, `AppCard`, `AppSurfaceCard`, `AppDialog`, `AppTooltip`, `FormField`, `Avatar`, `AppToast`), но нет единого уровня правил: когда использовать primitive, когда app wrapper, когда feature-specific component.

## Главная проблема на примере

Фрагмент:

```tsx
export const SettingsButton = () => {
    const router = useRouter();
    return (
        <AppTooltip content="Settings">
            <Button variant="ghost" size="icon" onClick={() => router.push('/network/settings')} aria-label="Настройки">
                <Settings className="w-4 h-4" />
            </Button>
        </AppTooltip>
    );
};
```

Проблема не в самом `SettingsButton`, а в повторяющемся паттерне:

- icon-only action button,
- tooltip,
- route navigation,
- aria-label,
- `ghost`/`icon` styling,
- одинаковые hover/focus/disabled states.

Такие паттерны должны быть оформлены как дизайн-системные или shared UI-компоненты, например:

```tsx
<AppIconAction
    icon={Settings}
    label="Настройки"
    tooltip="Settings"
    href="/network/settings"
/>
```

Тогда `SettingsButton`, theme toggle, logout/settings/header/chat toolbar actions, call controls и прочие кнопки перестают расходиться визуально.

## Целевая архитектура дизайн-системы

### Уровень 1: `packages/ui`

Оставить как shadcn/Radix primitives:

- `Button`
- `Input`
- `Textarea`
- `Dialog`
- `DropdownMenu`
- `Tooltip`
- `Checkbox`
- `Avatar`
- `Card`
- `Alert`
- `Badge`

Правило: primitives используются напрямую только внутри `shared/ui`/design-system компонентов или в очень специфичных местах, где нет подходящего app-level компонента.

### Уровень 2: `modules/shared/ui` или будущий `packages/design-system`

Собственные app-level UI-компоненты без бизнес-логики:

- `AppButton`
- `AppIconAction`
- `AppActionList`
- `AppSettingsRow`
- `AppDialog`
- `AppConfirmDialog`
- `AppToast`
- `AppTooltip`
- `FormField`
- `PasswordField` через `FormField passwordRevealToggle`
- `Avatar`
- `UserIdentity`
- `UserListRow`
- `SearchInput`
- `FilterSegmentStrip`
- `Empty`
- `Error`
- `Loading`
- `VirtualInfiniteList`
- `VirtualInfiniteGrid`
- `BackToTopButton`

Правило: здесь нельзя держать доменную логику сообщений, постов, чатов, auth. Только UI-контракты и app-wide визуальные паттерны.

### Уровень 3: entity UI

Компоненты, которые отображают доменную модель, но не запускают бизнес-flow:

- `MessageBubble`, `MessageAttachmentList`, `VoiceMessagePlayer`
- `PostCard`, `PostHeader`, `PostStats`
- `ChatListItemView`
- `UserCard/UserPersonCard`

Правило: entity UI может знать форму entity-типа, но не должен открывать модалки feature-flow, создавать чаты, отправлять сообщения, делать навигацию с побочными эффектами.

### Уровень 4: features

Пользовательские действия:

- `ForwardMessagesModal`
- `SharePostModal`
- `CreatePost`
- `ChangePasswordForm`
- `ResetPasswordForm`
- `SecretChatSettings`
- `CallControls`
- `NotificationsSocket`
- `Follow/Unfollow`

Правило: feature может использовать entities и shared UI, но не должна становиться большим page/widget.

### Уровень 5: widgets

Большие композиции:

- `Header`
- `Navigation`
- `ChatInputWidget`
- `CurrentChatWidget`
- `ChatListWidget`
- `CreateChatDialogWidget`
- `ProfileInformation`
- `ProfilePosts`
- `CallWrapperWidget`

Правило: widget собирает feature/entity/shared, но не должен содержать глубокой бизнес-логики, если её можно вынести в hooks/model.

## Инвентаризация проблем по модулям

### `modules/shared/ui`

Что уже хорошо:

- Есть `AppButton`, `AppDialog`, `AppTooltip`, `FormField`, `Avatar`, `AppToast`, `VirtualInfiniteList/Grid`, `BackToTopButton`.
- Есть первые попытки создать app-level обертки над shadcn.

Проблемы:

- `AppCard` экспортирует `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, то есть снова протаскивает внутренние части наружу. Это противоречит задаче [design-system.md](./design-system.md).
- `AppButton` конкурирует с прямым `Button` из `@workspace/ui/components/button`. Прямые `Button` ещё используются во многих местах:
  - `modules/features/settings/ui/SettingsButton.tsx`
  - `modules/processes/auth/ui/Logout/Logout.tsx`
  - `modules/shared/ui/ThemeToggle/ThemeToggle.tsx`
  - `modules/widgets/navigation/NavItem.tsx`
  - `modules/widgets/chat/SecretChatSettingsMenu/SecretChatSettingsMenu.tsx`
  - `modules/widgets/call/CallWrapper/components/*`
  - `modules/features/post/CreatePost/*`
  - `modules/features/chat/ForwardMessagesModal/ForwardMessagesModal.tsx`
  - `modules/features/chat/SharePostModal/SharePostModal.tsx`
- `Avatar` использует кастомную реализацию и частично закомментированный старый shadcn вариант. Нужно нормализовать API и fallback.
- `AppToast` добавлен как новый паттерн, но legacy `features/notifiactions/model/NotificationSlice.ts` и `ui/NotificationToast.tsx` нужно удалить после проверки.

Рефакторинг:

- Создать `AppIconAction` для icon-only buttons с tooltip/href/onClick/loading/disabled.
- Создать `AppActionList` и `AppActionListItem` для списков настроек/actions.
- Создать `AppSettingsRow` для settings screens.
- Перевести `SettingsButton`, `ThemeToggle`, `Logout`, toolbar buttons, secret chat menu actions на эти компоненты.
- Запретить прямой экспорт частей `AppCard`, оставить высокоуровневые card variants.
- Описать public API `shared/ui/index.ts`: что является стабильным, что внутреннее.

### `modules/entities/messages`

Что уже хорошо:

- `MessageItem` недавно разбит на:
  - `MessageItem.tsx`
  - `RegularMessageItem.tsx`
  - `MessageItemBubble.tsx`
  - `MessageItemMeta.tsx`
  - `MessageDeliveryStatus.tsx`
  - `useMessageItem.ts`
- Есть отдельные attachment components: image/video/file/voice/circle/shared post/forward snapshot.
- Есть хуки `useMessages`, `useUploadMessageAttachment`, `useVoiceRecorder`.

Проблемы:

- В entity смешаны:
  - отображение сообщения,
  - context menu actions,
  - reply/edit/delete/forward decisions,
  - E2EE decryption,
  - optimistic status,
  - socket/cache helper.
- `MessageContextMenu` в entity запускает feature-level actions (`forward`, `edit`, `delete`, `reply`) через callbacks. Это приемлемо как UI, но границы нужно зафиксировать: entity только отображает menu, actions приходят снаружи.
- `useMessageItem` знает про `useCurrentChatComposer` из `widgets/chat/chat-current`, что является нарушением FSD: entity импортирует widget. Это нужно исправить.
- `MessageAttachmentList` содержит `SharedPostCard`, `ForwardedMessageCard` — отображение норм, но создание/share/forward selection должно быть в features.
- `useSendMessage` сейчас в `entities/chats`, но содержит message creation, Signal encryption, optimistic message cache, outbox, attachments. Это межсущностный use case, скорее feature/model `features/chat-message-send` или widget-level hook.

Рефакторинг:

- Перенести `useMessageItem` composer-зависимости из entity наружу:
  - entity `MessageItem` должен принимать `actions` пропсом.
  - `widgets/chat-current` собирает `MessageItemActions` через hook.
- Разделить:
  - `entities/messages/ui` — чистое отображение `Message`.
  - `features/message-actions` — reply/edit/delete/copy/forward actions.
  - `features/message-forward` — `ForwardMessagesModal`, background forward, toasts.
  - `features/message-compose` — send/retry/outbox/attachments.
- `useSendMessage` переместить из `entities/chats/lib/hooks` в feature `features/message-compose/lib/hooks/useSendMessage`.
- `useUploadMessageAttachment` оставить в `entities/messages` или перенести в `features/message-attachments-upload`, если появится UI/flow retry/progress.
- Вынести E2EE display/decrypt hook в `entities/encryption` или `features/encrypted-message-display`, чтобы `MessageItem` не содержал Signal details.

### `modules/widgets/chat/chat-current`

Что уже хорошо:

- `ChatInputWidget` начал дробиться:
  - `ChatComposerNoticeBar`
  - `ChatAttachmentActions`
  - `ChatComposerTextArea`
  - `ChatSendButton`
  - `useChatInput`
  - `useChatInputComposer`
- `CurrentChatHeader` имеет `useCurrentChatHeader`.

Проблемы:

- `useChatInput` всё ещё содержит upload, edit, typing, selected chat lookup, composer state, signal gate.
- `CurrentChatComposerContext` живет в widget, но entity message item сейчас зависит от него через `useMessageItem`.
- `ChatInputWidget` содержит knowledge о SIGNAL (hide attachments), attachment actions, voice/circle recorder.

Рефакторинг:

- Разделить composer:
  - `features/message-compose/model` — composer state, reply/edit targets, attachment drafts.
  - `features/message-compose/ui` — `ChatComposerNoticeBar`, `AttachmentDraftsPreview`, send button.
  - `features/voice-message-record` — `VoiceRecordButton`, `useVoiceRecorder`.
  - `features/video-circle-record` — `VideoCircleRecorderModal`.
- `widgets/chat-current` должен только собрать header + messages + composer.
- `CurrentChatComposerProvider` можно оставить рядом с widget временно, но целевое место — `features/message-compose`.

### `modules/entities/chats`

Проблемы:

- `useSendMessage` не является chat entity hook: он отправляет messages, работает с encryption, outbox, attachments, query cache.
- `useChatSocket` обрабатывает messages socket, likes, deletion, read state, cache merge. Это скорее `features/chat-realtime` или widget current chat model.
- `useEnsurePrivateChat` использует router navigation и create chat. Это feature-level use case, не entity.

Рефакторинг:

- В `entities/chats` оставить:
  - types,
  - API hooks `useUserChats`, `useChatById`, `useCreateChat`,
  - route helper `getNetworkChatPath`,
  - pure utils `findPrivateChatWithPeer`,
  - pure selector `useIsSignalChat` допустим, но лучше сделать обычный selector `isSignalChat(chat)`.
- Перенести:
  - `useEnsurePrivateChat` → `features/private-chat-navigation` или `features/chat-open-private`.
  - `useChatSocket` → `features/chat-realtime`.
  - `useSendMessage` → `features/message-compose`.

### `modules/entities/post` и `features/post/CreatePost`

Проблемы:

- `CreatePost` большой и содержит camera/upload/audio/media preview.
- `CreatePostOld.tsx` выглядит как legacy-кандидат.
- В `CreatePost.tsx` есть прямое использование `Avatar`, `AvatarImage`, `AvatarFallback` из `@workspace/ui/components/avatar`, а в приложении уже есть `shared/ui/Avatar`.
- Есть debug `console.log`.
- `post-socket.hook.ts` содержит много console logs.

Рефакторинг:

- Разбить `features/post/CreatePost`:
  - `model/useCreatePostForm`
  - `model/usePostMediaDrafts`
  - `ui/CreatePostComposer`
  - `ui/PostMediaPicker`
  - `ui/PostMediaPreview`
  - `ui/PostCameraRecorder`
  - `ui/PostAudioRecorder` (если нужен)
- Удалить или архивировать `CreatePostOld.tsx` после проверки импортов.
- `Post` entity UI привести к DS:
  - `PostCard`
  - `PostHeader`
  - `PostBody`
  - `PostMediaGrid`
  - `PostActions`
- Прямые shadcn `Avatar*`, `Button`, `Textarea` заменить на app-level components.

### `modules/entities/user`, `followers`, `profile`

Проблемы:

- `entities/user/ui/Users.tsx` выглядит как page/widget/list feature, не entity.
- `UserCard` и `UserPersonCard` частично дублируют identity/actions.
- Profile widgets используют собственные layouts (`ProfileAvatar`, `ProfileHero`, `ProfileInformation`) и `AppSurfaceCard`.

Рефакторинг:

- `entities/user` оставить для API/types/basic user entity UI.
- Страницу people/list вынести в `widgets/people` или `features/user-search`.
- Унифицировать:
  - `UserIdentity`
  - `UserListRow`
  - `UserCard`
  - `UserActionButtons`
- `followers` hooks оставить в entity, actions follow/unfollow — feature.
- Profile:
  - `widgets/profile/information` оставлять composition.
  - upload avatar/hero — feature `features/profile-media-update`.

### `modules/features/notifiactions`

Проблемы:

- Опечатка в имени папки `notifiactions`.
- После перехода на `AppToast` legacy:
  - `model/NotificationSlice.ts`
  - `ui/NotificationToast.tsx`
  - `type/notification.consts.ts`
  - `lib/utils/events/post-events.utils.ts`
  могут стать неиспользуемыми.
- Redux notification state больше не нужен для toast-only уведомлений.

Рефакторинг:

- Переименовать `notifiactions` → `notifications` отдельным PR с alias/exports.
- Удалить legacy toast/slice после проверки импортов.
- Оставить:
  - `features/notifications/lib/hook/notifications-socket.hook.ts`
  - `features/notifications/ui/NotificationsProvider.tsx`
- Рассмотреть разделение:
  - socket events → `features/notifications-realtime`
  - visual toast → `shared/ui/AppToast`.

### `modules/features/password` и `processes/auth`

Что уже хорошо:

- Формы password используют `FormField passwordRevealToggle`, без локального дублирования Eye/EyeOff.
- Есть `PasswordStrengthMeter`.

Проблемы:

- Auth forms и password forms имеют похожий layout/errors/loading patterns.
- `RegistredForm` typo в имени папки/компонента.
- Auth process forms импортируют shared field напрямую, но нет общего auth form shell contract.

Рефакторинг:

- Связать с [auth-forms-unification.md](./auth-forms-unification.md).
- Создать общий `AuthForm`/`AuthFormActions`/`AuthFormError`.
- Переименовать `RegistredForm` → `RegisteredForm` отдельным PR.
- Все password/auth формы привести к одному набору props:
  - `title`
  - `description`
  - `fields`
  - `submitLabel`
  - `loadingLabel`
  - `footer`

### `modules/features/settings`

Проблемы:

- `SettingsButton` — wrapper вокруг tooltip + icon button + route.
- Settings page нуждается в унифицированном списке setting actions/rows.

Рефакторинг:

- Создать `AppIconAction`.
- Создать `SettingsActionList` или `AppSettingsRow`.
- `SettingsButton` должен быть thin config:
  - label
  - icon
  - href

### `modules/widgets/Header`, `Navigation`, `Logout`, `ThemeToggle`

Проблемы:

- Несколько nav/icon/action patterns используют прямой `Button`.
- `Logout` и `SettingsButton` визуально не обязаны знать shadcn variant.
- `ThemeToggle` содержит свой icon action logic.

Рефакторинг:

- Перевести header actions на `AppIconAction`.
- Перевести navigation item на DS navigation primitive:
  - `AppNavItem`
  - `AppSidebarAction`
- `Logout` оформить как `AppActionButton` с loading/error state.

### `features/call`, `features/audio-call`, `features/video-call`, `widgets/call`

Проблемы:

- Есть несколько call-related модулей: `features/call`, `features/audio-call`, `features/video-call`, `widgets/call/CallWrapper`.
- Есть старые WebRTC хуки рядом с LiveKit hooks.
- UI controls используют прямой `Button`.
- Debug logs в video player/call flow.

Рефакторинг:

- Синхронизировать с [livekit-migration.md](./livekit-migration.md).
- Разделить:
  - `entities/call` — call types/status.
  - `features/call-controls` — mute/camera/end/accept/reject.
  - `widgets/call` — full-screen wrapper.
- Удалить WebRTC legacy после LiveKit migration.
- Все call controls перевести на `AppIconAction`/`AppCallControlButton`.

## Кандидаты на удаление или проверку использования

Высокая уверенность:

- `modules/features/post/CreatePost/CreatePostOld.tsx` — legacy/commented old implementation.
- `modules/features/notifiactions/ui/NotificationToast.tsx` — заменён на `shared/ui/AppToast`.
- `modules/features/notifiactions/model/NotificationSlice.ts` — если больше нет UI, который читает notification state.
- `modules/features/notifiactions/lib/utils/events/post-events.utils.ts` — заменён на `useAppToast` в `post-notification.hook.ts`.
- Закомментированный `AvatarRoot/AvatarImage/AvatarFallback` блок в `shared/ui/Avatar/Avatar.tsx`.

Средняя уверенность:

- `entities/chats/ui/ChatCard/index.ts` с закомментированным export.
- `features/call/lib/hook/call.hook.ts`, `call-engine.hook.ts`, `livekit-call.hook.ts`, `livekit.hook.ts`, `features/video-call/*`, `features/audio-call/*` — проверить после LiveKit migration.
- `entities/user/ui/CurrentUser.tsx` — проверить usage.
- `app/auth/start/*` и `app/page.tsx` — есть похожие landing/start страницы, нужно определить одну.

Низкая уверенность:

- `modules/pages/error-page/ErrorPage.tsx` — может быть route-level fallback, проверить usage.
- `entities/post/lib/util/encrypt.util.ts` — проверить, связан ли с текущей E2EE стратегией или legacy.

## Правила миграции

### FSD imports

Запретить entity → widget/process imports.

Примеры нарушений, которые нужно устранить:

- `entities/messages/ui/MessageItem/useMessageItem.ts` не должен импортировать `widgets/chat/chat-current/lib/context`.
- `entities/chats/lib/hooks/useEnsurePrivateChat.ts` не должен делать `router.push`; это feature/navigation use case.

Разрешенные зависимости:

- `shared` → ничего из app/entities/features/widgets.
- `entities` → `shared`, generated API, pure libs.
- `features` → `shared`, `entities`.
- `widgets` → `shared`, `entities`, `features`.
- `processes` → `shared`, `entities`, `features`, `widgets` при необходимости.
- `app` → всё, но thin composition only.

### UI usage

Правила:

- В feature/widget коде не использовать напрямую `@workspace/ui/components/button`, если есть `AppButton`/`AppIconAction`.
- Не копировать `variant="ghost" size="icon"` + tooltip + router push.
- Все action buttons должны иметь:
  - `aria-label`
  - disabled/loading state
  - tooltip если icon-only
  - единый focus/hover style
- Формы используют `FormField`, `AppButton`, общий error/alert паттерн.
- Модалки используют `AppDialog`/`AppConfirmDialog`.
- Toast только через `AppToast`.

### State management

- Server data: TanStack Query.
- UI state: локально или feature provider.
- Cross-app long-lived app state: Redux только если нужен реально глобальный state (auth/call), не для toast queue.

## Пошаговый план

### Этап 0. Safety baseline

- [ ] Зафиксировать текущие маршруты и критичные flow:
  - login/register/reset password,
  - people list/profile,
  - post create/feed/profile posts,
  - chat list/current chat,
  - message send/reply/edit/delete/like/forward,
  - file/voice/video-circle attachment,
  - secret chat text,
  - calls,
  - notifications/toasts.
- [ ] Добавить smoke checklist в [testing.md](./testing.md).
- [ ] Настроить `tsc --noEmit` и lint как обязательную проверку перед каждым PR.

### Этап 1. UI foundation

- [ ] Описать правила `packages/ui` vs `modules/shared/ui` vs будущий `packages/design-system`.
- [ ] Доработать `AppButton`:
  - sizes,
  - icon-only,
  - loading,
  - danger,
  - success,
  - fullWidth.
- [ ] Создать `AppIconAction`.
- [ ] Создать `AppActionList` / `AppActionListItem`.
- [ ] Создать `AppSettingsRow`.
- [ ] Создать `SearchInput` на базе `Input`.
- [ ] Привести `AppToast` к финальному API:
  - `variant`,
  - `href/onClick`,
  - `dedupeKey`,
  - duration,
  - optional action.
- [ ] Закрыть прямой export internals у `AppCard` или явно пометить как legacy.

### Этап 2. Header/settings/navigation cleanup

- [ ] Перевести `SettingsButton` на `AppIconAction`.
- [ ] Перевести `ThemeToggle` на `AppIconAction`.
- [ ] Перевести `Logout` на `AppActionButton`.
- [ ] Перевести `Header` actions на единый API.
- [ ] Перевести `Navigation/NavItem` на `AppNavItem`.

### Этап 3. Auth/password forms

- [ ] Выполнить [auth-forms-unification.md](./auth-forms-unification.md) с учетом уже существующего `FormField passwordRevealToggle`.
- [ ] Переименовать `RegistredForm` → `RegisteredForm`.
- [ ] Создать общий auth form shell/actions/error.
- [ ] Убрать прямые shadcn `Alert/Button` там, где есть app-level паттерны.

### Этап 4. Messages/chat FSD split

- [ ] Перенести composer context из `widgets/chat-current` в `features/message-compose`.
- [ ] Перенести `useSendMessage` из `entities/chats` в `features/message-compose`.
- [ ] Перенести `useEnsurePrivateChat` в feature `private-chat`.
- [ ] Перенести `useChatSocket` в feature/widget model `chat-realtime`.
- [ ] Убрать импорт widget context из `entities/messages/ui/MessageItem/useMessageItem.ts`.
- [ ] Entity `MessageItem` должен принимать `actions` пропсом.
- [ ] `MessageContextMenu` оставить entity UI или перенести в `features/message-actions`, если он запускает flows.
- [ ] Forward modal оставить в `features/chat` или переименовать в `features/message-forward`.
- [ ] Voice/circle record вынести из widget в feature:
  - `features/voice-message-record`,
  - `features/video-circle-record`.

### Этап 5. Post/create post cleanup

- [ ] Удалить `CreatePostOld.tsx` после проверки импортов.
- [ ] Разбить `CreatePost.tsx` на composer/model/ui.
- [ ] Убрать прямые `AvatarImage/AvatarFallback` из feature.
- [ ] Перевести post card/actions/media на DS components.
- [ ] Убрать `console.log` из post socket/create post flow.

### Этап 6. People/user/profile

- [ ] Вынести `entities/user/ui/Users.tsx` в widget/feature.
- [ ] Унифицировать `UserCard`, `UserPersonCard`, create-chat user rows, forward modal user rows.
- [ ] Создать `UserListRow` и использовать:
  - create chat dialog,
  - forward modal,
  - people list compact views.
- [ ] Создать `UserIdentity`.
- [ ] Profile widgets привести к `AppSurfaceCard`, `UserIdentity`, `AppActionList`.

### Этап 7. Notifications

- [ ] Переименовать `notifiactions` → `notifications`.
- [ ] Удалить legacy:
  - `NotificationToast.tsx`,
  - `NotificationSlice.ts`,
  - `post-events.utils.ts`,
  - `notification.consts.ts`, если больше не нужны.
- [ ] Оставить socket provider + `AppToast`.
- [ ] Добавить dedupe на socket listener level, если backend отправляет одно событие по двум каналам.

### Этап 8. Calls

- [ ] Синхронизировать с [livekit-migration.md](./livekit-migration.md).
- [ ] Определить, какие WebRTC хуки legacy.
- [ ] Перевести controls на `AppIconAction`/`AppCallControlButton`.
- [ ] Убрать debug logs из video/call components.

### Этап 9. Search/filter/list patterns

- [ ] Выполнить [filter-search-components.md](./filter-search-components.md).
- [ ] Создать общий `UserPickerList` / `SelectableUserList`.
- [ ] Использовать его в:
  - `CreateChatDialogWidget`,
  - `ForwardMessagesModal`,
  - future invite/share flows.
- [ ] Перевести `SharePostModal` на общий search/list dialog pattern.

### Этап 10. Cleanup and guardrails

- [ ] Удалить legacy files.
- [ ] Добавить import rules ESLint для FSD boundaries.
- [ ] Добавить lint rule/no-restricted-imports:
  - запрет прямого `@workspace/ui/components/button` вне `shared/ui` после миграции,
  - запрет `entities/*` импортировать `widgets/*`,
  - запрет `entities/*` импортировать `features/*`.
- [ ] Добавить архитектурный README в `apps/front/modules`.
- [ ] Обновить [tasks.md](./tasks.md) с ссылкой на эту задачу.

## Рекомендуемый порядок PR

1. `AppIconAction`, `AppActionList`, `AppSettingsRow` без миграции.
2. Header/settings/theme/logout migration.
3. Notifications cleanup + rename typo.
4. User list row/selectable list and forward modal cleanup.
5. Message item actions inversion: убрать widget imports из entity.
6. Move `useSendMessage`/composer to `features/message-compose`.
7. Chat realtime extraction.
8. CreatePost split and legacy cleanup.
9. Calls cleanup after LiveKit decision.
10. ESLint FSD import boundaries.

## Definition of Done

- [ ] В `apps/front/modules` нет entity → widget/feature imports.
- [ ] Новые UI-компоненты используют `shared/ui` или дизайн-систему, а не прямой shadcn primitive без причины.
- [ ] `SettingsButton` и похожие icon actions сведены к одному компоненту.
- [ ] Все формы используют единый field/button/error/loading pattern.
- [ ] Все модалки используют единый dialog/list/search/action pattern.
- [ ] Toast-уведомления используют `AppToast`.
- [ ] Удалены legacy файлы или явно задокументированы как pending migration.
- [ ] `pnpm exec tsc --noEmit` проходит.
- [ ] Для критичных flows есть smoke checklist или тесты.

