# История аватаров и hero изображений

## Назначение

Реализовать хранение истории аватаров и hero изображений пользователя. Пользователь может иметь множество аватаров и hero изображений, которые сохраняются в истории.

## Требования

### Функционал

1. **История аватаров**:
   - При загрузке нового аватара старый сохраняется в истории
   - Хранение всех предыдущих аватаров
   - Возможность выбрать аватар из истории

2. **История hero изображений**:
   - При загрузке нового hero старый сохраняется в истории
   - Хранение всех предыдущих hero изображений
   - Возможность выбрать hero из истории

3. **Ограничения**:
   - Максимальное количество в истории (например, 20)
   - Автоматическое удаление старых записей при превышении лимита

## База данных

### Prisma Schema

**Новые модели**:

```prisma
// Profile avatar history
model ProfileAvatarHistory {
    id        String   @id @default(uuid())
    profileId String   @map("profile_id") @db.VarChar(255)
    avatarUrl String   @map("avatar_url") @db.VarChar(500)
    createdAt DateTime @default(now()) @map("created_at")
    isCurrent Boolean  @default(false) @map("is_current") // Текущий аватар

    profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

    @@index([profileId])
    @@index([profileId, isCurrent])
    @@index([createdAt])
    @@map("profile_avatar_history")
}

// Profile hero history
model ProfileHeroHistory {
    id        String   @id @default(uuid())
    profileId String   @map("profile_id") @db.VarChar(255)
    heroUrl   String   @map("hero_url") @db.VarChar(500)
    createdAt DateTime @default(now()) @map("created_at")
    isCurrent Boolean  @default(false) @map("is_current") // Текущий hero

    profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

    @@index([profileId])
    @@index([profileId, isCurrent])
    @@index([createdAt])
    @@map("profile_hero_history")
}
```

**Обновление модели Profile**:

```prisma
model Profile {
    // ... существующие поля

    // Новые relations
    avatarHistory ProfileAvatarHistory[]
    heroHistory   ProfileHeroHistory[]
}
```

## API Endpoints

### Avatar History

#### `GET /api/profile/me/avatars`
Получение истории аватаров текущего пользователя

**Response**:
```typescript
{
    avatars: Array<{
        id: string;
        avatarUrl: string;
        createdAt: Date;
        isCurrent: boolean;
    }>;
    current: {
        id: string;
        avatarUrl: string;
        createdAt: Date;
    } | null;
}
```

#### `POST /api/profile/me/avatars/:id/restore`
Восстановление аватара из истории

**Response**: `ProfileDto`

#### `DELETE /api/profile/me/avatars/:id`
Удаление аватара из истории

**Response**: `{ success: boolean }`

### Hero History

#### `GET /api/profile/me/heroes`
Получение истории hero изображений текущего пользователя

**Response**:
```typescript
{
    heroes: Array<{
        id: string;
        heroUrl: string;
        createdAt: Date;
        isCurrent: boolean;
    }>;
    current: {
        id: string;
        heroUrl: string;
        createdAt: Date;
    } | null;
}
```

#### `POST /api/profile/me/heroes/:id/restore`
Восстановление hero из истории

**Response**: `ProfileDto`

#### `DELETE /api/profile/me/heroes/:id`
Удаление hero из истории

**Response**: `{ success: boolean }`

## Реализация

### ProfileService

**Обновление метода updateProfile**:

```typescript
public async updateProfile(
    userId: string,
    data: UpdateProfileDto
): Promise<ProfileDto> {
    const profile = await this.repo.findByUserId(userId);

    // Если меняется аватар, сохраняем старый в историю
    if (data.avatar && profile.avatar && data.avatar !== profile.avatar) {
        await this.avatarHistoryRepo.create({
            profileId: profile.id,
            avatarUrl: profile.avatar,
            isCurrent: false
        });

        // Помечаем все предыдущие как не текущие
        await this.avatarHistoryRepo.markAllAsNotCurrent(profile.id);

        // Добавляем новый в историю как текущий
        await this.avatarHistoryRepo.create({
            profileId: profile.id,
            avatarUrl: data.avatar,
            isCurrent: true
        });
    }

    // Аналогично для hero
    if (data.hero && profile.hero && data.hero !== profile.hero) {
        await this.heroHistoryRepo.create({
            profileId: profile.id,
            heroUrl: profile.hero,
            isCurrent: false
        });

        await this.heroHistoryRepo.markAllAsNotCurrent(profile.id);

        await this.heroHistoryRepo.create({
            profileId: profile.id,
            heroUrl: data.hero,
            isCurrent: true
        });
    }

    // Обновляем профиль
    return new ProfileDto(await this.repo.update(userId, data));
}
```

**Новые методы**:

```typescript
// Получить историю аватаров
public async getAvatarHistory(userId: string): Promise<AvatarHistoryDto[]> {
    const profile = await this.repo.findByUserId(userId);
    return await this.avatarHistoryRepo.findByProfileId(profile.id);
}

// Восстановить аватар из истории
public async restoreAvatar(userId: string, avatarId: string): Promise<ProfileDto> {
    const profile = await this.repo.findByUserId(userId);
    const avatarHistory = await this.avatarHistoryRepo.findById(avatarId);

    if (avatarHistory.profileId !== profile.id) {
        throw new ForbiddenException('Avatar does not belong to this profile');
    }

    // Сохраняем текущий в историю
    if (profile.avatar) {
        await this.avatarHistoryRepo.create({
            profileId: profile.id,
            avatarUrl: profile.avatar,
            isCurrent: false
        });
    }

    // Помечаем все как не текущие
    await this.avatarHistoryRepo.markAllAsNotCurrent(profile.id);

    // Помечаем выбранный как текущий
    await this.avatarHistoryRepo.update(avatarId, { isCurrent: true });

    // Обновляем профиль
    return new ProfileDto(await this.repo.update(userId, {
        avatar: avatarHistory.avatarUrl
    }));
}

// Аналогично для hero
public async getHeroHistory(userId: string): Promise<HeroHistoryDto[]>
public async restoreHero(userId: string, heroId: string): Promise<ProfileDto>
```

### ProfileAvatarHistoryRepository

**Методы**:

```typescript
async create(data: {
    profileId: string;
    avatarUrl: string;
    isCurrent: boolean;
}): Promise<ProfileAvatarHistory>

async findByProfileId(profileId: string): Promise<ProfileAvatarHistory[]>

async findById(id: string): Promise<ProfileAvatarHistory>

async markAllAsNotCurrent(profileId: string): Promise<void>

async update(id: string, data: { isCurrent: boolean }): Promise<ProfileAvatarHistory>

async delete(id: string): Promise<void>

// Очистка старых записей (оставить только последние N)
async cleanupOld(profileId: string, keepCount: number = 20): Promise<void>
```

### Очистка истории

**Автоматическая очистка**:
- При добавлении нового аватара/hero проверять количество в истории
- Если больше лимита (20), удалять самые старые

**Реализация**:

```typescript
private async cleanupHistory(profileId: string, type: 'avatar' | 'hero') {
    const MAX_HISTORY = 20;

    if (type === 'avatar') {
        const count = await this.avatarHistoryRepo.countByProfileId(profileId);
        if (count > MAX_HISTORY) {
            await this.avatarHistoryRepo.cleanupOld(profileId, MAX_HISTORY);
        }
    } else {
        const count = await this.heroHistoryRepo.countByProfileId(profileId);
        if (count > MAX_HISTORY) {
            await this.heroHistoryRepo.cleanupOld(profileId, MAX_HISTORY);
        }
    }
}
```

## Миграции базы данных

### Migration: Create Profile History Tables

```sql
-- Создание таблицы profile_avatar_history
CREATE TABLE profile_avatar_history (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_profile_current (profile_id, is_current),
    INDEX idx_created_at (created_at)
);

-- Создание таблицы profile_hero_history
CREATE TABLE profile_hero_history (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL,
    hero_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_profile_current (profile_id, is_current),
    INDEX idx_created_at (created_at)
);
```

## Задачи

### Этап 1: База данных

- [ ] Создать Prisma модели ProfileAvatarHistory и ProfileHeroHistory
- [ ] Создать миграцию базы данных
- [ ] Обновить модель Profile

### Этап 2: Репозитории

- [ ] Создать ProfileAvatarHistoryRepository
- [ ] Создать ProfileHeroHistoryRepository
- [ ] Реализовать методы CRUD

### Этап 3: Сервисы

- [ ] Обновить ProfileService для сохранения истории
- [ ] Реализовать методы получения истории
- [ ] Реализовать методы восстановления из истории
- [ ] Реализовать автоматическую очистку старых записей

### Этап 4: API Endpoints

- [ ] Создать endpoints для получения истории аватаров
- [ ] Создать endpoints для получения истории hero
- [ ] Создать endpoints для восстановления из истории
- [ ] Создать endpoints для удаления из истории

### Этап 5: Тестирование

- [ ] Протестировать сохранение истории
- [ ] Протестировать восстановление из истории
- [ ] Протестировать очистку старых записей

## Файлы для работы

- `apps/api/prisma/schema.prisma` - обновить схему
- Создать `apps/api/src/modules/profile/repositories/avatar-history.repository.ts`
- Создать `apps/api/src/modules/profile/repositories/hero-history.repository.ts`
- Обновить `apps/api/src/modules/profile/services/profile.service.ts`
- Обновить `apps/api/src/modules/profile/controllers/profile.controller.ts`
- Создать DTOs для истории

## Связанные задачи

- [Frontend задача по редактированию профиля](../../frontend/tasks/edit-profile.md) - связанная frontend задача
