# Архитектура Backend

## Обзор

Проект использует **модульную архитектуру NestJS**, где каждый модуль представляет отдельную бизнес-область.

## Структура проекта

```
src/
├── core/              # Ядро приложения
│   ├── config/        # Конфигурации (CORS, Swagger, Mail, Logs)
│   ├── cookie/        # Работа с cookies
│   ├── decorators/    # Кастомные декораторы
│   ├── dto/           # Общие DTO
│   ├── filters/       # Exception filters
│   ├── guards/        # Guards (AccessTokenGuard)
│   ├── interceptors/  # Interceptors (AuthCookie, Response, Metrics)
│   ├── prisma/        # Prisma сервис
│   ├── queue/         # Очереди Bull
│   ├── redis/         # Redis сервис
│   └── s3/            # AWS S3 сервис
├── modules/           # Бизнес-модули
│   ├── auth/          # Аутентификация
│   ├── user/          # Пользователи
│   ├── post/          # Посты
│   ├── chats/         # Чаты
│   ├── messages/      # Сообщения
│   ├── calls/         # Звонки
│   ├── followers/     # Подписки
│   ├── notifications/ # Уведомления
│   ├── profile/       # Профили
│   ├── token/         # Токены
│   ├── mail/          # Email
│   └── telegram/      # Telegram интеграция
└── main.ts            # Точка входа
```

## Модульная архитектура

### Принципы

1. **Один модуль = одна бизнес-область**
2. **Модули независимы** друг от друга (кроме зависимостей)
3. **Ядро (core)** содержит общую функциональность
4. **Модули (modules)** содержат бизнес-логику

### Структура модуля

```
modules/example/
├── example.module.ts      # Модуль NestJS
├── controllers/          # REST контроллеры
│   └── example.controller.ts
├── services/             # Бизнес-логика
│   └── example.service.ts
├── repositories/         # Работа с БД (опционально)
│   └── example.repository.ts
├── dto/                  # Data Transfer Objects
│   └── example.dto.ts
├── socket/               # WebSocket gateways (опционально)
│   └── example.gateway.ts
└── index.ts              # Public API модуля
```

## Core - Ядро приложения

### Назначение

Core содержит общую функциональность, используемую во всех модулях:
- Guards, Interceptors, Filters
- Декораторы
- Конфигурации
- Сервисы (Prisma, Redis, S3)

### Глобальные модули

Некоторые модули помечены как `@Global()`:

```typescript
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
```

Глобальные модули доступны во всех модулях без импорта.

## Modules - Бизнес-модули

### Принципы организации

1. **Контроллеры** - обработка HTTP запросов
2. **Сервисы** - бизнес-логика
3. **Репозитории** - работа с БД (опционально)
4. **DTO** - валидация и типизация данных
5. **Gateways** - WebSocket обработка (опционально)

### Пример модуля

```typescript
@Module({
    imports: [
        PrismaModule,      // Глобальный, но можно явно импортировать
        TokenModule,       // Зависимость
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
    ],
    exports: [UserService], // Экспорт для использования в других модулях
})
export class UserModule {}
```

## Dependency Injection (DI)

### Как работает

NestJS автоматически внедряет зависимости через конструктор:

```typescript
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,      // DI
        private readonly tokenService: TokenService, // DI
    ) {}
}
```

### Правила

1. **Провайдеры должны быть зарегистрированы** в модуле
2. **Для использования в других модулях** - экспортируйте через `exports`
3. **Импортируйте модуль** для использования его экспортов

## Регистрация модулей

### AppModule

Все модули регистрируются в `app.module.ts`:

```typescript
@Module({
    imports: [
        ConfigModule.forRoot(),
        PrismaModule,
        RedisModule,
        QueueModule,
        AuthModule,
        UserModule,
        PostModule,
        // ...
    ],
})
export class AppModule {}
```

## Паттерны проектирования

### Repository Pattern

Используется для абстракции работы с БД:

```typescript
// Интерфейс
export interface UserRepository {
    findById(id: string): Promise<User | null>;
}

// Реализация
@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
}
```

### Service Layer

Сервисы содержат бизнес-логику:

```typescript
@Injectable()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
    ) {}

    async getUser(id: string) {
        // Бизнес-логика
        return await this.repository.findById(id);
    }
}
```

## Best Practices

1. **Разделяйте ответственность**: контроллеры - HTTP, сервисы - логика
2. **Используйте Repository** для работы с БД
3. **Типизируйте все** через TypeScript и Prisma
4. **Валидируйте данные** через DTO
5. **Экспортируйте только необходимое** через `exports`
6. **Документируйте API** через Swagger декораторы

## Ссылки

- [NestJS Modules](https://docs.nestjs.com/modules)
- [NestJS Dependency Injection](https://docs.nestjs.com/providers)
