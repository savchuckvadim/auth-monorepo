# Posts — комментарии (web + mobile)

Этот taskdoc парный к `documentation/backend/tasks/posts-comments.md` и описывает
фронтовую часть комментариев под постом. В волне «Messenger features expansion»
создан только placeholder — фактическую реализацию делаем отдельной волной.

## 1. Точки интеграции

### Web

- Страница `/network/posts/:id` (`apps/front/app/network/posts/[postId]/page.tsx`)
  — внутри сейчас empty-state «Обсуждения скоро». Заменить на секцию «Комментарии».
- Карточка `Post` в ленте — показывать `commentsCount` и ссылку на страницу поста.
- `SharedPostCard` в чате уже ведёт на страницу поста.

### Mobile

- `PostScreen` (если нет — создать). Такой же layout: пост сверху, секция
  комментариев снизу. Подгружается тем же React Query хуком, что и веб.

## 2. Компоненты

```
modules/features/post/Comments/
  ui/
    CommentsList/CommentsList.tsx       — виртуализованный список
    CommentItem/CommentItem.tsx         — автор, текст, like, reply
    CommentComposer/CommentComposer.tsx — textarea + submit
    CommentContextMenu                  — edit/delete/reply/copy (reuse из MessageContextMenu идею)
  lib/
    hooks/usePostComments.ts            — useInfiniteQuery с cursor
    hooks/useCreateComment.ts           — optimistic вставка
    hooks/useUpdateComment.ts           — optimistic патч
    hooks/useDeleteComment.ts           — мягкое удаление
    hooks/useToggleCommentLike.ts       — optimistic счётчик
    socket/usePostCommentsSocket.ts     — подписка на комнату post:<id>
```

## 3. Socket-подписка

- При входе на страницу поста — `join post:<postId>`, на выходе — `leave`.
- Слушаем `post:comment_created|updated|deleted|liked`, обновляем кэш
  `['post', id, 'comments']` через `queryClient.setQueryData`.

## 4. Optimistic UI

- Создание: вставка временного комментария с `_clientStatus: 'sending'`, замена
  на реальный по ответу сервера.
- Удаление: скрываем сразу, откатываем на ошибку.
- Лайк: меняем `isLiked` и `likesCount` оптимистично.

## 5. UX

- Корневые комментарии — плоским списком. Reply — inline-box под родительским,
  отображаются отдельным подсписком (max 1 уровень вложенности, в соответствии
  с бэком).
- Аватары, дата в человекочитаемом виде (`toLocaleDateString` + "2 мин назад"),
  кнопка «развернуть ответы» если `childrenCount > 0`.
- Лимит 2000 символов — счётчик рядом с textarea.

## 6. Тесты

- Компонент `CommentsList` рендерит пустое состояние без запросов.
- Оптимистичное создание: в UI сразу появляется, при 500 → откатывается, показываем toast.
- Редактирование ≤24ч — пункт меню виден, старше 24ч — скрыт.

## 7. Что из "сейчас" переиспользовать

- `MessageContextMenu` (apps/front/modules/entities/messages/ui/MessageContextMenu)
  — паттерн идентичный, подсмотреть.
- `useExhaustingCallback`, `useInfiniteQuery` с cursor — у нас уже есть образцы
  в messages.
- `TypingDots`, `AppDialog`, `AppButton`, `LoadingComponent` — готовые UI-примитивы.
