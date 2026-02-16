# Улучшение endpoint ленты новостей

## Назначение

Улучшить существующий endpoint `GET /api/posts/feed` для поддержки фильтрации, сортировки и оптимизации загрузки данных. Endpoint должен поддерживать посты из групп и обеспечивать эффективную пагинацию.

## Текущее состояние

**Endpoint**: `GET /api/posts/feed`

**Текущая реализация**:
- Cursor-based пагинация (через `createdAt`)
- Возвращает посты пользователей, на которых подписан текущий пользователь
- Поддерживает параметры `cursor` и `limit`

**Ограничения**:
- Нет фильтрации по типу поста
- Нет фильтрации по авторам
- Нет фильтрации по дате
- Нет сортировки (только по дате создания)
- Нет поддержки постов из групп
- Нет кэширования

## Требования

### Фильтрация

1. **По типу поста**:
   - `all` - все посты
   - `text` - только текстовые посты
   - `image` - только посты с изображениями
   - `video` - только посты с видео
   - `audio` - только посты с аудио

2. **По авторам**:
   - `all` - все авторы
   - `following` - только подписки (текущее поведение)
   - `groups` - только посты из групп (после реализации групп)

3. **По дате**:
   - `all` - все посты
   - `today` - сегодня
   - `week` - за неделю
   - `month` - за месяц

### Сортировка

1. **По дате**:
   - `newest` - новые сначала (по умолчанию)
   - `oldest` - старые сначала

2. **По популярности**:
   - `popular` - по количеству лайков
   - `trending` - по количеству лайков за последние 24 часа

### Пагинация

- Сохранить cursor-based пагинацию (эффективнее чем offset)
- Поддержка параметров `cursor` и `limit`
- Возвращать `nextCursor` и `hasNext`

### Оптимизация

- Добавить индексы в БД для оптимизации запросов
- Кэширование результатов (Redis)
- Оптимизация SQL запросов

## API Endpoint

### `GET /api/posts/feed`

**Query параметры**:

```typescript
{
    cursor?: string;           // Cursor для пагинации (ISO date string)
    limit?: number;            // Количество постов (по умолчанию 20, максимум 50)

    // Фильтрация
    type?: 'all' | 'text' | 'image' | 'video' | 'audio';
    authors?: 'all' | 'following' | 'groups';
    dateRange?: 'all' | 'today' | 'week' | 'month';

    // Сортировка
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
}
```

**Response**:

```typescript
{
    posts: PostDto[];
    nextCursor?: string;        // Cursor для следующей страницы
    hasNext: boolean;          // Есть ли еще посты
    total?: number;            // Общее количество постов (опционально, для UI)
}
```

## Реализация

### Обновление DTO

**FeedQueryDto**:

```typescript
export class FeedQueryDto {
    @IsOptional()
    @IsString()
    cursor?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(50)
    limit?: number;

    @IsOptional()
    @IsEnum(['all', 'text', 'image', 'video', 'audio'])
    type?: 'all' | 'text' | 'image' | 'video' | 'audio';

    @IsOptional()
    @IsEnum(['all', 'following', 'groups'])
    authors?: 'all' | 'following' | 'groups';

    @IsOptional()
    @IsEnum(['all', 'today', 'week', 'month'])
    dateRange?: 'all' | 'today' | 'week' | 'month';

    @IsOptional()
    @IsEnum(['newest', 'oldest', 'popular', 'trending'])
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
}
```

### Обновление PostService

**Метод getFeed**:

```typescript
public async getFeed(
    currentUserId: string,
    query: FeedQueryDto
): Promise<PaginatedPostsDto> {
    const {
        cursor,
        limit = 20,
        type = 'all',
        authors = 'following',
        dateRange = 'all',
        sortBy = 'newest'
    } = query;

    // Построение запроса с фильтрами
    const result = await this.repo.getFeed({
        currentUserId,
        cursor,
        limit,
        filters: {
            type,
            authors,
            dateRange
        },
        sortBy
    });

    return {
        posts: result.posts.map(post => new PostDto(post)),
        nextCursor: result.nextCursor,
        hasNext: result.hasNext,
    };
}
```

### Обновление PostRepository

**Метод getFeed**:

```typescript
async getFeed(params: {
    currentUserId: string;
    cursor?: string;
    limit: number;
    filters: {
        type: string;
        authors: string;
        dateRange: string;
    };
    sortBy: string;
}): Promise<{
    posts: FullPost[];
    nextCursor?: string;
    hasNext: boolean;
}> {
    const { currentUserId, cursor, limit, filters, sortBy } = params;

    // Базовый запрос
    let query = this.prisma.post.findMany({
        where: {
            deletedAt: null,
            // Фильтр по авторам
            ...(filters.authors === 'following' && {
                author: {
                    followers: {
                        some: {
                            followerId: currentUserId
                        }
                    }
                }
            }),
            // Фильтр по типу поста
            ...(filters.type !== 'all' && {
                [filters.type]: { not: null }
            }),
            // Фильтр по дате
            ...(filters.dateRange !== 'all' && {
                createdAt: this.getDateRangeFilter(filters.dateRange)
            }),
            // Cursor для пагинации
            ...(cursor && {
                createdAt: {
                    lt: new Date(cursor)
                }
            })
        },
        include: {
            author: true,
            user: true,
            originalPost: true,
            likes: {
                where: { userId: currentUserId }
            }
        },
        take: limit + 1, // Берем на 1 больше для проверки hasNext
        orderBy: this.getSortOrder(sortBy)
    });

    const posts = await query;
    const hasNext = posts.length > limit;
    const resultPosts = hasNext ? posts.slice(0, limit) : posts;
    const nextCursor = resultPosts.length > 0
        ? resultPosts[resultPosts.length - 1].createdAt.toISOString()
        : undefined;

    return {
        posts: resultPosts,
        nextCursor,
        hasNext
    };
}
```

### Вспомогательные методы

**getDateRangeFilter**:

```typescript
private getDateRangeFilter(dateRange: string): { gte: Date } | undefined {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
        case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        default:
            return undefined;
    }

    return { gte: startDate };
}
```

**getSortOrder**:

```typescript
private getSortOrder(sortBy: string): any {
    switch (sortBy) {
        case 'oldest':
            return { createdAt: 'asc' };
        case 'popular':
            // Сортировка по количеству лайков (требует агрегацию)
            return { createdAt: 'desc' }; // Временная реализация
        case 'trending':
            // Сортировка по лайкам за последние 24 часа
            return { createdAt: 'desc' }; // Временная реализация
        case 'newest':
        default:
            return { createdAt: 'desc' };
    }
}
```

## Индексы базы данных

### Необходимые индексы

```sql
-- Индекс для фильтрации по дате и пагинации
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Индекс для фильтрации по типу поста
CREATE INDEX idx_posts_type ON posts(image, video, audio, text);

-- Индекс для связи с автором (для фильтрации по подпискам)
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Композитный индекс для оптимизации запросов ленты
CREATE INDEX idx_posts_feed ON posts(created_at, author_id, deleted_at);
```

## Кэширование

### Redis кэширование

**Стратегия**:
- Кэшировать результаты запросов feed на 1-2 минуты
- Ключ кэша: `feed:${userId}:${filtersHash}:${cursor}`
- Инвалидация при создании нового поста

**Реализация**:

```typescript
async getFeed(...): Promise<PaginatedPostsDto> {
    const cacheKey = this.getCacheKey(userId, filters, cursor);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const result = await this.repo.getFeed(...);

    // Кэшируем на 60 секунд
    await this.redis.setex(cacheKey, 60, JSON.stringify(result));

    return result;
}
```

## Интеграция с группами

**После реализации групп**:
- Добавить фильтр `authors: 'groups'` для постов из групп
- Включить посты из групп, где пользователь является участником
- Обновить запрос для поддержки `groupId`

## Задачи

### Этап 1: Обновление DTO и контроллера

- [ ] Создать `FeedQueryDto` с параметрами фильтрации и сортировки
- [ ] Обновить `PostController.getFeed` для принятия query параметров
- [ ] Обновить Swagger документацию

### Этап 2: Реализация фильтрации

- [ ] Реализовать фильтрацию по типу поста
- [ ] Реализовать фильтрацию по авторам (following)
- [ ] Реализовать фильтрацию по дате
- [ ] Обновить `PostRepository.getFeed`

### Этап 3: Реализация сортировки

- [ ] Реализовать сортировку по дате (newest/oldest)
- [ ] Реализовать сортировку по популярности (требует агрегацию)
- [ ] Реализовать сортировку по трендам

### Этап 4: Оптимизация

- [ ] Добавить индексы в БД
- [ ] Реализовать кэширование (Redis)
- [ ] Оптимизировать SQL запросы

### Этап 5: Интеграция с группами

- [ ] Добавить поддержку постов из групп (после реализации групп)
- [ ] Обновить фильтр `authors: 'groups'`

## Файлы для работы

- `apps/api/src/modules/post/dto/post.dto.ts` - добавить `FeedQueryDto`
- `apps/api/src/modules/post/controllers/post.controller.ts` - обновить endpoint
- `apps/api/src/modules/post/services/post.service.ts` - обновить метод `getFeed`
- `apps/api/src/modules/post/repositories/post.repository.ts` - обновить метод `getFeed`
- `apps/api/prisma/schema.prisma` - добавить индексы (через миграцию)

## Связанные задачи

- [Frontend задача по ленте новостей](../../frontend/tasks/news-module.md) - связанная frontend задача
- [Backend задача по группам](./groups.md) - интеграция постов из групп
