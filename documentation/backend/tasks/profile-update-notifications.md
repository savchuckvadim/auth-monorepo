# Уведомления подписчиков об изменениях профиля

## Назначение

Реализовать функционал уведомления подписчиков об изменениях профиля. При изменении профиля (если включен чекбокс "Уведомлять подписчиков") создается пост на стене автора с информацией об изменениях.

## Требования

### Функционал

1. **Чекбокс "Уведомлять подписчиков"**:
   - Boolean поле в форме редактирования профиля
   - Сохраняется в профиле (опционально, или только для текущего обновления)

2. **Создание поста при изменении**:
   - При изменении профиля (если чекбокс включен) создается пост
   - Пост создается на стене автора (userId = authorId)
   - Пост содержит информацию об изменениях

3. **Типы изменений**:
   - Изменение аватара
   - Изменение hero изображения
   - Изменение "About me"
   - Комбинация изменений

## База данных

### Обновление модели Profile

**Опциональное поле** (если нужно сохранять настройку):

```prisma
model Profile {
    // ... существующие поля
    notifyFollowersOnUpdate Boolean @default(false) @map("notify_followers_on_update")
}
```

**Примечание**: Можно не сохранять в БД, а передавать только при обновлении профиля.

## API Endpoints

### Обновление UpdateProfileDto

**Добавить поле**:

```typescript
export class UpdateProfileDto {
    // ... существующие поля

    @ApiProperty({
        description: 'Notify followers about profile update',
        example: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    notifyFollowers?: boolean;
}
```

## Реализация

### ProfileService

**Обновление метода updateProfile**:

```typescript
public async updateProfile(
    userId: string,
    data: UpdateProfileDto
): Promise<ProfileDto> {
    const oldProfile = await this.repo.findByUserId(userId);
    const updatedProfile = await this.repo.update(userId, data);

    // Если нужно уведомить подписчиков, создаем пост
    if (data.notifyFollowers) {
        await this.createProfileUpdatePost(userId, oldProfile, updatedProfile, data);
    }

    return new ProfileDto(updatedProfile);
}
```

**Метод создания поста**:

```typescript
private async createProfileUpdatePost(
    userId: string,
    oldProfile: Profile,
    newProfile: Profile,
    changes: UpdateProfileDto
): Promise<void> {
    const changesList: string[] = [];

    // Определяем, что изменилось
    if (changes.avatar && oldProfile.avatar !== newProfile.avatar) {
        changesList.push('аватар');
    }

    if (changes.hero && oldProfile.hero !== newProfile.hero) {
        changesList.push('обложку профиля');
    }

    if (changes.about && oldProfile.about !== newProfile.about) {
        changesList.push('информацию о себе');
    }

    // Если есть изменения, создаем пост
    if (changesList.length > 0) {
        const changeText = this.formatChangesText(changesList);
        const postText = `Обновил(а) ${changeText}`;

        // Создаем пост на стене пользователя
        await this.postService.createPost(userId, {
            userId: userId, // Пост на своей стене
            authorId: userId, // Автор - сам пользователь
            text: postText,
            // Можно добавить изображение нового аватара/hero
            image: changes.avatar ? newProfile.avatar :
                   changes.hero ? newProfile.hero : undefined
        });
    }
}
```

**Форматирование текста изменений**:

```typescript
private formatChangesText(changes: string[]): string {
    if (changes.length === 0) return '';
    if (changes.length === 1) return changes[0];
    if (changes.length === 2) return `${changes[0]} и ${changes[1]}`;

    // Для 3+ изменений: "аватар, обложку профиля и информацию о себе"
    const last = changes.pop();
    return `${changes.join(', ')} и ${last}`;
}
```

### Интеграция с PostService

**Использование существующего PostService**:

```typescript
constructor(
    private readonly repo: ProfileRepository,
    private readonly postService: PostService, // Инжектим PostService
) { }
```

**Создание поста**:

```typescript
await this.postService.createPost(userId, {
    userId: userId,
    authorId: userId,
    text: postText,
    image: imageUrl // Опционально: новый аватар или hero
});
```

## Примеры постов

### Изменение аватара:
```
Обновил(а) аватар
```
+ изображение нового аватара

### Изменение hero:
```
Обновил(а) обложку профиля
```
+ изображение нового hero

### Изменение "About me":
```
Обновил(а) информацию о себе
```

### Комбинация изменений:
```
Обновил(а) аватар и обложку профиля
```
+ изображение (аватар или hero)

## Задачи

### Этап 1: Обновление DTO

- [ ] Добавить поле `notifyFollowers` в `UpdateProfileDto`
- [ ] Обновить валидацию

### Этап 2: Реализация создания поста

- [ ] Создать метод `createProfileUpdatePost` в ProfileService
- [ ] Реализовать определение изменений
- [ ] Реализовать форматирование текста поста
- [ ] Интегрировать с PostService

### Этап 3: Интеграция

- [ ] Обновить метод `updateProfile` для проверки `notifyFollowers`
- [ ] Протестировать создание поста при различных изменениях

### Этап 4: Опционально - сохранение настройки

- [ ] Добавить поле `notifyFollowersOnUpdate` в модель Profile (если нужно)
- [ ] Обновить DTO для сохранения настройки

## Файлы для работы

- `apps/api/src/modules/profile/dto/profile.dto.ts` - обновить `UpdateProfileDto`
- `apps/api/src/modules/profile/services/profile.service.ts` - добавить метод создания поста
- `apps/api/src/modules/profile/profile.module.ts` - добавить PostModule в imports (если нужно)

## Связанные задачи

- [Frontend задача по редактированию профиля](../../frontend/tasks/edit-profile.md) - связанная frontend задача
- [Backend задача по истории аватаров](./profile-avatar-history.md) - интеграция с историей
