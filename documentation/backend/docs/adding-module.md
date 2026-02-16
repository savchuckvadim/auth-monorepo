# Инструкция: Добавление нового модуля

## Обзор

Эта инструкция описывает процесс создания нового модуля в проекте.

## Шаг 1: Создание структуры модуля

### 1.1 Создайте папку модуля

```bash
mkdir -p apps/api/src/modules/example
cd apps/api/src/modules/example
```

### 1.2 Создайте структуру файлов

```
modules/example/
├── example.module.ts
├── controllers/
│   └── example.controller.ts
├── services/
│   └── example.service.ts
├── repositories/          # Опционально
│   ├── example.repository.ts
│   └── example.prisma.repository.ts
├── dto/
│   └── example.dto.ts
├── socket/                # Опционально
│   └── example.gateway.ts
└── index.ts
```

## Шаг 2: Создание Prisma модели (если нужна БД)

### 2.1 Добавьте модель в schema.prisma

```prisma
// prisma/schema.prisma
model Example {
    id        String   @id @default(uuid())
    name      String   @db.VarChar(255)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@map("examples")
}
```

### 2.2 Создайте миграцию

```bash
cd apps/api
npx prisma migrate dev --name add_example
npx prisma generate
```

## Шаг 3: Создание DTO

### 3.1 Создайте DTO файл

```typescript
// modules/example/dto/example.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateExampleDto {
    @ApiProperty({
        description: 'Name',
        example: 'Example Name'
    })
    @IsString()
    name: string;
}

export class ExampleDto {
    @ApiProperty({ description: 'ID' })
    id: string;

    @ApiProperty({ description: 'Name' })
    name: string;
}
```

## Шаг 4: Создание Repository (если нужна работа с БД)

### 4.1 Создайте интерфейс Repository

```typescript
// modules/example/repositories/example.repository.ts
import { Example } from 'generated/prisma';

export interface ExampleRepository {
    findById(id: string): Promise<Example | null>;
    create(data: { name: string }): Promise<Example>;
    findAll(): Promise<Example[]>;
}
```

### 4.2 Создайте реализацию через Prisma

```typescript
// modules/example/repositories/example.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma';
import { ExampleRepository } from './example.repository';
import { Example } from 'generated/prisma';

@Injectable()
export class ExamplePrismaRepository implements ExampleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<Example | null> {
        return await this.prisma.example.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string }): Promise<Example> {
        return await this.prisma.example.create({
            data,
        });
    }

    async findAll(): Promise<Example[]> {
        return await this.prisma.example.findMany();
    }
}
```

## Шаг 5: Создание Service

```typescript
// modules/example/services/example.service.ts
import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '../repositories/example.repository';
import { CreateExampleDto } from '../dto/example.dto';
import { Example } from 'generated/prisma';

@Injectable()
export class ExampleService {
    constructor(
        private readonly repository: ExampleRepository,
    ) {}

    async create(dto: CreateExampleDto): Promise<Example> {
        return await this.repository.create(dto);
    }

    async findById(id: string): Promise<Example | null> {
        return await this.repository.findById(id);
    }

    async findAll(): Promise<Example[]> {
        return await this.repository.findAll();
    }
}
```

## Шаг 6: Создание Controller

```typescript
// modules/example/controllers/example.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { CreateExampleDto, ExampleDto } from '../dto/example.dto';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';

@UseGuards(AccessTokenGuard) // Защита всех эндпоинтов
@ApiTags('Example')
@Controller('example')
export class ExampleController {
    constructor(
        private readonly service: ExampleService,
    ) {}

    @ApiOperation({ summary: 'Get all examples' })
    @ApiResponse({ status: 200, description: 'Examples list', type: [ExampleDto] })
    @Get()
    async findAll(@CurrentUser() user: TokenPayloadDto) {
        return await this.service.findAll();
    }

    @ApiOperation({ summary: 'Get example by id' })
    @ApiResponse({ status: 200, description: 'Example', type: ExampleDto })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @ApiOperation({ summary: 'Create example' })
    @ApiResponse({ status: 201, description: 'Example created', type: ExampleDto })
    @Post()
    async create(@Body() dto: CreateExampleDto) {
        return await this.service.create(dto);
    }
}
```

## Шаг 7: Создание Module

```typescript
// modules/example/example.module.ts
import { Module } from '@nestjs/common';
import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';
import { ExampleRepository } from './repositories/example.repository';
import { ExamplePrismaRepository } from './repositories/example.prisma.repository';
import { TokenModule } from '@/modules/token'; // Если нужна авторизация

@Module({
    imports: [
        TokenModule, // Если нужна авторизация
    ],
    controllers: [ExampleController],
    providers: [
        ExampleService,
        {
            provide: ExampleRepository,
            useClass: ExamplePrismaRepository,
        },
    ],
    exports: [ExampleService], // Экспортируйте, если нужно использовать в других модулях
})
export class ExampleModule {}
```

## Шаг 8: Создание index.ts (Public API)

```typescript
// modules/example/index.ts
export * from './example.module';
export * from './services/example.service';
export * from './dto/example.dto';
// Экспортируйте только то, что нужно использовать в других модулях
```

## Шаг 9: Регистрация модуля в AppModule

```typescript
// app.module.ts
import { ExampleModule } from '@/modules/example';

@Module({
    imports: [
        // ... другие модули
        ExampleModule, // Добавьте новый модуль
    ],
})
export class AppModule {}
```

## Шаг 10: Обновление Swagger (автоматически)

Swagger автоматически подхватит новый контроллер после перезапуска сервера.

Проверьте документацию:
- `http://localhost:3000/docs/api`

## Шаг 11: Генерация API клиента (Orval)

После добавления нового модуля:

```bash
cd packages/nest-api
pnpm generate
```

Это обновит генерируемый API клиент для frontend.

## Опционально: WebSocket Gateway

Если нужен WebSocket:

```typescript
// modules/example/socket/example.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class ExampleGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('example:event')
    handleExampleEvent(@MessageBody() data: any) {
        this.server.emit('example:response', data);
    }
}
```

Добавьте в модуль:

```typescript
@Module({
    providers: [
        ExampleService,
        ExampleGateway, // Добавьте gateway
    ],
})
export class ExampleModule {}
```

## Checklist

- [ ] Создана структура модуля
- [ ] Добавлена Prisma модель (если нужна)
- [ ] Создана миграция
- [ ] Созданы DTO с валидацией и Swagger декораторами
- [ ] Создан Repository (если нужна работа с БД)
- [ ] Создан Service с бизнес-логикой
- [ ] Создан Controller с эндпоинтами
- [ ] Создан Module
- [ ] Создан index.ts с экспортами
- [ ] Модуль зарегистрирован в AppModule
- [ ] Swagger документация обновлена
- [ ] API клиент сгенерирован через Orval
- [ ] Протестированы эндпоинты

## Примеры

Посмотрите на существующие модули для примеров:
- `modules/user/` - простой модуль с CRUD
- `modules/post/` - модуль с WebSocket
- `modules/messages/` - модуль с зависимостями

## Ссылки

- [NestJS Modules](https://docs.nestjs.com/modules)
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [NestJS Providers](https://docs.nestjs.com/providers)
- [Swagger Documentation](./swagger.md)
