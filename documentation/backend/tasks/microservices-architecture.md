# Микросервисная архитектура на основе Kafka

## Назначение

Применить микросервисную архитектуру на основе Apache Kafka, вынести аутентификацию в отдельный микросервис и организовать асинхронную коммуникацию между сервисами.

## Текущее состояние

**Текущая архитектура**: Монолитное приложение
- Все модули находятся в одном NestJS приложении (`apps/api`)
- Прямые вызовы между модулями
- Общая база данных (PostgreSQL)
- Общий Redis

**Модули в текущем приложении**:
- `AuthModule` - аутентификация и авторизация
- `UserModule` - управление пользователями
- `TokenModule` - управление токенами
- `ChatsModule` - чаты
- `MessagesModule` - сообщения
- `PostModule` - посты
- `ProfileModule` - профили
- `NotificationsModule` - уведомления
- `PresenceModule` - присутствие пользователей
- `CallsModule` - звонки
- `FollowersModule` - подписки

## Целевая архитектура

### Структура микросервисов

```
auth-mono/
├── apps/
│   ├── api/                    # Основной API Gateway (остается)
│   ├── auth-service/           # НОВЫЙ: Микросервис аутентификации
│   ├── user-service/           # БУДУЩИЙ: Микросервис пользователей
│   └── notification-service/   # БУДУЩИЙ: Микросервис уведомлений
├── packages/
│   ├── kafka-client/           # НОВЫЙ: Общий клиент для Kafka
│   └── common-types/           # НОВЫЙ: Общие типы для микросервисов
└── infrastructure/
    └── docker-compose.kafka.yml # Docker Compose для Kafka
```

### Коммуникация между сервисами

```
Frontend
   │
   ├─► API Gateway (apps/api)
   │      │
   │      ├─► Auth Service (apps/auth-service) ──┐
   │      │      │                                │
   │      │      └─► Kafka ───────────────────────┘
   │      │
   │      └─► User Service (apps/user-service) ──┐
   │             │                                │
   │             └─► Kafka ──────────────────────┘
   │
   └─► WebSocket (для real-time)
```

## Детальная реализация

### Этап 1: Подготовка инфраструктуры

#### 1.1. Установка Kafka

**Создать `infrastructure/docker-compose.kafka.yml`**:

```yaml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - kafka-network

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "9093:9093"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://kafka:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT_INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    networks:
      - kafka-network

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    depends_on:
      - kafka
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    networks:
      - kafka-network

networks:
  kafka-network:
    driver: bridge
```

**Запуск Kafka**:
```bash
cd infrastructure
docker-compose -f docker-compose.kafka.yml up -d
```

**Проверка**:
- Kafka UI: http://localhost:8080
- Kafka Broker: localhost:9092

#### 1.2. Создание общего Kafka клиента

**Создать `packages/kafka-client/`**:

```bash
mkdir -p packages/kafka-client/src
cd packages/kafka-client
pnpm init
```

**`packages/kafka-client/package.json`**:
```json
{
  "name": "@workspace/kafka-client",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@nestjs/microservices": "^10.0.0",
    "kafkajs": "^2.2.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

**`packages/kafka-client/src/kafka-client.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'auth-service',
                            brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
                        },
                        consumer: {
                            groupId: 'auth-service-group',
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class KafkaClientModule {}
```

**`packages/kafka-client/src/kafka-producer.service.ts`**:
```typescript
import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) {}

    async onModuleInit() {
        // Подключаемся к Kafka
        await this.kafkaClient.connect();
    }

    async onModuleDestroy() {
        // Отключаемся от Kafka
        await this.kafkaClient.close();
    }

    /**
     * Отправка сообщения в топик
     */
    emit<T = any>(topic: string, data: T): Observable<T> {
        return this.kafkaClient.emit(topic, data);
    }

    /**
     * Отправка сообщения и ожидание ответа
     */
    send<T = any, R = any>(topic: string, data: T): Observable<R> {
        return this.kafkaClient.send(topic, data);
    }
}
```

**`packages/kafka-client/src/kafka-consumer.service.ts`**:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumers: Map<string, Consumer> = new Map();

    constructor() {
        const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];

        this.kafka = new Kafka({
            clientId: 'auth-service',
            brokers,
        });
    }

    async onModuleInit() {
        // Создаем consumers при инициализации
    }

    async onModuleDestroy() {
        // Отключаем всех consumers
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }
    }

    /**
     * Создание consumer для топика
     */
    async createConsumer(topic: string, groupId: string, handler: (payload: EachMessagePayload) => Promise<void>) {
        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
            eachMessage: handler,
        });

        this.consumers.set(topic, consumer);
        return consumer;
    }
}
```

**`packages/kafka-client/src/index.ts`**:
```typescript
export * from './kafka-client.module';
export * from './kafka-producer.service';
export * from './kafka-consumer.service';
```

### Этап 2: Создание Auth Service

#### 2.1. Создание нового NestJS проекта

**Создать структуру**:
```bash
cd apps
nest new auth-service
cd auth-service
```

**Или вручную создать структуру**:
```
apps/auth-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   └── repositories/
│   │       └── user.repository.ts
│   ├── token/
│   │   ├── token.module.ts
│   │   └── services/
│   │       └── token.service.ts
│   ├── kafka/
│   │   ├── kafka.module.ts
│   │   ├── controllers/
│   │   │   └── auth-kafka.controller.ts
│   │   └── handlers/
│   │       └── auth-kafka.handler.ts
│   └── database/
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── nest-cli.json
```

#### 2.2. Настройка package.json

**`apps/auth-service/package.json`**:
```json
{
  "name": "auth-service",
  "version": "0.0.1",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "kafkajs": "^2.2.4",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/node": "^20.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 2.3. Настройка Prisma для Auth Service

**`apps/auth-service/prisma/schema.prisma`**:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Только модели, связанные с аутентификацией
model User {
  id             String     @id @default(uuid())
  name           String     @db.VarChar(255)
  email          String     @unique @db.VarChar(255)
  password       String
  isAcivated     Boolean    @default(false)
  activationLink String     @unique @db.VarChar(255)
  role           user_roles
  createdAt      DateTime?  @default(now())
  updatedAt      DateTime?  @updatedAt

  tokens         Token[]
  oauthAccounts  OAuthAccount[]

  @@map("users")
}

model Token {
  id           String   @id @default(uuid())
  userId       String   @map("user_id") @db.VarChar(255)
  refreshToken String   @map("refresh_token") @db.VarChar(255)
  createdAt    DateTime? @default(now())
  updatedAt    DateTime? @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("tokens")
}

model OAuthAccount {
  id            String    @id @default(uuid())
  userId        String    @map("user_id") @db.VarChar(255)
  provider      String    @db.VarChar(50)
  providerId    String    @map("provider_id") @db.VarChar(255)
  email         String?   @db.VarChar(255)
  name          String?   @db.VarChar(255)
  avatar        String?   @db.VarChar(500)
  accessToken   String?   @map("access_token") @db.Text
  refreshToken  String?   @map("refresh_token") @db.Text
  expiresAt     DateTime? @map("expires_at")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
  @@index([userId])
  @@map("oauth_accounts")
}

enum user_roles {
  user
  admin
}
```

**Важно**: Auth Service использует **отдельную базу данных** или **отдельную схему** в той же БД.

**Вариант 1: Отдельная база данных** (рекомендуется):
```env
# apps/auth-service/.env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"
```

**Вариант 2: Отдельная схема**:
```env
# apps/auth-service/.env
DATABASE_URL="postgresql://user:password@localhost:5432/main_db?schema=auth"
```

#### 2.4. Основные модули Auth Service

**`apps/auth-service/src/main.ts`**:
```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    // HTTP сервер для health checks и прямых вызовов
    const app = await NestFactory.create(AppModule);

    // Kafka микросервис
    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'auth-service',
                brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
            },
            consumer: {
                groupId: 'auth-service-group',
            },
        },
    });

    app.useGlobalPipes(new ValidationPipe());

    // Запускаем оба сервера
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3001);

    console.log(`Auth Service is running on: ${await app.getUrl()}`);
    console.log(`Kafka consumer is running`);
}

bootstrap();
```

**`apps/auth-service/src/app.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './database/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        TokenModule,
        KafkaModule,
    ],
})
export class AppModule {}
```

**`apps/auth-service/src/database/prisma.module.ts`**:
```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
```

**`apps/auth-service/src/database/prisma.service.ts`**:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
```

#### 2.5. Kafka модуль для Auth Service

**`apps/auth-service/src/kafka/kafka.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { AuthKafkaController } from './controllers/auth-kafka.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [AuthKafkaController],
})
export class KafkaModule {}
```

**`apps/auth-service/src/kafka/controllers/auth-kafka.controller.ts`**:
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { AuthService } from '../../auth/services/auth.service';

// Топики для Kafka
export const AUTH_TOPICS = {
    LOGIN: 'auth.login',
    REGISTER: 'auth.register',
    REFRESH_TOKEN: 'auth.refresh-token',
    VALIDATE_TOKEN: 'auth.validate-token',
    LOGOUT: 'auth.logout',
    ACTIVATE: 'auth.activate',
} as const;

@Controller()
export class AuthKafkaController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_TOPICS.LOGIN)
    async login(@Payload() data: any, @Ctx() context: KafkaContext) {
        const { email, password } = data;
        return await this.authService.login({ email, password });
    }

    @MessagePattern(AUTH_TOPICS.REGISTER)
    async register(@Payload() data: any, @Ctx() context: KafkaContext) {
        return await this.authService.registration(data);
    }

    @MessagePattern(AUTH_TOPICS.REFRESH_TOKEN)
    async refreshToken(@Payload() data: any, @Ctx() context: KafkaContext) {
        const { refreshToken } = data;
        return await this.authService.refreshToken(refreshToken);
    }

    @MessagePattern(AUTH_TOPICS.VALIDATE_TOKEN)
    async validateToken(@Payload() data: any, @Ctx() context: KafkaContext) {
        const { token } = data;
        return await this.authService.validateToken(token);
    }

    @MessagePattern(AUTH_TOPICS.LOGOUT)
    async logout(@Payload() data: any, @Ctx() context: KafkaContext) {
        const { refreshToken } = data;
        return await this.authService.logout(refreshToken);
    }

    @MessagePattern(AUTH_TOPICS.ACTIVATE)
    async activate(@Payload() data: any, @Ctx() context: KafkaContext) {
        const { link } = data;
        return await this.authService.activate(link);
    }
}
```

#### 2.6. Перенос Auth Service из основного API

**Скопировать и адаптировать**:
- `apps/api/src/modules/auth/` → `apps/auth-service/src/auth/`
- `apps/api/src/modules/user/` → `apps/auth-service/src/user/` (только части, связанные с auth)
- `apps/api/src/modules/token/` → `apps/auth-service/src/token/`

**Важно**: Убрать зависимости от других модулей (Chats, Messages, Posts и т.д.)

### Этап 3: Обновление API Gateway

#### 3.1. Установка зависимостей

**`apps/api/package.json`** (добавить):
```json
{
  "dependencies": {
    "@nestjs/microservices": "^10.0.0",
    "kafkajs": "^2.2.4"
  }
}
```

#### 3.2. Создание Auth Client в API Gateway

**`apps/api/src/modules/auth/clients/auth-kafka.client.ts`**:
```typescript
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUTH_TOPICS } from './auth-topics';

@Injectable()
export class AuthKafkaClient implements OnModuleInit {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    ) {}

    async onModuleInit() {
        // Подключаемся к Kafka
        await this.authClient.connect();
    }

    login(email: string, password: string): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.LOGIN, { email, password });
    }

    register(data: any): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.REGISTER, data);
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.REFRESH_TOKEN, { refreshToken });
    }

    validateToken(token: string): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.VALIDATE_TOKEN, { token });
    }

    logout(refreshToken: string): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.LOGOUT, { refreshToken });
    }

    activate(link: string): Observable<any> {
        return this.authClient.send(AUTH_TOPICS.ACTIVATE, { link });
    }
}
```

**`apps/api/src/modules/auth/clients/auth-topics.ts`**:
```typescript
export const AUTH_TOPICS = {
    LOGIN: 'auth.login',
    REGISTER: 'auth.register',
    REFRESH_TOKEN: 'auth.refresh-token',
    VALIDATE_TOKEN: 'auth.validate-token',
    LOGOUT: 'auth.logout',
    ACTIVATE: 'auth.activate',
} as const;
```

#### 3.3. Обновление Auth Module в API Gateway

**`apps/api/src/modules/auth/auth.module.ts`** (обновить):
```typescript
import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthKafkaClient } from './clients/auth-kafka.client';
import { CookieModule } from "@/core/cookie";

@Module({
    imports: [
        CookieModule,
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'api-gateway',
                            brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
                        },
                        consumer: {
                            groupId: 'api-gateway-group',
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthKafkaClient],
    exports: [AuthKafkaClient],
})
export class AuthModule { }
```

#### 3.4. Обновление Auth Controller

**`apps/api/src/modules/auth/controllers/auth.controller.ts`** (обновить):
```typescript
import { Controller, Post, Get, Body, Param, Req, Res, UseInterceptors } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { AuthKafkaClient } from '../clients/auth-kafka.client';
import { LoginDto, CreateUserDto } from "../dtos/login.dto";
import { CookieService } from "@/core/cookie";
import { AuthCookieInterceptor } from "@/core/interceptors/auth-cookie.interceptor";
import { SetAuthCookie } from "@/core/decorators/auth/set-auth-cookie.decorator";
import { firstValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authKafkaClient: AuthKafkaClient,
        private readonly cookieService: CookieService,
    ) {}

    @ApiOperation({ summary: 'Registration' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'User registered' })
    @Post('registration')
    async registration(@Body() registerDto: CreateUserDto, @Res() res: Response) {
        // Вызываем Auth Service через Kafka
        const result = await firstValueFrom(
            this.authKafkaClient.register(registerDto)
        );

        // Устанавливаем cookies
        this.cookieService.setRefreshToken(res, result.tokens.refreshToken);
        this.cookieService.setAccessToken(res, result.tokens.accessToken);

        return res.json(result);
    }

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'User logged in' })
    @UseInterceptors(AuthCookieInterceptor)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        // Вызываем Auth Service через Kafka
        const result = await firstValueFrom(
            this.authKafkaClient.login(loginDto.email, loginDto.password)
        );

        return result;
    }

    @ApiOperation({ summary: 'Refresh token' })
    @ApiResponse({ status: 200, description: 'Token refreshed' })
    @SetAuthCookie()
    @Post('refresh')
    async refreshToken(@Req() req: Request) {
        const refreshToken = this.cookieService.getRefreshToken(req);

        // Вызываем Auth Service через Kafka
        const result = await firstValueFrom(
            this.authKafkaClient.refreshToken(refreshToken)
        );

        return result;
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 200, description: 'User logged out' })
    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const refreshToken = this.cookieService.getRefreshToken(req);

        // Вызываем Auth Service через Kafka
        await firstValueFrom(
            this.authKafkaClient.logout(refreshToken)
        );

        this.cookieService.clearAuthCookies(res);
        return res.json({ success: true });
    }

    @ApiOperation({ summary: 'Activate' })
    @Get('activate/:link')
    async activate(@Param('link') link: string, @Res() res: Response) {
        // Вызываем Auth Service через Kafka
        const result = await firstValueFrom(
            this.authKafkaClient.activate(link)
        );

        // Устанавливаем cookies
        this.cookieService.setRefreshToken(res, result.tokens.refreshToken);
        this.cookieService.setAccessToken(res, result.tokens.accessToken);

        const redirectUrl = `${process.env.CLIENT_URL}/auth/login`;
        return res.redirect(redirectUrl);
    }
}
```

### Этап 4: События для других сервисов

#### 4.1. Создание событий

**`packages/common-types/src/events/auth.events.ts`**:
```typescript
// События, которые Auth Service публикует в Kafka

export enum AuthEventType {
    USER_CREATED = 'auth.user.created',
    USER_ACTIVATED = 'auth.user.activated',
    USER_LOGGED_IN = 'auth.user.logged-in',
    USER_LOGGED_OUT = 'auth.user.logged-out',
    TOKEN_REFRESHED = 'auth.token.refreshed',
}

export interface UserCreatedEvent {
    type: AuthEventType.USER_CREATED;
    userId: string;
    email: string;
    name: string;
    timestamp: Date;
}

export interface UserActivatedEvent {
    type: AuthEventType.USER_ACTIVATED;
    userId: string;
    email: string;
    timestamp: Date;
}

export interface UserLoggedInEvent {
    type: AuthEventType.USER_LOGGED_IN;
    userId: string;
    email: string;
    timestamp: Date;
}

export interface UserLoggedOutEvent {
    type: AuthEventType.USER_LOGGED_OUT;
    userId: string;
    timestamp: Date;
}

export type AuthEvent =
    | UserCreatedEvent
    | UserActivatedEvent
    | UserLoggedInEvent
    | UserLoggedOutEvent;
```

#### 4.2. Публикация событий из Auth Service

**`apps/auth-service/src/auth/services/auth.service.ts`** (добавить):
```typescript
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthEventType, UserCreatedEvent, UserActivatedEvent } from '@workspace/common-types';

@Injectable()
export class AuthService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        // ... другие зависимости
    ) {}

    async registration(registerDto: CreateUserDto) {
        // ... создание пользователя

        // Публикуем событие
        const event: UserCreatedEvent = {
            type: AuthEventType.USER_CREATED,
            userId: user.id,
            email: user.email,
            name: user.name,
            timestamp: new Date(),
        };

        // Отправляем в Kafka
        this.eventEmitter.emit('auth.user.created', event);

        return result;
    }

    async activate(link: string) {
        // ... активация пользователя

        // Публикуем событие
        const event: UserActivatedEvent = {
            type: AuthEventType.USER_ACTIVATED,
            userId: user.id,
            email: user.email,
            timestamp: new Date(),
        };

        // Отправляем в Kafka
        this.eventEmitter.emit('auth.user.activated', event);

        return result;
    }
}
```

#### 4.3. Подписка на события в API Gateway

**`apps/api/src/modules/user/listeners/user-created.listener.ts`**:
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@workspace/kafka-client';
import { UserService } from '../services/user.service';

@Injectable()
export class UserCreatedListener implements OnModuleInit {
    constructor(
        private readonly kafkaConsumer: KafkaConsumerService,
        private readonly userService: UserService,
    ) {}

    async onModuleInit() {
        // Подписываемся на событие создания пользователя
        await this.kafkaConsumer.createConsumer(
            'auth.user.created',
            'user-service-group',
            async (payload) => {
                const event = JSON.parse(payload.message.value.toString());

                // Создаем профиль пользователя в основном сервисе
                await this.userService.createProfile(event.userId, {
                    name: event.name,
                    email: event.email,
                });
            }
        );
    }
}
```

### Этап 5: Конфигурация и переменные окружения

#### 5.1. Auth Service .env

**`apps/auth-service/.env`**:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Email (для активации)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

#### 5.2. API Gateway .env (обновить)

**`apps/api/.env`** (добавить):
```env
# Kafka
KAFKA_BROKERS=localhost:9092

# Auth Service
AUTH_SERVICE_URL=http://localhost:3001
```

### Этап 6: Docker Compose для всех сервисов

**`docker-compose.microservices.yml`**:
```yaml
version: '3.8'

services:
  # База данных для Auth Service
  auth-db:
    image: postgres:15
    container_name: auth-db
    environment:
      POSTGRES_USER: auth_user
      POSTGRES_PASSWORD: auth_password
      POSTGRES_DB: auth_db
    ports:
      - "5433:5432"
    volumes:
      - auth-db-data:/var/lib/postgresql/data
    networks:
      - microservices-network

  # Kafka (из предыдущего файла)
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - microservices-network

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "9093:9093"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://kafka:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT_INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    networks:
      - microservices-network

  # Auth Service
  auth-service:
    build:
      context: .
      dockerfile: docker/AuthService.Dockerfile
    container_name: auth-service
    environment:
      DATABASE_URL: postgresql://auth_user:auth_password@auth-db:5432/auth_db
      KAFKA_BROKERS: kafka:29092
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - auth-db
      - kafka
    networks:
      - microservices-network

  # API Gateway
  api-gateway:
    build:
      context: .
      dockerfile: docker/Back.Dockerfile
    container_name: api-gateway
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/main_db
      KAFKA_BROKERS: kafka:29092
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - kafka
      - auth-service
    networks:
      - microservices-network

volumes:
  auth-db-data:

networks:
  microservices-network:
    driver: bridge
```

## Пошаговая инструкция для джуна/джуниора

### Шаг 1: Подготовка окружения

1. **Установить зависимости**:
```bash
# В корне проекта
pnpm install

# Установить Kafka клиент
cd packages/kafka-client
pnpm install
```

2. **Запустить Kafka**:
```bash
cd infrastructure
docker-compose -f docker-compose.kafka.yml up -d
```

3. **Проверить Kafka**:
- Открыть http://localhost:8080 (Kafka UI)
- Убедиться, что Kafka работает

### Шаг 2: Создание Auth Service

1. **Создать структуру проекта**:
```bash
cd apps
mkdir auth-service
cd auth-service
```

2. **Инициализировать NestJS проект**:
```bash
# Использовать nest CLI или создать вручную
nest new . --skip-git
```

3. **Настроить package.json** (см. выше)

4. **Создать структуру папок**:
```bash
mkdir -p src/auth/controllers src/auth/services src/auth/dto
mkdir -p src/user/services src/user/repositories
mkdir -p src/token/services
mkdir -p src/kafka/controllers src/kafka/handlers
mkdir -p src/database
mkdir prisma
```

### Шаг 3: Настройка базы данных

1. **Создать отдельную БД для Auth Service**:
```sql
CREATE DATABASE auth_db;
```

2. **Скопировать Prisma schema** (см. выше)

3. **Настроить .env**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
```

4. **Применить миграции**:
```bash
cd apps/auth-service
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### Шаг 4: Перенос кода из основного API

1. **Скопировать Auth Service**:
```bash
# Из основного API
cp -r apps/api/src/modules/auth/* apps/auth-service/src/auth/
```

2. **Адаптировать код**:
   - Убрать зависимости от других модулей
   - Обновить импорты
   - Убрать прямые вызовы других сервисов

3. **Скопировать User и Token модули** (только части, связанные с auth)

### Шаг 5: Настройка Kafka

1. **Создать Kafka модуль** (см. код выше)

2. **Создать Kafka контроллер** (см. код выше)

3. **Настроить main.ts** для работы с Kafka

### Шаг 6: Обновление API Gateway

1. **Установить зависимости**:
```bash
cd apps/api
pnpm add @nestjs/microservices kafkajs
```

2. **Создать Auth Kafka Client** (см. код выше)

3. **Обновить Auth Module** (см. код выше)

4. **Обновить Auth Controller** (см. код выше)

### Шаг 7: Тестирование

1. **Запустить Auth Service**:
```bash
cd apps/auth-service
pnpm start:dev
```

2. **Запустить API Gateway**:
```bash
cd apps/api
pnpm start:dev
```

3. **Протестировать endpoints**:
```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/registration \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Логин
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

4. **Проверить Kafka**:
- Открыть Kafka UI: http://localhost:8080
- Убедиться, что сообщения отправляются в топики

## Преимущества микросервисной архитектуры

1. **Масштабируемость**: Каждый сервис можно масштабировать независимо
2. **Независимость**: Сервисы можно разрабатывать и деплоить независимо
3. **Технологическая гибкость**: Можно использовать разные технологии для разных сервисов
4. **Отказоустойчивость**: Падение одного сервиса не влияет на другие
5. **Асинхронная коммуникация**: Kafka обеспечивает надежную доставку сообщений

## Следующие шаги

После успешного выноса Auth Service:

1. **Вынести User Service** (управление профилями, подписки)
2. **Вынести Notification Service** (уведомления)
3. **Вынести Chat Service** (чаты и сообщения)
4. **Добавить Service Discovery** (Consul, Eureka)
5. **Добавить API Gateway** (Kong, Traefik)
6. **Добавить мониторинг** (Prometheus, Grafana)
7. **Добавить логирование** (ELK Stack)

## Связанные задачи

- [OAuth авторизация и CAPTCHA](./oauth-captcha.md) - интегрировать в Auth Service
- [Сквозное шифрование](./end-to-end-encryption.md) - может потребовать обновления коммуникации

## Этапы реализации

### Этап 1: Инфраструктура (1-2 дня)

- [ ] Установить и настроить Kafka
- [ ] Создать общий Kafka клиент
- [ ] Настроить Docker Compose

### Этап 2: Создание Auth Service (3-5 дней)

- [ ] Создать структуру проекта
- [ ] Настроить базу данных
- [ ] Перенести код из основного API
- [ ] Настроить Kafka интеграцию

### Этап 3: Обновление API Gateway (2-3 дня)

- [ ] Создать Auth Kafka Client
- [ ] Обновить Auth Controller
- [ ] Обновить Auth Module

### Этап 4: События (2-3 дня)

- [ ] Создать общие типы событий
- [ ] Публикация событий из Auth Service
- [ ] Подписка на события в API Gateway

### Этап 5: Тестирование (2-3 дня)

- [ ] Протестировать все endpoints
- [ ] Протестировать Kafka коммуникацию
- [ ] Протестировать события
- [ ] Нагрузочное тестирование

### Этап 6: Документация (1 день)

- [ ] Обновить документацию
- [ ] Создать диаграммы архитектуры
- [ ] Написать инструкции для разработчиков
