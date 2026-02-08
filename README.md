# Sociopath Network

Монорепозиторий для социальной сети Sociopath Network с разделением на backend (NestJS) и frontend (Next.js).

## 📋 Описание проекта

Sociopath Network - это социальная сеть с полным функционалом:
- **Аутентификация** - регистрация, вход, подтверждение email
- **Социальная сеть** - посты, лайки, репосты, подписки
- **Мессенджер** - чаты, сообщения, real-time обновления
- **Звонки** - видеозвонки и аудиозвонки через LiveKit
- **Профили** - управление профилями пользователей
- **Уведомления** - real-time уведомления о событиях

## 🏗️ Что такое монорепозиторий?

Монорепозиторий (monorepo) - это подход к организации кода, при котором несколько связанных проектов хранятся в одном репозитории.

### Преимущества монорепо:

1. **Общие зависимости** - переиспользование кода между проектами
2. **Единая версия** - синхронизация версий зависимостей
3. **Упрощенный рефакторинг** - изменения в общих пакетах применяются везде
4. **Единая сборка** - Turbo оптимизирует сборку, пересобирая только измененные части
5. **Общие инструменты** - единые настройки линтера, форматтера, TypeScript

### Структура монорепо

Проект организован как монорепозиторий с использованием **pnpm workspaces** и **Turbo**:

```
auth-mono/
├── apps/              # Приложения
│   ├── api/          # Backend на NestJS
│   └── front/        # Frontend на Next.js/React
├── packages/          # Общие пакеты
│   ├── ui/           # Общие UI компоненты (shadcn/ui)
│   ├── nest-api/     # API клиент для frontend (генерируется через Orval)
│   ├── theme/        # Тема приложения
│   ├── ws/           # WebSocket клиент
│   ├── eslint-config/    # Конфигурация ESLint
│   └── typescript-config/ # Конфигурация TypeScript
├── docker/           # Dockerfile'ы для сборки
├── docker-compose.yml        # Production конфигурация
└── docker-compose-dev.yml    # Development конфигурация
```

### Как это работает?

1. **pnpm workspaces** - управляет зависимостями между пакетами
2. **Turbo** - ускоряет сборку, кэшируя результаты и пересобирая только измененные части
3. **Workspace packages** - пакеты из `packages/` могут использоваться в `apps/` через `workspace:*`

## 🔧 Технологический стек

### Backend
- **NestJS 11** - фреймворк для Node.js
- **Prisma** - ORM для работы с базой данных
- **MySQL 8.0** - база данных
- **Redis 7** - кэш и очереди
- **Socket.IO** - WebSocket для real-time функций
- **LiveKit** - видеозвонки и аудиозвонки
- **Bull** - очереди задач
- **AWS S3** - хранение файлов

### Frontend
- **Next.js 15** - React фреймворк
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **shadcn/ui** - компоненты UI
- **Redux Toolkit** - управление состоянием
- **TanStack Query** - работа с API
- **LiveKit** - видеозвонки
- **Socket.IO Client** - WebSocket соединения
- **Framer Motion** - анимации

### Инфраструктура
- **Docker** & **Docker Compose** - контейнеризация
- **pnpm** - менеджер пакетов
- **Turbo** - сборка монорепозитория

## 🚀 Запуск проекта

### Разработка (Development)

Для запуска в режиме разработки с использованием локальных сервисов (MySQL и Redis):

#### 1. Запуск базы данных и Redis

```bash
# Запуск MySQL и Redis в Docker
docker-compose -f docker-compose-dev.yml up -d --build
```

Это запустит:
- **MySQL 8.0** на порту `3310` (локально доступен на `127.0.0.1:3310`)
- **Redis 7** на порту `6334` (локально доступен на `127.0.0.1:6334`)

**Docker Compose файл**: `docker-compose-dev.yml`

Сервисы:
- `db-auth-monorepo` - MySQL контейнер
- `redis-auth-monorepo` - Redis контейнер
- Все сервисы находятся в Docker сети `app-network`

#### 2. Настройка переменных окружения

**Backend** (`apps/api/.env`):
```env
DATABASE_URL="mysql://root:cf@localhost:3310/auth-monorepo"
REDIS_HOST=localhost
REDIS_PORT=6334
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

**Frontend** (`apps/front/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_LIVEKIT_URL=https://ws.sociopath-network.ru
```

#### 3. Применение миграций базы данных

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

#### 4. Установка зависимостей и запуск

```bash
# Установка всех зависимостей для всего монорепозитория
pnpm install

# Запуск backend и frontend в режиме разработки
pnpm dev
```

После запуска:
- **Backend** будет доступен на `http://localhost:3000`
- **Frontend** будет доступен на `http://localhost:3003`
- **Swagger документация**: `http://localhost:3000/docs/api`

### Production

Для запуска в production режиме со всеми сервисами в Docker:

```bash
docker-compose -f docker-compose.yml up -d --build
```

Это запустит:
- **Frontend** на порту, указанном в переменной окружения `PORT_FRONT`
- **Backend API** на порту `3000`
- **MySQL** на порту `3310`
- **Redis** на порту `6334`

## 🗄️ База данных

### Подключение к БД

- **Host**: `localhost`
- **Port**: `3310`
- **Database**: `auth-monorepo`
- **User**: `root`
- **Password**: `cf`

### Миграции Prisma

```bash
# Применить миграции
cd apps/api
npx prisma migrate dev

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio (визуальный редактор БД)
npx prisma studio
```

## 🛠️ Доступные команды

```bash
# Запуск в режиме разработки (backend + frontend)
pnpm dev

# Сборка всех приложений
pnpm build

# Линтинг
pnpm lint

# Форматирование кода
pnpm format
```

## 🐳 Docker сервисы

### Development (docker-compose-dev.yml)

Используется для разработки - запускает только инфраструктурные сервисы:

- `db-auth-monorepo` - MySQL 8.0 (порт 3310)
- `redis-auth-monorepo` - Redis 7 (порт 6334)

Приложения (backend и frontend) запускаются локально через `pnpm dev`.

### Production (docker-compose.yml)

Используется для production - запускает все сервисы в Docker:

- `front-auth-monorepo` - Frontend приложение
- `api-auth-monorepo` - Backend API
- `db-auth-monorepo` - MySQL 8.0
- `redis-auth-monorepo` - Redis 7

## 🎨 Дизайн

Дизайн проекта доступен в Figma:
- [Figma Design](https://www.figma.com/design/JVmBUccs0lbn0PI0DOzH27/Sociopath.?node-id=41-4261)

## 📖 Документация

Подробная документация по проекту:

- **[Frontend документация](./documentation/frontend.md)** - описание frontend приложения, архитектура, модули, задачи
- **[Backend документация](./documentation/backend.md)** - описание backend API, архитектура, модули, инструкции

## 📖 Дополнительная информация

- Все сервисы находятся в одной Docker сети `app-network`
- Данные БД сохраняются в `apps/api/db_data/`
- Логи приложения сохраняются в `./logs/`
- API документация (Swagger): [https://api.sociopath-network.ru/docs/api](https://api.sociopath-network.ru/docs/api)
