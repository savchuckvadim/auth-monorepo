# DTO (Data Transfer Objects)

## Обзор

DTO (Data Transfer Objects) используются для:
- **Валидации** входящих данных
- **Типизации** запросов и ответов
- **Документации API** через Swagger
- **Трансформации** данных

## Расположение

DTO обычно находятся в папке `dto/` или `dtos/` каждого модуля:

```
modules/user/
├── dto/
│   └── user.dto.ts
modules/auth/
├── dtos/
│   └── login.dto.ts
```

## Структура DTO

### Пример: CreateUserDto

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsPassword } from '@/core/decorators/dto/password.decorator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Email',
        example: 'test@test.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password',
        example: 'test123456!'
    })
    @IsPassword()
    password: string;

    @ApiProperty({
        description: 'Name',
        example: 'Test User'
    })
    @IsString()
    name: string;
}
```

## Валидация

### Встроенные валидаторы

```typescript
import {
    IsEmail,
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    Min,
    Max,
    Length
} from 'class-validator';

export class CreatePostDto {
    @IsString()
    @Length(1, 500)
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    priority: number;
}
```

### Кастомные валидаторы

```typescript
import { IsPassword } from '@/core/decorators/dto/password.decorator';

export class CreateUserDto {
    @IsPassword() // Кастомный валидатор
    password: string;
}
```

## Трансформация данных

### class-transformer

```typescript
import { Transform } from 'class-transformer';

export class CreatePostDto {
    @Transform(({ value }) => value?.trim())
    @IsString()
    content: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number;
}
```

## Документация Swagger

### @ApiProperty()

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'User email',
        example: 'user@example.com'
    })
    email: string;

    @ApiProperty({
        description: 'User name',
        example: 'John Doe'
    })
    name: string;
}
```

### Вложенные DTO

```typescript
export class AuthenticatedUserDto {
    @ApiProperty({
        description: 'User',
        type: UserDto
    })
    user: UserDto;

    @ApiProperty({
        description: 'Tokens',
        type: TokensDto
    })
    tokens: TokensDto;
}
```

## Использование в контроллерах

### Валидация запроса

```typescript
@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
    // createUserDto автоматически валидируется
    // Если валидация не прошла - выбрасывается BadRequestException
    return await this.service.createUser(createUserDto);
}
```

### Глобальная валидация

В `main.ts` настроена глобальная валидация:

```typescript
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Удаляет поля, не описанные в DTO
        forbidNonWhitelisted: false,
        forbidUnknownValues: true,
        transform: true, // Автоматическая трансформация типов
    }),
);
```

## Типизация с Prisma

### Использование типов Prisma

```typescript
import { User } from 'generated/prisma';

export class UserDto implements Partial<User> {
    id: string;
    email: string;
    name: string;
    // ...
}
```

## Best Practices

1. **Всегда используйте DTO** для входящих данных
2. **Добавляйте @ApiProperty()** для Swagger документации
3. **Валидируйте данные** через class-validator
4. **Типизируйте** через TypeScript и Prisma типы
5. **Используйте примеры** в @ApiProperty()
6. **Разделяйте DTO** для создания и обновления (CreateDto, UpdateDto)

## Примеры DTO в проекте

- `CreateUserDto` - создание пользователя
- `LoginDto` - вход в систему
- `UserDto` - данные пользователя
- `CreatePostDto` - создание поста
- `PostDto` - данные поста
- `CreateChatDto` - создание чата
- `MessageDto` - данные сообщения

## Ссылки

- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
