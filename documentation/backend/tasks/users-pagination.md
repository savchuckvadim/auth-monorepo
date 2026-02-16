# Пагинация списка пользователей

## Назначение

Добавить поддержку пагинации для endpoint получения списка пользователей. Реализовать cursor-based пагинацию для эффективной загрузки больших списков пользователей.

## Текущее состояние

**Endpoint**: `GET /api/user`

**Текущая реализация**:
- Возвращает всех пользователей сразу
- Нет пагинации
- Может быть медленным при большом количестве пользователей

## Требования

### Функционал

1. **Cursor-based пагинация**:
   - Использовать cursor (ID последнего пользователя) для пагинации
   - Поддержка параметров `cursor` и `limit`
   - Возвращать `nextCursor` и `hasNext`

2. **Оптимизация**:
   - Индексы в БД для быстрого поиска
   - Ограничение количества на странице (максимум 50)

3. **Обратная совместимость**:
   - Если параметры не указаны, возвращать первые N пользователей (по умолчанию 20)

## API Endpoint

### `GET /api/user`

**Query параметры**:

```typescript
{
    cursor?: string;    // ID последнего пользователя (для пагинации)
    limit?: number;    // Количество пользователей (по умолчанию 20, максимум 50)
    search?: string;   // Поиск по имени или email (опционально)
}
```

**Response**:

```typescript
{
    users: UserDto[];
    nextCursor?: string;  // ID последнего пользователя для следующей страницы
    hasNext: boolean;     // Есть ли еще пользователи
    total?: number;      // Общее количество (опционально, для UI)
}
```

## Реализация

### Обновление DTO

**UsersQueryDto**:

```typescript
export class UsersQueryDto {
    @IsOptional()
    @IsString()
    cursor?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(50)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;
}
```

**PaginatedUsersDto**:

```typescript
export class PaginatedUsersDto {
    @ApiProperty({ description: 'Users list', type: [UserDto] })
    users: UserDto[];

    @ApiProperty({ description: 'Next cursor for pagination', required: false })
    nextCursor?: string;

    @ApiProperty({ description: 'Has next page' })
    hasNext: boolean;

    @ApiProperty({ description: 'Total count', required: false })
    total?: number;
}
```

### Обновление UserController

```typescript
@Get()
@ApiOperation({ summary: 'Get all users (with pagination)' })
@ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination (user ID)', example: 'user-id' })
@ApiQuery({ name: 'limit', required: false, description: 'Number of users to return', example: 20 })
@ApiQuery({ name: 'search', required: false, description: 'Search by name or email', example: 'john' })
@ApiResponse({ status: 200, description: 'Users list', type: PaginatedUsersDto })
async getAllUsers(
    @CurrentUser() user: TokenPayloadDto,
    @Query() query: UsersQueryDto,
): Promise<PaginatedUsersDto> {
    return await this.service.getAllUsers(
        user.userId,
        query.cursor,
        query.limit,
        query.search,
    );
}
```

### Обновление UserService

```typescript
public async getAllUsers(
    currentUserId: string,
    cursor?: string,
    limit: number = 20,
    search?: string,
): Promise<PaginatedUsersDto> {
    const result = await this.repo.getAllPaginated(
        currentUserId,
        cursor,
        limit,
        search,
    );

    return {
        users: result.users.map(user => new UserDto(user)),
        nextCursor: result.nextCursor,
        hasNext: result.hasNext,
    };
}
```

### Обновление UserRepository

**Добавить метод**:

```typescript
abstract getAllPaginated(
    currentUserId: string,
    cursor?: string,
    limit?: number,
    search?: string,
): Promise<{
    users: UserWithFollowStatusType[];
    nextCursor?: string;
    hasNext: boolean;
}>;
```

### Реализация в UserPrismaRepository

```typescript
async getAllPaginated(
    currentUserId: string,
    cursor?: string,
    limit: number = 20,
    search?: string,
): Promise<{
    users: UserWithFollowStatusType[];
    nextCursor?: string;
    hasNext: boolean;
}> {
    const take = limit + 1; // Берем на 1 больше для проверки hasNext

    const where: any = {
        id: { not: currentUserId }, // Исключаем текущего пользователя
    };

    // Cursor для пагинации
    if (cursor) {
        where.id = {
            ...where.id,
            gt: cursor, // ID больше cursor (для сортировки по ID)
        };
    }

    // Поиск
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }

    const users = await this.prisma.user.findMany({
        where,
        take,
        orderBy: { id: 'asc' }, // Сортировка по ID для cursor-based пагинации
        include: {
            // Include для follow status
            followers: {
                where: { followerId: currentUserId },
                select: { id: true },
            },
            following: {
                where: { followingId: currentUserId },
                select: { id: true },
            },
        },
    });

    const hasNext = users.length > limit;
    const resultUsers = hasNext ? users.slice(0, limit) : users;
    const nextCursor = resultUsers.length > 0
        ? resultUsers[resultUsers.length - 1].id
        : undefined;

    // Преобразование для follow status
    const usersWithStatus = resultUsers.map(user => ({
        ...user,
        isFollowing: user.followers.length > 0,
        isFollower: user.following.length > 0,
        isFriend: user.followers.length > 0 && user.following.length > 0,
    }));

    return {
        users: usersWithStatus,
        nextCursor,
        hasNext,
    };
}
```

## Индексы базы данных

### Необходимые индексы

```sql
-- Индекс для пагинации по ID
CREATE INDEX idx_users_id ON users(id);

-- Индекс для поиска по имени
CREATE INDEX idx_users_name ON users(name);

-- Индекс для поиска по email
CREATE INDEX idx_users_email ON users(email);

-- Композитный индекс для оптимизации запросов
CREATE INDEX idx_users_search ON users(name, email);
```

## Оптимизация

### Кэширование (опционально)

Можно добавить кэширование результатов поиска:

```typescript
// В UserService
async getAllUsers(...): Promise<PaginatedUsersDto> {
    const cacheKey = `users:${currentUserId}:${cursor}:${limit}:${search}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const result = await this.repo.getAllPaginated(...);

    // Кэшируем на 30 секунд
    await this.redis.setex(cacheKey, 30, JSON.stringify(result));

    return result;
}
```

## Задачи

### Этап 1: Обновление DTO и контроллера

- [ ] Создать `UsersQueryDto` с параметрами пагинации
- [ ] Создать `PaginatedUsersDto` для ответа
- [ ] Обновить `UserController.getAllUsers` для принятия query параметров
- [ ] Обновить Swagger документацию

### Этап 2: Реализация пагинации

- [ ] Добавить метод `getAllPaginated` в `UserRepository`
- [ ] Реализовать `getAllPaginated` в `UserPrismaRepository`
- [ ] Обновить `UserService.getAllUsers` для использования пагинации

### Этап 3: Оптимизация

- [ ] Добавить индексы в БД
- [ ] Оптимизировать SQL запросы
- [ ] Опционально: добавить кэширование

### Этап 4: Тестирование

- [ ] Протестировать пагинацию
- [ ] Протестировать поиск
- [ ] Протестировать производительность

## Файлы для работы

- `apps/api/src/modules/user/dto/user.dto.ts` - добавить DTOs
- `apps/api/src/modules/user/controllers/user.controller.ts` - обновить endpoint
- `apps/api/src/modules/user/services/user.service.ts` - обновить метод
- `apps/api/src/modules/user/repositories/user.repository.ts` - добавить метод
- `apps/api/src/modules/user/repositories/user.prisma.repository.ts` - реализовать метод
- `apps/api/prisma/schema.prisma` - добавить индексы (через миграцию)

## Связанные задачи

- [Frontend задача по странице People](../../frontend/tasks/people-page.md) - связанная frontend задача

## Примечания

- Использовать cursor-based пагинацию (эффективнее чем offset)
- Обеспечить обратную совместимость (если параметры не указаны)
- Оптимизировать запросы для больших списков
- Поддержка поиска опциональна, но желательна
