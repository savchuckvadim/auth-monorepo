# Backend - Sociopath Network

## Описание

Backend API для социальной сети Sociopath Network, построенный на NestJS 11. Предоставляет REST API и WebSocket соединения для всех функций социальной сети, включая аутентификацию, чаты, посты, звонки и уведомления.

## Документация

### Основные разделы

1. **[Стек технологий](./backend/docs/stack.md)** - NestJS, DI, Bull, и другие технологии
2. **[Аутентификация](./backend/docs/auth.md)** - как работает auth, guards, decorators, cookies, refresh token, email confirm
3. **[База данных и Prisma](./backend/docs/db-prisma.md)** - работа с БД, типизация, миграции
4. **[Redis](./backend/docs/redis.md)** - кэширование и использование Redis
5. **[Очереди](./backend/docs/queues.md)** - работа с Bull для фоновых задач
6. **[Архитектура](./backend/docs/architecture.md)** - модульная архитектура проекта
7. **[Decorators](./backend/docs/decorators.md)** - все декораторы проекта
8. **[DTO](./backend/docs/dto.md)** - как работают Data Transfer Objects
9. **[Swagger](./backend/docs/swagger.md)** - API документация и интеграция с Orval
10. **[Модули](./backend/docs/modules.md)** - описание всех модулей (user, post, chat, message и т.д.)
11. **[Добавление модуля](./backend/docs/adding-module.md)** - инструкция по созданию нового модуля
12. **[Signal E2EE и mobile push](./backend/docs/encryption/signal-e2ee-and-mobile-push.md)** - ключи Signal, ciphertext в сообщениях, FCM / APNS / VoIP для «спящих» клиентов
13. **[Звонки и mobile push (статус интеграции)](./backend/docs/calls-push-integration.md)** - чеклист сделано/осталось, env, ссылки на API

## Технологический стек

- **NestJS 11** - Node.js фреймворк
- **TypeScript** - типизация
- **Prisma** - ORM для работы с базой данных
- **MySQL 8.0** - основная база данных
- **Redis 7** - кэширование и очереди
- **Socket.IO** - WebSocket для real-time функций
- **LiveKit** - сервер для видеозвонков
- **Bull** - очереди задач
- **JWT** - аутентификация
- **AWS S3** - хранение файлов
- **Swagger** - документация API
- **firebase-admin** - отправка push через FCM (модуль notifications)
- **apn** - Apple Push Notification (обычные и VoIP-токены)

Подробнее см. [Документацию по стеку](./backend/docs/stack.md).

## Архитектура

Проект использует модульную архитектуру NestJS. Подробнее см. [Документацию по архитектуре](./backend/docs/architecture.md).

```
src/
├── core/           # Ядро приложения (guards, interceptors, decorators, config)
├── modules/        # Бизнес-модули
│   ├── auth/       # Аутентификация
│   ├── user/       # Пользователи
│   ├── post/       # Посты
│   ├── chats/      # Чаты
│   ├── messages/   # Сообщения
│   ├── calls/      # Звонки (LiveKit)
│   └── ...
└── main.ts         # Точка входа
```

## API Документация

- **Swagger UI**: [https://api.sociopath-network.ru/docs/api](https://api.sociopath-network.ru/docs/api)
- **Development**: [http://localhost:3000/docs/api](http://localhost:3000/docs/api)

## Быстрый старт

### Установка зависимостей

```bash
cd apps/api
pnpm install
```

### Настройка переменных окружения

Создайте файл `.env` в `apps/api/`:

```env
DATABASE_URL="mysql://root:cf@localhost:3310/auth-monorepo"
REDIS_HOST=localhost
REDIS_PORT=6334
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

### Запуск базы данных

```bash
docker-compose -f docker-compose-dev.yml up -d
```

### Применение миграций

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

### Запуск сервера

```bash
pnpm dev
```

Сервер будет доступен на `http://localhost:3000`

## Ссылки

- [Frontend документация](./frontend.md)
- [Swagger API](https://api.sociopath-network.ru/docs/api)
- [Задачи](./backend/tasks/tasks.md) - список задач для выполнения
- [Звонки и mobile push (чеклист)](./backend/docs/calls-push-integration.md)
