# API для фильтрации и поиска

## Назначение

Реализовать backend API для фильтрации и поиска в:
- Ленте постов (feeds)
- Сообщениях (chats)
- Списке пользователей (People)

API должно поддерживать:
- Фильтрацию по различным критериям
- Поиск по всему списку (не только по загруженным данным)
- Интеграцию с cursor-based пагинацией
- Оптимизацию запросов (индексы, кэширование)

## Требования

### Функционал

1. **API для постов**:
   - Фильтрация по типу поста (текст, изображения, видео, аудио)
   - Фильтрация по автору (все, подписки, свои)
   - Фильтрация по дате (сегодня, неделя, месяц)
   - Поиск по тексту поста
   - Комбинация фильтров и поиска

2. **API для чатов**:
   - Фильтрация по типу чата (приватные, групповые)
   - Фильтрация по непрочитанным
   - Поиск по имени чата, участникам
   - Комбинация фильтров и поиска

3. **API для пользователей**:
   - Фильтрация по отношениям (подписчики, подписки, друзья, не подписаны)
   - Фильтрация по онлайн статусу
   - Поиск по имени, email
   - Комбинация фильтров и поиска

4. **Пагинация**:
   - Cursor-based пагинация с поддержкой фильтров и поиска
   - Поиск работает по всему списку (не только по загруженным данным)
   - Оптимизация запросов с фильтрами

## API Endpoints

### 1. Посты (Feeds)

#### GET /api/posts/feed

**Query Parameters**:
```typescript
{
    cursor?: string;           // Cursor для пагинации
    limit?: number;           // Количество постов (default: 20, max: 50)
    search?: string;          // Поисковый запрос
    filters?: {
        type?: string[];      // ['text', 'image', 'video', 'audio']
        author?: 'all' | 'following' | 'my';
        date?: 'all' | 'today' | 'week' | 'month';
    };
    sort?: 'date' | 'popularity'; // Сортировка
}
```

**Response**:
```typescript
{
    posts: PostDto[];
    nextCursor?: string;
    hasNext: boolean;
    total?: number; // Общее количество (опционально, для фильтров может быть дорого)
}
```

**Реализация**:

```typescript
// post/post.controller.ts
@Get('feed')
async getFeed(
    @Query() query: GetFeedDto,
    @CurrentUser() currentUser: User,
) {
    return await this.postService.getFeed({
        userId: currentUser.id,
        cursor: query.cursor,
        limit: Math.min(query.limit || 20, 50),
        search: query.search,
        filters: query.filters,
        sort: query.sort || 'date',
    });
}
```

```typescript
// post/post.service.ts
async getFeed(options: {
    userId: string;
    cursor?: string;
    limit: number;
    search?: string;
    filters?: {
        type?: string[];
        author?: 'all' | 'following' | 'my';
        date?: 'all' | 'today' | 'week' | 'month';
    };
    sort?: 'date' | 'popularity';
}): Promise<{ posts: PostDto[]; nextCursor?: string; hasNext: boolean }> {
    const where: any = {
        deletedAt: null,
    };

    // Фильтр по типу поста
    if (options.filters?.type && !options.filters.type.includes('all')) {
        const postTypes = [];
        if (options.filters.type.includes('text')) {
            postTypes.push('TEXT');
        }
        if (options.filters.type.includes('image')) {
            postTypes.push('IMAGE');
        }
        if (options.filters.type.includes('video')) {
            postTypes.push('VIDEO');
        }
        if (options.filters.type.includes('audio')) {
            postTypes.push('AUDIO');
        }
        if (postTypes.length > 0) {
            where.type = { in: postTypes };
        }
    }

    // Фильтр по автору
    if (options.filters?.author) {
        if (options.filters.author === 'following') {
            // Только посты от пользователей, на которых подписан
            const followingIds = await this.getFollowingIds(options.userId);
            where.authorId = { in: followingIds };
        } else if (options.filters.author === 'my') {
            where.authorId = options.userId;
        }
    }

    // Фильтр по дате
    if (options.filters?.date) {
        const now = new Date();
        let startDate: Date;

        switch (options.filters.date) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = undefined;
        }

        if (startDate) {
            where.createdAt = { gte: startDate };
        }
    }

    // Поиск по тексту
    if (options.search) {
        where.text = {
            contains: options.search,
            mode: 'insensitive',
        };
    }

    // Cursor-based пагинация
    if (options.cursor) {
        where.id = { gt: options.cursor };
    }

    // Сортировка
    const orderBy: any = {};
    if (options.sort === 'popularity') {
        // Сортировка по популярности (лайки + комментарии)
        // Требует дополнительных вычислений или денормализации
        orderBy.views = 'desc';
    } else {
        orderBy.createdAt = 'desc';
    }

    // Запрос с limit + 1 для проверки hasNext
    const posts = await this.prisma.post.findMany({
        where,
        orderBy,
        take: options.limit + 1,
        include: {
            author: {
                include: {
                    profile: true,
                },
            },
            likes: true,
        },
    });

    const hasNext = posts.length > options.limit;
    const resultPosts = hasNext ? posts.slice(0, -1) : posts;
    const nextCursor = hasNext ? resultPosts[resultPosts.length - 1].id : undefined;

    return {
        posts: resultPosts.map(post => new PostDto(post)),
        nextCursor,
        hasNext,
    };
}
```

### 2. Чаты

#### GET /api/chats

**Query Parameters**:
```typescript
{
    cursor?: string;
    limit?: number;
    search?: string;
    filters?: {
        type?: string[];      // ['private', 'group']
        unread?: boolean;     // Только непрочитанные
    };
}
```

**Response**:
```typescript
{
    chats: ChatDto[];
    nextCursor?: string;
    hasNext: boolean;
}
```

**Реализация**:

```typescript
// chat/chat.controller.ts
@Get()
async getChats(
    @Query() query: GetChatsDto,
    @CurrentUser() currentUser: User,
) {
    return await this.chatService.getChats({
        userId: currentUser.id,
        cursor: query.cursor,
        limit: Math.min(query.limit || 20, 50),
        search: query.search,
        filters: query.filters,
    });
}
```

```typescript
// chat/chat.service.ts
async getChats(options: {
    userId: string;
    cursor?: string;
    limit: number;
    search?: string;
    filters?: {
        type?: string[];
        unread?: boolean;
    };
}): Promise<{ chats: ChatDto[]; nextCursor?: string; hasNext: boolean }> {
    const where: any = {
        members: {
            some: {
                userId: options.userId,
                leftAt: null,
            },
        },
    };

    // Фильтр по типу чата
    if (options.filters?.type && !options.filters.type.includes('all')) {
        const chatTypes = [];
        if (options.filters.type.includes('private')) {
            chatTypes.push('PRIVATE');
        }
        if (options.filters.type.includes('group')) {
            chatTypes.push('GROUP');
        }
        if (chatTypes.length > 0) {
            where.type = { in: chatTypes };
        }
    }

    // Фильтр по непрочитанным
    if (options.filters?.unread) {
        where.members = {
            some: {
                userId: options.userId,
                leftAt: null,
                lastReadAt: {
                    lt: this.prisma.message.findFirst({
                        where: {
                            chatId: { equals: this.prisma.chat.fields.id },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        select: {
                            createdAt: true,
                        },
                    }).then(msg => msg?.createdAt),
                },
            },
        };
    }

    // Поиск по имени чата или участникам
    if (options.search) {
        where.OR = [
            {
                name: {
                    contains: options.search,
                    mode: 'insensitive',
                },
            },
            {
                members: {
                    some: {
                        user: {
                            OR: [
                                {
                                    name: {
                                        contains: options.search,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    email: {
                                        contains: options.search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        ];
    }

    // Cursor-based пагинация
    if (options.cursor) {
        where.id = { gt: options.cursor };
    }

    const chats = await this.prisma.chat.findMany({
        where,
        orderBy: {
            updatedAt: 'desc',
        },
        take: options.limit + 1,
        include: {
            members: {
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            },
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    const hasNext = chats.length > options.limit;
    const resultChats = hasNext ? chats.slice(0, -1) : chats;
    const nextCursor = hasNext ? resultChats[resultChats.length - 1].id : undefined;

    return {
        chats: resultChats.map(chat => new ChatDto(chat)),
        nextCursor,
        hasNext,
    };
}
```

### 3. Пользователи

#### GET /api/user

**Query Parameters**:
```typescript
{
    cursor?: string;
    limit?: number;
    search?: string;
    filters?: {
        relationship?: string[];  // ['followers', 'following', 'friends', 'not_following']
        online?: boolean;         // Только онлайн
    };
}
```

**Response**:
```typescript
{
    users: UserDto[];
    nextCursor?: string;
    hasNext: boolean;
}
```

**Реализация**:

```typescript
// user/user.controller.ts
@Get()
async getUsers(
    @Query() query: GetUsersDto,
    @CurrentUser() currentUser: User,
) {
    return await this.userService.getUsers({
        currentUserId: currentUser.id,
        cursor: query.cursor,
        limit: Math.min(query.limit || 20, 50),
        search: query.search,
        filters: query.filters,
    });
}
```

```typescript
// user/user.service.ts
async getUsers(options: {
    currentUserId: string;
    cursor?: string;
    limit: number;
    search?: string;
    filters?: {
        relationship?: string[];
        online?: boolean;
    };
}): Promise<{ users: UserDto[]; nextCursor?: string; hasNext: boolean }> {
    const where: any = {
        id: {
            not: options.currentUserId,
        },
    };

    // Поиск по имени или email
    if (options.search) {
        where.OR = [
            {
                name: {
                    contains: options.search,
                    mode: 'insensitive',
                },
            },
            {
                email: {
                    contains: options.search,
                    mode: 'insensitive',
                },
            },
        ];
    }

    // Фильтр по отношениям
    if (options.filters?.relationship && !options.filters.relationship.includes('all')) {
        // Получаем ID пользователей по отношениям
        const userIds = await this.getUserIdsByRelationship(
            options.currentUserId,
            options.filters.relationship
        );

        if (userIds.length > 0) {
            where.id = {
                in: userIds,
                not: options.currentUserId,
            };
        } else {
            // Если нет пользователей с такими отношениями, возвращаем пустой результат
            return {
                users: [],
                hasNext: false,
            };
        }
    }

    // Фильтр по онлайн статусу
    if (options.filters?.online) {
        // Получаем онлайн пользователей из Redis
        const onlineUserIds = await this.presenceService.getOnlineUsers();
        if (onlineUserIds.length > 0) {
            where.id = {
                ...where.id,
                in: Array.isArray(where.id?.in)
                    ? where.id.in.filter(id => onlineUserIds.includes(id))
                    : onlineUserIds,
            };
        } else {
            return {
                users: [],
                hasNext: false,
            };
        }
    }

    // Cursor-based пагинация
    if (options.cursor) {
        where.id = {
            ...where.id,
            gt: options.cursor,
        };
    }

    const users = await this.prisma.user.findMany({
        where,
        orderBy: {
            createdAt: 'desc',
        },
        take: options.limit + 1,
        include: {
            profile: true,
            followers: {
                where: {
                    followerId: options.currentUserId,
                },
            },
            following: {
                where: {
                    followingId: options.currentUserId,
                },
            },
        },
    });

    const hasNext = users.length > options.limit;
    const resultUsers = hasNext ? users.slice(0, -1) : users;
    const nextCursor = hasNext ? resultUsers[resultUsers.length - 1].id : undefined;

    return {
        users: resultUsers.map(user => {
            const isFollowing = user.following.length > 0;
            const isFollower = user.followers.length > 0;
            const isFriend = isFollowing && isFollower;

            return new UserDto({
                ...user,
                isFollowing,
                isFollower,
                isFriend,
            });
        }),
        nextCursor,
        hasNext,
    };
}

private async getUserIdsByRelationship(
    currentUserId: string,
    relationships: string[]
): Promise<string[]> {
    const userIds: string[] = [];

    for (const relationship of relationships) {
        switch (relationship) {
            case 'followers':
                // Пользователи, которые подписаны на меня
                const followers = await this.prisma.follow.findMany({
                    where: {
                        followingId: currentUserId,
                    },
                    select: {
                        followerId: true,
                    },
                });
                userIds.push(...followers.map(f => f.followerId));
                break;

            case 'following':
                // Пользователи, на которых я подписан
                const following = await this.prisma.follow.findMany({
                    where: {
                        followerId: currentUserId,
                    },
                    select: {
                        followingId: true,
                    },
                });
                userIds.push(...following.map(f => f.followingId));
                break;

            case 'friends':
                // Взаимные подписки
                const myFollowing = await this.prisma.follow.findMany({
                    where: {
                        followerId: currentUserId,
                    },
                    select: {
                        followingId: true,
                    },
                });
                const myFollowingIds = myFollowing.map(f => f.followingId);

                const mutual = await this.prisma.follow.findMany({
                    where: {
                        followerId: { in: myFollowingIds },
                        followingId: currentUserId,
                    },
                    select: {
                        followerId: true,
                    },
                });
                userIds.push(...mutual.map(f => f.followerId));
                break;

            case 'not_following':
                // Пользователи, на которых я не подписан
                const allUsers = await this.prisma.user.findMany({
                    where: {
                        id: { not: currentUserId },
                    },
                    select: {
                        id: true,
                    },
                });
                const myFollowingIds2 = (await this.prisma.follow.findMany({
                    where: {
                        followerId: currentUserId,
                    },
                    select: {
                        followingId: true,
                    },
                })).map(f => f.followingId);

                const notFollowing = allUsers
                    .filter(u => !myFollowingIds2.includes(u.id))
                    .map(u => u.id);
                userIds.push(...notFollowing);
                break;
        }
    }

    // Убираем дубликаты
    return [...new Set(userIds)];
}
```

## Оптимизация

### Индексы базы данных

**Для постов**:
```sql
-- Индекс для поиска по тексту
CREATE INDEX idx_posts_text_search ON posts(text(255));

-- Индекс для фильтрации по типу и дате
CREATE INDEX idx_posts_type_created ON posts(type, createdAt);

-- Индекс для фильтрации по автору
CREATE INDEX idx_posts_author_created ON posts(authorId, createdAt);

-- Композитный индекс для cursor-based пагинации
CREATE INDEX idx_posts_cursor ON posts(id, createdAt);
```

**Для чатов**:
```sql
-- Индекс для поиска по имени
CREATE INDEX idx_chats_name_search ON chats(name(255));

-- Индекс для фильтрации по типу
CREATE INDEX idx_chats_type_updated ON chats(type, updatedAt);

-- Композитный индекс для cursor-based пагинации
CREATE INDEX idx_chats_cursor ON chats(id, updatedAt);
```

**Для пользователей**:
```sql
-- Индекс для поиска по имени
CREATE INDEX idx_users_name_search ON users(name(255));

-- Индекс для поиска по email
CREATE INDEX idx_users_email_search ON users(email(255));

-- Композитный индекс для cursor-based пагинации
CREATE INDEX idx_users_cursor ON users(id, createdAt);
```

### Кэширование

**Redis кэширование для частых запросов**:

```typescript
// Использование Redis для кэширования результатов поиска
async getFeed(options: GetFeedOptions) {
    const cacheKey = `feed:${JSON.stringify(options)}`;

    // Проверяем кэш
    const cached = await this.redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    // Выполняем запрос
    const result = await this.executeFeedQuery(options);

    // Кэшируем на 1 минуту
    await this.redis.setex(cacheKey, 60, JSON.stringify(result));

    return result;
}
```

## DTO

```typescript
// post/dto/get-feed.dto.ts
export class GetFeedDto {
    @IsOptional()
    @IsString()
    cursor?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => FeedFiltersDto)
    filters?: FeedFiltersDto;

    @IsOptional()
    @IsEnum(['date', 'popularity'])
    sort?: 'date' | 'popularity';
}

export class FeedFiltersDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    type?: string[];

    @IsOptional()
    @IsEnum(['all', 'following', 'my'])
    author?: 'all' | 'following' | 'my';

    @IsOptional()
    @IsEnum(['all', 'today', 'week', 'month'])
    date?: 'all' | 'today' | 'week' | 'month';
}
```

## Связанные задачи

- [Frontend задача по Filter и Search](../frontend/tasks/filter-search-components.md) - **обязательно** - реализация UI компонентов
- [Модуль новости (Backend)](./news-feed-endpoint.md) - обновление endpoint ленты новостей
- [Пагинация пользователей](./users-pagination.md) - обновление endpoint пользователей

## Этапы реализации

### Этап 1: Обновление DTO

- [ ] Создать DTO для фильтров и поиска для постов
- [ ] Создать DTO для фильтров и поиска для чатов
- [ ] Создать DTO для фильтров и поиска для пользователей

### Этап 2: Обновление сервисов

- [ ] Обновить `PostService.getFeed` для поддержки фильтров и поиска
- [ ] Обновить `ChatService.getChats` для поддержки фильтров и поиска
- [ ] Обновить `UserService.getUsers` для поддержки фильтров и поиска

### Этап 3: Оптимизация

- [ ] Добавить индексы в базу данных
- [ ] Реализовать кэширование (опционально)
- [ ] Оптимизировать запросы с фильтрами

### Этап 4: Тестирование

- [ ] Протестировать фильтрацию постов
- [ ] Протестировать поиск постов
- [ ] Протестировать фильтрацию чатов
- [ ] Протестировать поиск чатов
- [ ] Протестировать фильтрацию пользователей
- [ ] Протестировать поиск пользователей
- [ ] Протестировать комбинацию фильтров и поиска
- [ ] Протестировать пагинацию с фильтрами и поиском
