# Swagger - API Документация

## Обзор

Проект использует **Swagger/OpenAPI** для автоматической генерации API документации.

## Настройка

**Расположение**: `core/config/swagger/swagger.config.ts`

```typescript
export const getSwaggerConfig = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Auth backend')
        .setDescription('API for auth backend for monorepo')
        .setVersion('1.0')
        .addTag('auth-monorepo')
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => {
            const cleanController = controllerKey.replace(/Controller$/i, '');
            return `${cleanController}_${methodKey}`;
        },
    };

    const documentFactory = () =>
        SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('docs/api', app, documentFactory);
};
```

### Доступ

После запуска сервера документация доступна по адресу:
- **Swagger UI**: `http://localhost:3000/docs/api`
- **Production**: `https://api.sociopath-network.ru/docs/api`

### JSON Schema

OpenAPI JSON схема доступна по адресу:
- `http://localhost:3000/docs/api-json`

Этот endpoint используется Orval для кодогенерации.

## Использование в контроллерах

### Декораторы Swagger

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('User') // Группировка в Swagger UI
@Controller('user')
export class UserController {
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users list', type: [UserDto] })
    @Get()
    async getAllUsers() {}

    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({ name: 'id', description: 'User id', example: '1' })
    @ApiResponse({ status: 200, description: 'User', type: UserDto })
    @Get(':id')
    async getUser(@Param('id') id: string) {}
}
```

### Основные декораторы

- `@ApiTags('TagName')` - группировка эндпоинтов
- `@ApiOperation({ summary: '...' })` - описание операции
- `@ApiResponse({ status: 200, type: UserDto })` - описание ответа
- `@ApiBody({ type: CreateUserDto })` - описание тела запроса
- `@ApiParam({ name: 'id' })` - описание параметра пути
- `@ApiQuery({ name: 'page' })` - описание query параметра

## Использование в DTO

### @ApiProperty()

```typescript
import { ApiProperty } from '@nestjs/swagger';

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
}
```

## Как Orval использует Swagger

### Процесс кодогенерации

1. **Backend генерирует OpenAPI схему** через Swagger
2. **Orval читает схему** по адресу `http://localhost:3000/docs/api-json`
3. **Orval генерирует TypeScript код** с типами и функциями
4. **Генерируемый код** попадает в `packages/nest-api/src/generated/`

### Конфигурация Orval

**Файл**: `packages/nest-api/orval.config.ts`

```typescript
export default {
    api: {
        input: 'http://localhost:3000/docs/api-json', // OpenAPI JSON
        output: {
            target: 'src/generated/api.ts',
            client: 'axios',
            mode: 'tags-split', // Разделение по тегам
            schemas: 'src/generated/model', // Типы
        },
    },
};
```

### Запуск генерации

```bash
cd packages/nest-api
pnpm generate
```

### Что генерируется?

- **API функции** для каждого endpoint
- **TypeScript типы** для всех DTO
- **Типы результатов** для каждой функции

Подробнее см. [Frontend документацию по монорепо и API](../../frontend/docs/monorepo-api.md).

## Best Practices

1. **Всегда добавляйте @ApiProperty()** к полям DTO
2. **Используйте @ApiTags()** для группировки
3. **Добавляйте примеры** в @ApiProperty()
4. **Описывайте все возможные ответы** через @ApiResponse()
5. **Обновляйте документацию** после изменений API

## Ссылки

- [Swagger UI](https://api.sociopath-network.ru/docs/api)
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
