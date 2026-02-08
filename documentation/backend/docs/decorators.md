# Decorators (Декораторы)

## Обзор

В проекте используются кастомные декораторы для различных целей: аутентификация, валидация, документация API.

## Расположение

```
src/core/decorators/
├── api/
│   └── api-response.documentation.decorator.ts
├── auth/
│   ├── current-user.decorator.ts
│   └── set-auth-cookie.decorator.ts
└── dto/
    ├── password.decorator.ts
    ├── number-or-string.decorator.ts
    └── object-or-string.decorator.ts
```

## Декораторы аутентификации

### @CurrentUser()

**Расположение**: `core/decorators/auth/current-user.decorator.ts`

**Назначение**: Получает текущего авторизованного пользователя из request.

**Использование**:
```typescript
@Get()
async getProfile(@CurrentUser() user: TokenPayloadDto) {
    // user = { userId: '...' }
    return await this.service.getProfile(user.userId);
}

// Получить конкретное поле
@Get()
async getProfile(@CurrentUser('userId') userId: string) {
    return await this.service.getProfile(userId);
}
```

**Код**:
```typescript
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // Guard положил пользователя сюда
        return data ? user?.[data] : user;
    },
);
```

### @SetAuthCookie()

**Расположение**: `core/decorators/auth/set-auth-cookie.decorator.ts`

**Назначение**: Обертка над `AuthCookieInterceptor` для установки cookies с токенами.

**Использование**:
```typescript
@Post('login')
@SetAuthCookie() // Автоматически устанавливает cookies из response.tokens
async login(@Body() loginDto: LoginDto): Promise<AuthenticatedUserDto> {
    return await this.authService.login(loginDto);
}
```

**Код**:
```typescript
export function SetAuthCookie() {
    return applyDecorators(
        UseInterceptors(AuthCookieInterceptor),
    );
}
```

## Декораторы валидации DTO

### @IsPassword()

**Расположение**: `core/decorators/dto/password.decorator.ts`

**Назначение**: Валидация пароля (длина от 8 до 32 символов).

**Использование**:
```typescript
export class CreateUserDto {
    @IsPassword()
    password: string;
}
```

**Код**:
```typescript
export function IsPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string'
                        && value.length >= 8
                        && value.length <= 32;
                },
            },
        });
    };
}
```

### @IsNumberOrString()

**Расположение**: `core/decorators/dto/number-or-string.decorator.ts`

**Назначение**: Валидация значения как числа или строки.

### @IsObjectOrString()

**Расположение**: `core/decorators/dto/object-or-string.decorator.ts`

**Назначение**: Валидация значения как объекта или строки.

## Декораторы документации API

### @ApiResponseDocumentation()

**Расположение**: `core/decorators/api/api-response.documentation.decorator.ts`

**Назначение**: Упрощенное добавление документации ответа для Swagger.

## Встроенные декораторы NestJS

### Контроллеры

- `@Controller('path')` - определение контроллера
- `@Get()`, `@Post()`, `@Put()`, `@Delete()` - HTTP методы
- `@Param('id')` - параметры пути
- `@Query('page')` - query параметры
- `@Body()` - тело запроса
- `@Req()`, `@Res()` - request и response

### Guards

- `@UseGuards(AccessTokenGuard)` - защита эндпоинтов

### Interceptors

- `@UseInterceptors(AuthCookieInterceptor)` - использование interceptor

### Validation

- `@IsEmail()`, `@IsString()`, `@IsNumber()` - валидация полей
- `@IsOptional()` - опциональное поле
- `@Min()`, `@Max()` - ограничения значений

### Swagger

- `@ApiTags('TagName')` - группировка в Swagger
- `@ApiOperation({ summary: '...' })` - описание операции
- `@ApiResponse({ status: 200, type: UserDto })` - описание ответа
- `@ApiProperty({ description: '...' })` - описание поля DTO

## Создание кастомного декоратора

### Пример: @Roles()

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Использование
@Roles('admin', 'owner')
@Get()
async getAdminData() {}
```

### Пример: @Public()

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Использование
@Public()
@Get()
async getPublicData() {}
```

## Best Practices

1. **Используйте декораторы** для повторяющейся логики
2. **Типизируйте параметры** декораторов
3. **Документируйте** назначение декораторов
4. **Переиспользуйте** встроенные декораторы NestJS

## Ссылки

- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [class-validator Decorators](https://github.com/typestack/class-validator)
