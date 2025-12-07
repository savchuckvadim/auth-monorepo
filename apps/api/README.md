# Backend API - Auth Monorepo

Backend часть проекта на NestJS с системой аутентификации, использующей JWT токены и HttpOnly cookies.

## 🏗️ Архитектура

### Технологический стек

- **NestJS** - прогрессивный Node.js фреймворк
- **Prisma** - современный ORM для работы с базой данных
- **MySQL 8.0** - реляционная база данных
- **Redis** - кэширование и очереди
- **JWT** - токены для аутентификации
- **Cookie Parser** - работа с HttpOnly cookies

## 🔐 Система аутентификации

### Auth Guards

В проекте используется система guards для защиты маршрутов. Guards проверяют наличие и валидность JWT токенов перед доступом к защищённым эндпоинтам.

#### Принцип работы

1. **Guard проверяет токен** из cookie или заголовка `Authorization`
2. **Валидирует JWT токен** и извлекает данные пользователя
3. **Добавляет пользователя в request** (`request.user`)
4. **Разрешает или запрещает доступ** к эндпоинту

#### Использование

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  // Все эндпоинты этого контроллера защищены
}
```

#### Декоратор CurrentUser

Для получения текущего авторизованного пользователя используется декоратор `@CurrentUser()`:

```typescript
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';

@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  return user;
}

// Или получить конкретное поле
@Get('email')
@UseGuards(JwtAuthGuard)
getEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

Декоратор извлекает пользователя из `request.user`, который был установлен guard'ом.

### Auth Cookie Interceptor

`AuthCookieInterceptor` автоматически устанавливает access token в HttpOnly cookie после успешной аутентификации.

#### Принцип работы

1. Перехватывает ответ от контроллера
2. Если в ответе есть поле `token` → устанавливает его в HttpOnly cookie
3. Удаляет `token` из JSON ответа (для безопасности)

#### Использование

```typescript
import { SetAuthCookie } from '@/core/decorators/auth/set-auth-cookie.decorator';

@Post('login')
@SetAuthCookie()
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto);
  const token = await this.authService.generateToken(user);

  return {
    user,
    token, // будет установлен в cookie и удалён из JSON
  };
}
```

#### Настройка Cookie

Cookie настраивается через `CookieService`:

- **HttpOnly**: `true` - защита от XSS атак
- **Secure**: `true` - передача только по HTTPS
- **SameSite**: `'none'` (production) / `'lax'` (development) - для кросс-доменных запросов
- **Domain**: `.april-app.ru` (production) / `localhost` (development)
- **MaxAge**: 7 дней

## 🗄️ База данных

### Prisma ORM

Проект использует Prisma как ORM для работы с MySQL.

#### Схема базы данных

Основная модель - `User`:

```prisma
model User {
  id                        BigInt    @id @default(autoincrement())
  name                      String
  surname                   String
  email                     String?   @unique
  photo                     String?
  role_id                   BigInt
  email_verified_at         DateTime?
  password                  String
  two_factor_secret         String?
  two_factor_recovery_codes String?
  remember_token            String?
  created_at                DateTime? @default(now())
  updated_at                DateTime? @default(now())
}
```

#### Особенности

- **BigInt для ID**: Используется `BigInt` для идентификаторов (поддержка больших чисел)
- **Unsigned BigInt**: ID хранятся как беззнаковые числа
- **Timestamps**: Автоматическое управление `created_at` и `updated_at`
- **Email уникальность**: Email имеет уникальный индекс
- **Nullable поля**: Email, photo и другие поля могут быть `null`

#### Миграции

```bash
# Создать новую миграцию
npx prisma migrate dev --name migration_name

# Применить миграции
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate
```

#### Prisma Service

Доступ к базе данных осуществляется через `PrismaService`:

```typescript
import { PrismaService } from '@/core/prisma/prisma.service';

constructor(private prisma: PrismaService) {}

async findUser(id: bigint) {
  return this.prisma.user.findUnique({
    where: { id },
  });
}
```

### Подключение к БД

- **Host**: `localhost` (dev) / `db-auth-monorepo` (docker)
- **Port**: `3310` (dev) / `3306` (docker)
- **Database**: `auth-monorepo`
- **User**: `root`
- **Password**: `cf`

Connection string:
```
DATABASE_URL="mysql://root:cf@localhost:3310/auth-monorepo"
```

## 🛡️ Global Exception Filter

`GlobalExceptionFilter` - глобальный обработчик исключений, который перехватывает все ошибки в приложении.

### Функциональность

1. **Обработка всех исключений** - перехватывает любые ошибки в приложении
2. **Логирование ошибок** - записывает детальную информацию об ошибке
3. **Уведомления в Telegram** - отправляет уведомления о критических ошибках
4. **Унифицированный формат ответа** - все ошибки возвращаются в едином формате

### Обработка ошибок

#### Валидационные ошибки (400)

При ошибках валидации (BadRequestException) возвращается:

```json
{
  "resultCode": 1,
  "message": "Validation failed",
  "errors": ["email must be an email", "password should not be empty"]
}
```

#### Остальные ошибки

Для всех остальных ошибок возвращается:

```json
{
  "resultCode": 1,
  "message": "Error message"
}
```

### Информация в логах

Для каждой ошибки логируется:

- **Тип ошибки** (Error name)
- **Файл и строка** где произошла ошибка
- **Функция** в которой произошла ошибка
- **Stack trace** (код ошибки)
- **HTTP метод и URL**
- **User-Agent** клиента
- **IP адрес** клиента
- **Referer**

### Telegram уведомления

Все ошибки автоматически отправляются в Telegram через `TelegramService` с полной информацией для быстрой диагностики.

### Использование

Фильтр подключён глобально в `main.ts`:

```typescript
app.useGlobalFilters(app.get(GlobalExceptionFilter));
```

## 📤 Response Interceptor

`ResponseInterceptor` - глобальный interceptor, который оборачивает все успешные ответы в единый формат.

### Формат ответа

Все успешные ответы оборачиваются в структуру:

```typescript
interface ApiResponse<T> {
  resultCode: EResultCode; // 0 - успех, 1 - ошибка
  data?: T;                // данные ответа
  message?: string;        // сообщение (при ошибке)
}

enum EResultCode {
  SUCCESS = 0,
  ERROR = 1,
}
```

### Примеры

#### Успешный ответ

**Контроллер:**
```typescript
@Get('users')
getUsers() {
  return [{ id: 1, name: 'John' }];
}
```

**Ответ клиенту:**
```json
{
  "resultCode": 0,
  "data": [{ "id": 1, "name": "John" }]
}
```

#### Исключения

- **`/api/metrics`** - пропускается без обёртки (для Prometheus)
- **Ошибки** - обрабатываются `GlobalExceptionFilter`, не проходят через interceptor

### Использование

Interceptor подключён глобально в `main.ts`:

```typescript
app.useGlobalInterceptors(new ResponseInterceptor());
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корне `apps/api/`:

```env
# Database
DATABASE_URL="mysql://root:cf@localhost:3310/auth-monorepo"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6334

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Application
NODE_ENV=development
PORT=3000

# Telegram (для уведомлений об ошибках)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### Глобальные настройки

В `main.ts` настроены:

- **Global Prefix**: `/api` - все эндпоинты имеют префикс `/api`
- **CORS**: Настроен для кросс-доменных запросов
- **Validation Pipe**: Автоматическая валидация DTO
- **Cookie Parser**: Парсинг cookies из запросов
- **Swagger**: API документация (если настроена)

## 📁 Структура проекта

```
apps/api/
├── src/
│   ├── core/                    # Ядро приложения
│   │   ├── config/              # Конфигурации
│   │   ├── cookie/              # Работа с cookies
│   │   ├── decorators/          # Кастомные декораторы
│   │   │   └── auth/            # Декораторы аутентификации
│   │   ├── filters/             # Exception filters
│   │   │   └── global-exception.filter.ts
│   │   ├── interceptors/       # Interceptors
│   │   │   ├── response.interceptor.ts
│   │   │   └── auth-cookie.interceptor.ts
│   │   ├── interfaces/          # TypeScript интерфейсы
│   │   ├── prisma/              # Prisma сервис
│   │   └── redis/               # Redis сервис
│   ├── modules/                 # Модули приложения
│   │   ├── auth/                # Модуль аутентификации
│   │   ├── mail/                # Отправка email
│   │   ├── queue/               # Очереди задач
│   │   └── telegram/            # Telegram уведомления
│   ├── app.module.ts            # Главный модуль
│   └── main.ts                  # Точка входа
├── prisma/
│   └── schema.prisma            # Схема базы данных
└── package.json
```

## 🚀 Запуск

### Development

```bash
# Установка зависимостей
pnpm install

# Запуск БД и Redis через Docker
docker-compose -f ../../docker-compose-dev.yml up -d

# Применение миграций
npx prisma migrate dev

# Генерация Prisma Client
npx prisma generate

# Запуск в режиме разработки
pnpm dev
```

### Production

```bash
# Сборка
pnpm build

# Запуск
pnpm start:prod
```

## 📝 API Endpoints

### Аутентификация

- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/refresh` - Обновление токена
- `POST /api/auth/logout` - Выход из системы
- `GET /api/auth/me` - Получение текущего пользователя

### Health Check

- `GET /api/health` - Проверка здоровья приложения

## 🔍 Логирование

Приложение использует встроенный логгер NestJS с уровнями:
- `error` - Критические ошибки
- `warn` - Предупреждения
- `log` - Информационные сообщения
- `debug` - Отладочная информация
- `verbose` - Подробная информация

## 📚 Дополнительные ресурсы

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

