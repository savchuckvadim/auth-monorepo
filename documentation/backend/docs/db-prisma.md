# База данных и Prisma

## Обзор

Проект использует **Prisma** как ORM для работы с базой данных **MySQL 8.0**.

## Prisma

### Что это?

Prisma - это современный ORM (Object-Relational Mapping) для TypeScript и Node.js, который предоставляет:
- Типобезопасный доступ к БД
- Автоматическую генерацию типов
- Миграции
- Prisma Studio для визуального управления данными

### Расположение

```
apps/api/
├── prisma/
│   ├── schema.prisma        # Схема базы данных
│   └── migrations/          # Миграции
└── generated/
    └── prisma/              # Сгенерированный Prisma Client
```

### Schema

**Файл**: `prisma/schema.prisma`

Схема определяет структуру базы данных:

```prisma
datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
}

generator client {
    provider      = "prisma-client-js"
    output        = "../generated/prisma"
    binaryTargets = ["native", "debian-openssl-1.1.x", "debian-openssl-3.0.x"]
}

model User {
    id             String     @id @default(uuid())
    name           String     @db.VarChar(255)
    email          String     @unique @db.VarChar(255)
    isAcivated     Boolean    @default(false)
    activationLink String     @unique @db.VarChar(255)
    role           user_roles
    password       String
    createdAt      DateTime?  @default(now())
    updatedAt      DateTime?  @default(now())

    // Relations
    tokens         Token[]
    posts          Post[]
    // ...

    @@map("users")
}
```

### Основные сущности

- **User** - пользователи
- **Token** - токены аутентификации
- **Chat** - чаты
- **Message** - сообщения
- **Post** - посты
- **Follow** - подписки
- **Profile** - профили
- **Call** - звонки
- **Notification** - уведомления

Подробнее см. [Документацию по модулям](./modules.md).

## PrismaService

**Расположение**: `core/prisma/prisma.service.ts`

Глобальный сервис для работы с Prisma Client:

```typescript
@Global()
@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
```

### Использование

```typescript
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getUser(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }
}
```

## Типизация сущностей

### Автоматическая генерация типов

Prisma автоматически генерирует TypeScript типы из schema:

```typescript
import { User, Post, Chat } from 'generated/prisma';

// User имеет все поля из schema
const user: User = {
    id: '...',
    email: '...',
    name: '...',
    // ...
};
```

### Использование в DTO

```typescript
import { User } from 'generated/prisma';

export class UserDto implements Partial<User> {
    id: string;
    email: string;
    name: string;
    // ...
}
```

## Миграции

### Создание миграции

```bash
cd apps/api
npx prisma migrate dev --name add_new_field
```

### Применение миграций

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Генерация Prisma Client

```bash
npx prisma generate
```

### Prisma Studio

Визуальный редактор базы данных:

```bash
npx prisma studio
```

Открывается на `http://localhost:5555`

## Подключение к БД

### Переменные окружения

```env
DATABASE_URL="mysql://root:cf@localhost:3310/auth-monorepo"
```

### Формат URL

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Docker Compose

В development используется Docker Compose:

```yaml
db-auth-monorepo:
    image: mysql:8.0
    environment:
        MYSQL_ROOT_PASSWORD: cf
        MYSQL_DATABASE: auth-monorepo
    ports:
        - "3310:3306"
```

## Репозитории

### Паттерн Repository

Многие модули используют паттерн Repository для абстракции работы с БД:

```typescript
// Интерфейс
export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}

// Реализация через Prisma
@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
}
```

## Best Practices

1. **Всегда используйте типы Prisma**: `User`, `Post` и т.д.
2. **Используйте Repository паттерн** для абстракции
3. **Валидируйте данные** через DTO перед сохранением
4. **Используйте транзакции** для сложных операций
5. **Индексируйте часто запрашиваемые поля**

## Ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
