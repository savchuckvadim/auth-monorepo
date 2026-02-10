# Функционал групп (Backend)

## Назначение

Создать backend функционал для групп (публичные и закрытые) по аналогии с ВКонтакте. Группа выглядит как профиль с постами, может иметь групповой чат, поддерживает теги и фильтрацию. После переезда на LiveKit расширить функционал звонков до групповых.

## Зависимости

**Важно**: Эта задача должна выполняться **после** миграции на LiveKit, так как требует групповых звонков через LiveKit.

**Связанная frontend задача**: См. [Frontend задача по группам](../../frontend/tasks/groups.md)

## Требования

### Основные функции

1. **Типы групп**:
   - Публичные группы - видят все пользователи
   - Закрытые группы - видят только участники

2. **Структура группы**:
   - Группа имеет название, описание, аватар, hero изображение
   - У группы может быть или не быть групповой чат
   - Группа связана с постами

3. **Участники группы**:
   - Роли: администратор, модератор, участник
   - Управление участниками (для админов)

4. **Теги групп**:
   - У каждой группы есть основной тег (категория/тема)
   - Фильтрация групп по тегам
   - Поиск групп по тегам

5. **Оповещения**:
   - Оповещения о постах в группах работают как для обычных постов
   - Оповещения о сообщениях в групповых чатах работают как для обычных сообщений

6. **Групповые звонки** (после LiveKit):
   - Возможность создавать групповые звонки в группах
   - Поддержка нескольких участников в одном звонке

## База данных

### Prisma Schema

**Новые модели**:

```prisma
// Group model
model Group {
    id          String            @id @default(uuid())
    name        String            @db.VarChar(255)
    description String?           @db.Text
    avatar      String?           @db.VarChar(500) // URL аватара
    hero        String?           @db.VarChar(500) // URL hero изображения
    visibility  GroupVisibility  @default(PUBLIC)
    tag         String            @db.VarChar(100) // Основной тег группы
    hasChat     Boolean           @default(false)  // Есть ли групповой чат
    chatId      String?           @unique @map("chat_id") @db.VarChar(255)
    ownerId     String            @map("owner_id") @db.VarChar(255)
    createdAt   DateTime          @default(now())
    updatedAt   DateTime          @updatedAt

    owner   User          @relation("GroupOwner", fields: [ownerId], references: [id], onDelete: Cascade)
    members GroupMember[]
    posts   Post[]
    chat    Chat?         @relation(fields: [chatId], references: [id], onDelete: SetNull)

    @@index([visibility])
    @@index([tag])
    @@index([ownerId])
    @@index([createdAt])
    @@map("groups")
}

// Group member model
model GroupMember {
    id        String           @id @default(uuid())
    groupId   String           @map("group_id") @db.VarChar(255)
    userId    String           @map("user_id") @db.VarChar(255)
    role      GroupMemberRole  @default(MEMBER)
    joinedAt  DateTime         @default(now()) @map("joined_at")
    leftAt    DateTime?        @map("left_at")

    group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
    user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([groupId, userId])
    @@index([userId])
    @@index([groupId])
    @@map("group_members")
}

// Enums
enum GroupVisibility {
    PUBLIC
    PRIVATE
}

enum GroupMemberRole {
    ADMIN
    MODERATOR
    MEMBER
}
```

**Обновление существующих моделей**:

```prisma
// Обновить модель Post
model Post {
    // ... существующие поля
    groupId String? @map("group_id") @db.VarChar(255) // Новое поле

    // ... существующие relations
    group Group? @relation(fields: [groupId], references: [id], onDelete: SetNull)

    @@index([groupId]) // Новый индекс
}

// Обновить модель User
model User {
    // ... существующие поля

    // Новые relations
    ownedGroups  Group[]        @relation("GroupOwner")
    groupMembers GroupMember[]
}
```

## Архитектура модулей

### Module: `modules/group/`

**Структура**:
```
modules/group/
├── group.module.ts
├── controllers/
│   └── group.controller.ts
├── services/
│   ├── group.service.ts
│   └── group-member.service.ts
├── repositories/
│   └── group.repository.ts
├── dto/
│   ├── create-group.dto.ts
│   ├── update-group.dto.ts
│   ├── group.dto.ts
│   ├── group-member.dto.ts
│   └── group-filter.dto.ts
├── socket/
│   └── group.gateway.ts (опционально, для real-time обновлений)
└── types/
    └── group.types.ts
```

## API Endpoints

### Groups

#### `POST /api/groups`
Создание новой группы

**Request**:
```typescript
{
    name: string;
    description?: string;
    avatar?: string;
    hero?: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    tag: string;
    hasChat: boolean;
}
```

**Response**: `GroupDto`

#### `GET /api/groups`
Получение списка групп с фильтрацией

**Query params**:
- `filter?: 'all' | 'member' | 'admin'` - фильтр по участию
- `tags?: string[]` - фильтр по тегам (массив)
- `search?: string` - поиск по названию
- `page?: number` - страница
- `limit?: number` - количество на странице

**Response**: `{ groups: GroupDto[], total: number, page: number, limit: number }`

#### `GET /api/groups/:id`
Получение группы по ID

**Response**: `GroupDto`

#### `PUT /api/groups/:id`
Обновление группы (только для админов)

**Request**: `UpdateGroupDto`

**Response**: `GroupDto`

#### `DELETE /api/groups/:id`
Удаление группы (только для владельца)

**Response**: `{ success: boolean }`

### Group Members

#### `POST /api/groups/:id/members`
Присоединение к группе

**Response**: `GroupMemberDto`

#### `DELETE /api/groups/:id/members/:userId`
Покидание группы или удаление участника (для админов)

**Response**: `{ success: boolean }`

#### `GET /api/groups/:id/members`
Получение списка участников группы

**Query params**:
- `role?: 'ADMIN' | 'MODERATOR' | 'MEMBER'` - фильтр по роли
- `page?: number`
- `limit?: number`

**Response**: `{ members: GroupMemberDto[], total: number }`

#### `PUT /api/groups/:id/members/:userId/role`
Изменение роли участника (только для админов)

**Request**:
```typescript
{
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
}
```

**Response**: `GroupMemberDto`

### Group Posts

#### `GET /api/groups/:id/posts`
Получение постов группы

**Query params**:
- `page?: number`
- `limit?: number`

**Response**: `{ posts: PostDto[], total: number }`

**Примечание**: Использует существующий endpoint постов с фильтром по `groupId`

### Group Tags

#### `GET /api/groups/tags`
Получение списка всех тегов групп

**Response**: `{ tags: GroupTagDto[] }`

#### `GET /api/groups/tags/:tag`
Получение групп по тегу

**Query params**: те же, что и для `GET /api/groups`

**Response**: `{ groups: GroupDto[], total: number }`

## DTOs

### CreateGroupDto

```typescript
export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000)
    description?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    hero?: string;

    @IsEnum(GroupVisibility)
    visibility: GroupVisibility;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    tag: string;

    @IsBoolean()
    hasChat: boolean;
}
```

### GroupDto

```typescript
export class GroupDto {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
    hero?: string;
    visibility: GroupVisibility;
    tag: string;
    hasChat: boolean;
    chatId?: string;
    ownerId: string;
    membersCount: number;
    postsCount: number;
    createdAt: Date;
    updatedAt: Date;
    owner?: UserDto;
    isMember?: boolean;        // Является ли текущий пользователь участником
    memberRole?: GroupMemberRole; // Роль текущего пользователя (если участник)
}
```

### GroupMemberDto

```typescript
export class GroupMemberDto {
    id: string;
    groupId: string;
    userId: string;
    role: GroupMemberRole;
    joinedAt: Date;
    leftAt?: Date;
    user?: UserDto;
}
```

## Business Logic

### GroupService

**Методы**:

1. `createGroup(userId: string, dto: CreateGroupDto): Promise<GroupDto>`
   - Создает группу
   - Автоматически добавляет создателя как админа
   - Если `hasChat = true`, создает групповой чат

2. `getGroups(userId: string, filters: GroupFiltersDto): Promise<PaginatedGroupsDto>`
   - Получает список групп с фильтрацией
   - Учитывает видимость (публичные видят все, закрытые - только участники)
   - Фильтрует по участию пользователя

3. `getGroupById(userId: string, groupId: string): Promise<GroupDto>`
   - Получает группу по ID
   - Проверяет права доступа (для закрытых групп)
   - Добавляет информацию о членстве пользователя

4. `updateGroup(userId: string, groupId: string, dto: UpdateGroupDto): Promise<GroupDto>`
   - Обновляет группу
   - Проверяет права (только админы)

5. `deleteGroup(userId: string, groupId: string): Promise<void>`
   - Удаляет группу
   - Проверяет права (только владелец)

### GroupMemberService

**Методы**:

1. `joinGroup(userId: string, groupId: string): Promise<GroupMemberDto>`
   - Присоединение к группе
   - Для публичных групп - автоматическое
   - Для закрытых групп - может требовать одобрения (будущее расширение)

2. `leaveGroup(userId: string, groupId: string): Promise<void>`
   - Покидание группы
   - Если это последний админ - запретить или передать права

3. `removeMember(adminId: string, groupId: string, userId: string): Promise<void>`
   - Удаление участника (только для админов)

4. `updateMemberRole(adminId: string, groupId: string, userId: string, role: GroupMemberRole): Promise<GroupMemberDto>`
   - Изменение роли участника (только для админов)

5. `getGroupMembers(groupId: string, filters?: MemberFiltersDto): Promise<PaginatedMembersDto>`
   - Получение списка участников

## Интеграция с существующими модулями

### Posts

**Обновление PostService**:
- Добавить поддержку `groupId` при создании поста
- Фильтрация постов по `groupId`
- Проверка прав при создании поста в группе (только участники)

**Обновление PostDto**:
- Добавить поле `groupId?: string`
- Добавить поле `group?: GroupDto` (опционально)

### Chats

**Использование существующей модели Chat**:
- При создании группы с `hasChat = true` создавать чат типа `GROUP`
- Связывать группу с чатом через `group.chatId`
- Автоматически добавлять всех участников группы в чат

**Обновление ChatService**:
- При присоединении к группе - автоматически добавлять в чат (если есть)
- При покидании группы - удалять из чата

### Calls (после LiveKit)

**Расширение CallService**:
- Поддержка групповых звонков через LiveKit
- `roomName = group-${groupId}` для групповых звонков
- Генерация токенов для всех участников группы

**Обновление CallDto**:
- Добавить поле `groupId?: string`
- Добавить поле `isGroupCall: boolean`
- Добавить поле `participants: string[]` (список участников)

### Notifications

**Использование существующей системы**:
- Оповещения о постах в группах работают автоматически через существующий механизм
- Оповещения о сообщениях в групповых чатах работают автоматически
- Можно добавить специальные типы уведомлений для групп (опционально)

## Теги групп

### Предопределенные теги

```typescript
export const GROUP_TAGS = [
    { id: 'technology', name: 'Технологии', slug: 'technology' },
    { id: 'music', name: 'Музыка', slug: 'music' },
    { id: 'sports', name: 'Спорт', slug: 'sports' },
    { id: 'gaming', name: 'Игры', slug: 'gaming' },
    { id: 'art', name: 'Искусство', slug: 'art' },
    { id: 'education', name: 'Образование', slug: 'education' },
    { id: 'business', name: 'Бизнес', slug: 'business' },
    { id: 'entertainment', name: 'Развлечения', slug: 'entertainment' },
    { id: 'news', name: 'Новости', slug: 'news' },
    { id: 'other', name: 'Другое', slug: 'other' }
];
```

### GroupTagService

**Методы**:
- `getAllTags(): Promise<GroupTagDto[]>` - получить все теги
- `getGroupsByTag(tag: string, filters: GroupFiltersDto): Promise<PaginatedGroupsDto>` - группы по тегу

## Миграции базы данных

### Migration: Create Groups

```sql
-- Создание таблицы groups
CREATE TABLE groups (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar VARCHAR(500),
    hero VARCHAR(500),
    visibility ENUM('PUBLIC', 'PRIVATE') DEFAULT 'PUBLIC',
    tag VARCHAR(100) NOT NULL,
    has_chat BOOLEAN DEFAULT FALSE,
    chat_id VARCHAR(255) UNIQUE,
    owner_id VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE SET NULL,
    INDEX idx_visibility (visibility),
    INDEX idx_tag (tag),
    INDEX idx_owner_id (owner_id),
    INDEX idx_created_at (created_at)
);

-- Создание таблицы group_members
CREATE TABLE group_members (
    id VARCHAR(255) PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MODERATOR', 'MEMBER') DEFAULT 'MEMBER',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME,
    UNIQUE KEY unique_group_user (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_group_id (group_id)
);

-- Добавление поля group_id в таблицу posts
ALTER TABLE posts ADD COLUMN group_id VARCHAR(255);
ALTER TABLE posts ADD INDEX idx_group_id (group_id);
ALTER TABLE posts ADD FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;
```

## Задачи

### Этап 1: Базовая структура

- [ ] Создать Prisma модели Group и GroupMember
- [ ] Создать миграцию базы данных
- [ ] Создать модуль `group` с базовой структурой
- [ ] Создать GroupService с CRUD операциями
- [ ] Создать GroupController с базовыми endpoints
- [ ] Создать DTOs для групп

### Этап 2: Участники групп

- [ ] Создать GroupMemberService
- [ ] Реализовать присоединение/покидание группы
- [ ] Реализовать управление участниками (для админов)
- [ ] Реализовать роли участников

### Этап 3: Интеграция с постами

- [ ] Обновить модель Post (добавить groupId)
- [ ] Обновить PostService для поддержки групп
- [ ] Обновить PostDto (добавить groupId и group)
- [ ] Реализовать проверку прав при создании поста в группе

### Этап 4: Интеграция с чатами

- [ ] Реализовать создание группового чата при создании группы
- [ ] Связать группу с чатом
- [ ] Автоматическое добавление участников в чат
- [ ] Обновление чата при изменении участников группы

### Этап 5: Теги и фильтрация

- [ ] Реализовать систему тегов
- [ ] Реализовать фильтрацию по тегам
- [ ] Реализовать поиск групп
- [ ] Реализовать фильтрацию по участию (все, участник, админ)

### Этап 6: Групповые звонки (после LiveKit)

- [ ] Расширить CallService для групповых звонков
- [ ] Реализовать генерацию токенов для всех участников
- [ ] Обновить CallDto для групповых звонков
- [ ] Интеграция с LiveKit для групповых звонков

### Этап 7: Оповещения

- [ ] Проверить работу оповещений о постах в группах
- [ ] Проверить работу оповещений о сообщениях в групповых чатах
- [ ] При необходимости добавить специальные типы уведомлений

## Файлы для работы

### Backend

- `apps/api/prisma/schema.prisma` - обновить схему
- Создать `apps/api/src/modules/group/` - новый модуль
- Обновить `apps/api/src/modules/post/` - добавить поддержку групп
- Обновить `apps/api/src/modules/chats/` - интеграция с группами
- Обновить `apps/api/src/modules/calls/` - групповые звонки (после LiveKit)

## Связанные задачи

- [Frontend задача по группам](../../frontend/tasks/groups.md) - связанная frontend задача
- Миграция на LiveKit - **обязательно выполнить перед групповыми звонками**
