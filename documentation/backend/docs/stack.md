# Технологический стек Backend

## Основные технологии

### NestJS

**Версия**: 11.x

**Описание**: Основной фреймворк для построения backend приложения. NestJS предоставляет модульную архитектуру, встроенную поддержку TypeScript, декораторы и множество встроенных возможностей.

**Ключевые возможности**:
- Модульная архитектура
- Dependency Injection (DI)
- Декораторы для метаданных
- Guards для авторизации
- Interceptors для обработки запросов/ответов
- Pipes для валидации и трансформации данных

**Официальная документация**: https://docs.nestjs.com/

---

## Dependency Injection (DI)

### Что это?

Dependency Injection (DI) - это паттерн проектирования, при котором зависимости (сервисы, репозитории и т.д.) внедряются в классы извне, а не создаются внутри них.

### Как работает в NestJS?

NestJS использует встроенную систему DI на основе декораторов:

```typescript
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
    ) {}
}
```

### Преимущества

1. **Тестируемость**: Легко подменять зависимости в тестах
2. **Модульность**: Компоненты слабо связаны
3. **Переиспользование**: Сервисы можно использовать в разных местах
4. **Управление жизненным циклом**: NestJS управляет созданием и уничтожением экземпляров

### Пример использования

```typescript
// 1. Создаем сервис с @Injectable()
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService, // DI
        private readonly tokenService: TokenService, // DI
    ) {}
}

// 2. Регистрируем в модуле
@Module({
    providers: [AuthService, UserService, TokenService],
    exports: [AuthService],
})
export class AuthModule {}

// 3. Используем в контроллере
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService, // DI
    ) {}
}
```

---

## Bull - Очереди задач

**Версия**: 4.x

**Описание**: Bull - это библиотека для создания и управления очередями задач на основе Redis. Используется для фоновых задач, таких как отправка email, обработка файлов и т.д.

### Зачем нужен?

- **Асинхронная обработка**: Тяжелые задачи выполняются в фоне
- **Масштабируемость**: Можно запускать несколько воркеров
- **Надежность**: Задачи сохраняются в Redis, не теряются при перезапуске
- **Повторные попытки**: Автоматический retry при ошибках
- **Приоритеты**: Можно задавать приоритеты задач

### Как используется в проекте?

```typescript
// Регистрация очереди
@Module({
    imports: [
        BullModule.registerQueue({
            name: QueueNames.MAIL, // Название очереди
        }),
    ],
})
export class MailModule {}

// Добавление задачи в очередь
@Injectable()
export class MailService {
    constructor(
        @InjectQueue(QueueNames.MAIL) private mailQueue: Queue,
    ) {}

    async sendEmail(data: EmailData) {
        await this.mailQueue.add('activation-link', data, {
            attempts: 3, // Количество попыток
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
    }
}

// Обработка задачи
@Processor(QueueNames.MAIL)
export class MailProcessor {
    @Process('activation-link')
    async handleActivationLink(job: Job<EmailData>) {
        const { email, name, activationLink } = job.data;
        // Отправка email
    }
}
```

### Доступные очереди

- `MAIL` - отправка email
- Другие очереди можно добавить в `QueueNames` enum

---

## Другие технологии

### TypeScript

**Версия**: 5.7.3

Используется для типизации всего кода, что обеспечивает:
- Безопасность типов
- Автодополнение в IDE
- Раннее обнаружение ошибок

### Prisma

**Версия**: 6.x

ORM для работы с базой данных MySQL. Подробнее см. [Документацию по DB и Prisma](./db-prisma.md).

### Redis

**Версия**: 7.x

Используется для:
- Кэширования данных
- Очередей Bull
- Хранения сессий

Подробнее см. [Документацию по Redis](./redis.md).

### JWT

**Версия**: 9.x

Используется для создания и валидации токенов аутентификации.

### Socket.IO

**Версия**: 4.x

Используется для real-time коммуникации (чаты, уведомления, звонки).

### Swagger

**Версия**: 11.x

Используется для автоматической генерации API документации. Подробнее см. [Документацию по Swagger](./swagger.md).

---

## Структура зависимостей

```
NestJS (Core)
├── Prisma (ORM)
├── Redis (Cache & Queues)
│   └── Bull (Task Queue)
├── JWT (Authentication)
├── Socket.IO (WebSocket)
└── Swagger (Documentation)
```

---

## Полезные ссылки

- [NestJS Documentation](https://docs.nestjs.com/)
- [Bull Documentation](https://github.com/OptimalBits/bull)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Documentation](https://redis.io/docs/)
