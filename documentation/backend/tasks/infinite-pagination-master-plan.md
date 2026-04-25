# Мастер-план: Универсальная пагинация / бесконечная прокрутка / фильтры / поиск

Этот документ — сводный план, связывающий воедино несколько задач:
- [`users-pagination.md`](./users-pagination.md) — пагинация `GET /api/user`
- [`filter-search-api.md`](./filter-search-api.md) — серверные фильтры/поиск для users/posts/chats
- [`news-feed-endpoint.md`](./news-feed-endpoint.md) — фильтры/сортировка ленты постов
- [`../../frontend/tasks/filter-search-components.md`](../../frontend/tasks/filter-search-components.md) — UI-компоненты фильтра и поиска
- [`../../frontend/tasks/people-page.md`](../../frontend/tasks/people-page.md) — интеграция на странице People
- [`../../frontend/tasks/news-module.md`](../../frontend/tasks/news-module.md) — интеграция в ленте новостей

Существующие задачи описывают «что делать» на уровне отдельных сущностей. Этот мастер-план описывает **как делать это единообразно на 3-х слоях** (api / web / mobile) и **в каком порядке**, и фиксирует принятые решения, которые ранее не были зафиксированы.

## Контекст и проблемы текущего состояния

**Бэк (`apps/api`):**
- Посты: cursor + limit (по `createdAt`), но **не composite** — при одинаковых timestamp'ах возможны пропуски записей.
- Сообщения: `limit + offset` — плохо масштабируется, offset ломается на активном чате (новое сообщение сдвигает окно → дубли/пропуски).
- Users / followers / chats — отдаются **полностью**, без пагинации/поиска.
- Нет общих DTO для страниц и общей утилиты курсора.

**Веб (`apps/front`):**
- `useInfiniteQuery` не используется.
- Даже где у API есть `nextCursor`/`hasNext` — сервис их **выбрасывает** (см. `post.service.ts`: `return paginatedResult.posts`).
- Виртуализации нет — потенциально DOM сломается на больших списках.
- Поиск по users закомментирован.
- Нет общего `BackToTop`.

**Мобилка (`sociopath/mobile`):**
- Списки не виртуализированы (`ScrollView + .map()`).
- `@shopify/flash-list` не установлен.
- Поиск — локальный `includes` (чаты).

## Принятые решения (ADRs)

### ADR-1. Два базовых контракта страницы
- `CursorPageMetaDto` — база для feed-like списков (`nextCursor: string | null`, `hasNext: boolean`). Наследники добавляют `items` с нужным типом (`PaginatedPostsDto`, `PaginatedUsersDto`, …). Это работает с orval без дженерик-хаков.
- `OffsetPageMetaDto` — для админских/редких случаев, где UI показывает «стр. 2 из 15». Для ленты **не** используем (`COUNT(*)` по большим таблицам дорог).

### ADR-2. Композитный курсор
Курсор — opaque base64-строка, внутри **два поля**: `<sortField>|<id>`. Без id в курсоре при равных значениях поля сортировки (например, два пользователя с одинаковым именем) возможны пропуски. Примеры:
- Users (sort by name): `(name, id)`
- Posts (sort by createdAt): `(createdAt, id)`
- Messages (sort by createdAt): `(createdAt, id)`

Утилита `encodeCursor`/`decodeCursor` — единая для всех сущностей в `apps/api/src/core/pagination/`.

### ADR-3. Direction для reverse-списков (сообщения, уведомления)
Запрос принимает `direction: older | newer` + `cursor?`:
- Первая загрузка: `direction=older`, `cursor=null` → последние N.
- Скролл вверх (в истории): `direction=older`, `cursor=<oldest>`.
- Подтаскивание новых поверх (pull/sync): `direction=newer`, `cursor=<newest>`.

Сменяет offset. Устойчив к realtime-притоку.

### ADR-4. MySQL, а не PostgreSQL
`datasource db { provider = "mysql" }`. Следствия:
- `Prisma` `mode: 'insensitive'` **игнорируется** — не добавлять его в код, чтобы не вводить в заблуждение. При default collation `utf8mb4_0900_ai_ci` `LIKE` уже case-insensitive.
- Существующие планы (`users-pagination.md`, `filter-search-api.md`) используют `mode: 'insensitive'` — при реализации **удалить** этот параметр.
- Поиск стартует как простой `contains: search` (LIKE `%q%`). Для > 50k пользователей — поднимем FULLTEXT отдельной задачей (пока не требуется, решено).

### ADR-5. Библиотеки виртуализации
- **Веб**: `react-virtuoso` для `feed` постов и сообщений (prepend без прыжка скролла, `followOutput` для авто-скролла вниз); `@tanstack/react-virtual` для grid пользователей (тонкий контроль колонок).
- **Мобилка**: `@shopify/flash-list` везде. Для сообщений — `inverted`, для остального — обычный режим.

### ADR-6. Поиск
- Весь поиск — серверный. Фронт `useDebouncedValue` (300 мс) → новый запрос.
- Пустой `search` = обычная выдача.
- Фильтры — часть `queryKey`: смена фильтра → отдельный `useInfiniteQuery` (React Query кэширует старый).

## Структура кода

### Бэк (`apps/api`)
```
apps/api/src/core/pagination/
  ├── dtos/
  │   ├── cursor-page-meta.dto.ts     # { nextCursor, hasNext }
  │   ├── offset-page-meta.dto.ts     # { page, limit, total, hasNext } — запас
  │   ├── list-query.dto.ts           # { cursor?, limit?, search? }
  │   └── cursor-direction.enum.ts    # OLDER | NEWER
  ├── utils/
  │   └── cursor.util.ts              # encode/decode + buildCompositeCursorWhere
  └── index.ts
```
Реэкспорт из `apps/api/src/core/index.ts`.

Конкретные `PaginatedUsersDto extends CursorPageMetaDto`, `PaginatedMessagesDto extends CursorPageMetaDto` и т.п. **живут** в своих модулях (`modules/user/dto`, `modules/messages/dto`) — не в `core`.

### Веб (`apps/front`)
```
apps/front/modules/shared/
  ├── lib/hooks/
  │   ├── use-debounced-value.ts
  │   └── use-infinite-scroll.ts      # тонкая обёртка + sentinel-ref (если не virtuoso)
  └── ui/
      ├── VirtualInfiniteList/        # react-virtuoso
      ├── VirtualInfiniteGrid/        # @tanstack/react-virtual
      └── BackToTopButton/
```

### Мобилка (`sociopath/mobile/app/shared`)
```
app/shared/
  ├── hooks/
  │   ├── use-debounced-value.ts
  │   └── use-infinite-list.ts        # обёртка над useInfiniteQuery + FlashList props
  └── ui/
      ├── InfiniteList/               # FlashList обёртка
      └── ScrollToTopFab/
```

## Порядок итераций

Выбран (по решению владельца): **0 → 2 → 1 → 3 → 4**.

### Итерация 0 — Фундамент (инфраструктура, бизнес-код не трогаем)
**Backend:**
- [ ] Создать `apps/api/src/core/pagination/` со структурой выше.
- [ ] `cursor.util.ts`: `encodeCursor`, `decodeCursor`, `buildCompositeCursorWhere` для произвольного sort-поля.
- [ ] Реэкспорт из `apps/api/src/core/index.ts`.

**Web:**
- [ ] `pnpm -F front add react-virtuoso @tanstack/react-virtual`.
- [ ] `use-debounced-value` хук.
- [ ] `use-infinite-scroll` хук (на случай non-virtuoso списков).
- [ ] `VirtualInfiniteList`, `VirtualInfiniteGrid`, `BackToTopButton` компоненты.
- [ ] Обновить барели `shared/lib/index.ts`, `shared/ui/index.ts`.

**Mobile:**
- [ ] `pnpm add @shopify/flash-list` в `sociopath/mobile`.
- [ ] `use-debounced-value`, `use-infinite-list` хуки.
- [ ] `InfiniteList`, `ScrollToTopFab` компоненты.
- [ ] Обновить `app/shared/index.ts`.

**DoD:** без бизнес-логики на этом шаге — только инфраструктура. Лист/грид/FAB компоненты рендерятся на пустых данных, API DTO проходят lint/typecheck.

### Итерация 2 — Users (endpoint + web + mobile)
Ориентир: [`users-pagination.md`](./users-pagination.md) + [`filter-search-api.md`](./filter-search-api.md), с поправками из этого документа (без `mode:'insensitive'`, composite cursor по `(name, id)`).

**Backend:**
- [ ] Миграция `@@index([name, id])` на `users` через `pnpm db:migrate:dev` с именем.
- [ ] `UsersQueryDto extends ListQueryDto` + поле `filter: 'all'|'followers'|'following'|'friends'|'not_following'`.
- [ ] `PaginatedUsersDto extends CursorPageMetaDto` с `items: UserWithFollowStatusDto[]`.
- [ ] `UserService.getUsers({ currentUserId, cursor, limit, search, filter })`.
- [ ] Репозиторий: `orderBy: [{ name: 'asc' }, { id: 'asc' }]`, `where` от `buildCompositeCursorWhere('name', …)`.
- [ ] Поиск: `{ OR: [{ name: { contains } }, { email: { contains } }] }` — без `mode`.
- [ ] Фильтры (friends — через `AND { followers: some, following: some }`).

**Web:**
- [ ] `useInfiniteUsers({ filter, search })` на базе `useInfiniteQuery`.
- [ ] Подключить `useDebouncedValue(300)` к поиску в `modules/entities/user/ui/Users.tsx`.
- [ ] Включить обратно закомментированный `<Input>` поиска.
- [ ] Заменить `.map()` на `<VirtualInfiniteGrid>` (grid карточек).
- [ ] `BackToTopButton` наверху секции.

**Mobile:**
- [ ] `useInfiniteUsers` аналог (`useInfiniteQuery`).
- [ ] Экран users → `<InfiniteList numColumns={2}>` (или 1, по дизайну).
- [ ] Поисковая строка с debounce.
- [ ] `ScrollToTopFab`.

**DoD:** при > 1000 пользователях: быстрая начальная загрузка, search работает через бэк, смена фильтра мгновенна (старый список в кэше).

### Итерация 1 — Posts (feed + профиль)
Ориентир: [`news-feed-endpoint.md`](./news-feed-endpoint.md), [`filter-search-api.md`](./filter-search-api.md).

**Backend:**
- [ ] Перевести существующий cursor постов с «просто createdAt» на composite через `cursor.util`. Клиенты сейчас cursor всё равно **не используют**, поломки совместимости нет.
- [ ] Добавить `filter: 'all'|'following'|'my'` + `dateRange: 'today'|'week'|'month'|'all'` + `type: …` + опциональный `search`.
- [ ] `PaginatedPostsDto` уже есть — привести к паттерну `extends CursorPageMetaDto` ради единства (поле `items` вместо `posts`; нужно согласовать с клиентами, т.к. они всё равно переедут на новый хук).

**Web:**
- [ ] `useInfinitePostsFeed`, `useInfinitePostsByUserId` (useInfiniteQuery).
- [ ] Удалить костыль в `post.service.ts` (`return paginatedResult.posts`) — отдавать страницу целиком.
- [ ] Feed → `<VirtualInfiniteList>` (virtuoso).
- [ ] Фильтры: существующий `FilterSegmentStrip` связать с `queryKey`.
- [ ] Realtime новый пост: `setQueryData` в первую страницу (prepend).
- [ ] `BackToTopButton`.

**Mobile:** зеркало веба на `FlashList`.

### Итерация 3 — Messages (reverse scroll)
**Backend:**
- [ ] `GET /messages/chat/:id` принимает `cursor?`, `direction: older|newer`, `limit` (default 50). Совместимость: параметр `offset` помечается `@deprecated`.
- [ ] Ответ: `PaginatedMessagesDto extends CursorPageMetaDto`.
- [ ] Индекс: `@@index([chatId, createdAt, id])` миграцией (сейчас `@@index([chatId, createdAt])`).

**Web (мессенджер):**
- [ ] `useInfiniteMessages(chatId)` на `useInfiniteQuery` (старые страницы — previous-page концептуально).
- [ ] `MessageList` → `react-virtuoso` с `firstItemIndex` (prepend без прыжка), `followOutput="smooth"`.
- [ ] `startReached` → подгрузить `direction=older`.
- [ ] Socket «новое сообщение» → `setQueryData` append в последнюю страницу; если пользователь не внизу — бейдж «новые ↓».

**Mobile:** `FlashList inverted`; `onEndReached` → `older`; socket prepend; бейдж новых.

**DoD:** чат с 10к+ сообщений открывается мгновенно, листание вверх бесшовно, новое сообщение не ломает скролл-позицию.

### Итерация 4 — Chats list (низкий приоритет)
- cursor по `lastMessageAt`, поиск по названию и участникам.
- Вероятно не будет боттлнека — чатов у пользователя десятки.

## Что НЕ входит в текущий план (явно)
- WS-событие `auth:session-revoked` (см. `sessions-and-password-followups.md`).
- Per-session `isOnline` (см. предыдущие followups).
- FULLTEXT / внешний поисковый индекс — вернёмся при > 50k пользователей.
- Сложные сортировки постов `popular`/`trending` — оставить комментарием-заглушкой, обсуждать отдельно (нужна денормализация лайков).

## Связанные следующие доки
По мере реализации создаются:
- `documentation/backend/tasks/infinite-pagination-followups.md` — что осталось.
- Каждая итерация на завершении обновляет исходную задачу (см. `users-pagination.md` и др.) отметкой «реализовано, см. мастер-план».
