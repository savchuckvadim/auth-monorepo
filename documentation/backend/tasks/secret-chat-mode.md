# Секретный режим в чате (Backend)

## Назначение

Реализовать backend поддержку для секретного режима в чатах. Backend не хранит содержимое секретных сообщений, но обеспечивает:
- Обмен ключами Signal Protocol (prekeys)
- Метаданные секретных сообщений (ID, timestamp, статусы)
- Уведомления о новых секретных сообщениях (только метаданные)
- Статусы доставки и прочтения

## Требования

### Функционал

1. **Обмен ключами Signal Protocol**:
   - Хранение prekeys пользователей
   - API для получения prekeys собеседника
   - API для обновления prekeys
   - Защита ключей (шифрование на сервере)

2. **Метаданные секретных сообщений**:
   - Хранение только метаданных (ID, timestamp, статусы)
   - Не хранить содержимое сообщений
   - Статусы доставки и прочтения

3. **WebSocket события**:
   - Уведомления о новых секретных сообщениях (только метаданные)
   - Статусы доставки и прочтения
   - Обмен ключами через WebSocket

4. **Безопасность**:
   - Сервер не видит содержимое сообщений
   - Ключи хранятся в зашифрованном виде
   - Валидация доступа к ключам

## Архитектура

### Модели Prisma

```prisma
// Добавить в schema.prisma

model SecretChatKey {
    id          String   @id @default(uuid())
    userId      String   @map("user_id") @db.VarChar(255)
    chatId      String   @map("chat_id") @db.VarChar(255)
    publicKey   String   @map("public_key") @db.Text // Публичный ключ для Signal Protocol
    prekeyId    String   @map("prekey_id") @db.VarChar(255) // ID prekey
    signedPrekey String? @map("signed_prekey") @db.Text // Signed prekey
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    chat Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)

    @@unique([userId, chatId, prekeyId])
    @@index([userId])
    @@index([chatId])
    @@map("secret_chat_keys")
}

model SecretMessageMetadata {
    id          String   @id @default(uuid())
    chatId      String   @map("chat_id") @db.VarChar(255)
    senderId    String   @map("sender_id") @db.VarChar(255)
    receiverId  String   @map("receiver_id") @db.VarChar(255)
    messageId   String   @map("message_id") @db.VarChar(255) // ID сообщения на клиенте
    timestamp   DateTime @default(now())
    isDelivered Boolean  @default(false) @map("is_delivered")
    deliveredAt DateTime? @map("delivered_at")
    isRead      Boolean  @default(false) @map("is_read")
    readAt      DateTime? @map("read_at")
    createdAt   DateTime @default(now())

    chat    Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)
    sender  User @relation("SecretMessageSender", fields: [senderId], references: [id], onDelete: Cascade)
    receiver User @relation("SecretMessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)

    @@unique([chatId, messageId])
    @@index([chatId, timestamp])
    @@index([senderId])
    @@index([receiverId])
    @@map("secret_message_metadata")
}
```

### Обновление модели Chat

```prisma
model Chat {
    // ... существующие поля
    secretChatKeys     SecretChatKey[]
    secretMessageMetadata SecretMessageMetadata[]

    // Добавить поле для отслеживания секретного режима (опционально)
    isSecretModeEnabled Boolean? @default(false) @map("is_secret_mode_enabled")
}
```

### Обновление модели User

```prisma
model User {
    // ... существующие поля
    secretChatKeys         SecretChatKey[]
    secretMessageMetadataSent SecretMessageMetadata[] @relation("SecretMessageSender")
    secretMessageMetadataReceived SecretMessageMetadata[] @relation("SecretMessageReceiver")
}
```

## API Endpoints

### 1. Обмен ключами Signal Protocol

#### POST /api/secret-chat/keys/prekeys

**Назначение**: Получить prekeys собеседника для установления секретного чата

**Request Body**:
```typescript
{
    chatId: string;
    userId: string; // ID собеседника
}
```

**Response**:
```typescript
{
    prekeys: {
        prekeyId: string;
        publicKey: string;
        signedPrekey?: string;
    }[];
}
```

**Реализация**:
```typescript
// secret-chat.controller.ts
@Post('keys/prekeys')
async getPrekeys(
    @Body() dto: GetPrekeysDto,
    @CurrentUser() currentUser: User
) {
    // Проверяем, что пользователь является участником чата
    const chat = await this.chatService.getChatById(dto.chatId);
    const isMember = chat.members.some(m => m.userId === currentUser.id);
    if (!isMember) {
        throw new ForbiddenException('You are not a member of this chat');
    }

    // Получаем prekeys собеседника
    const prekeys = await this.secretChatService.getPrekeys(dto.userId, dto.chatId);
    return { prekeys };
}
```

#### POST /api/secret-chat/keys/upload

**Назначение**: Загрузить свои prekeys для чата

**Request Body**:
```typescript
{
    chatId: string;
    prekeys: {
        prekeyId: string;
        publicKey: string;
        signedPrekey?: string;
    }[];
}
```

**Response**:
```typescript
{
    success: boolean;
}
```

**Реализация**:
```typescript
@Post('keys/upload')
async uploadPrekeys(
    @Body() dto: UploadPrekeysDto,
    @CurrentUser() currentUser: User
) {
    // Проверяем доступ к чату
    const chat = await this.chatService.getChatById(dto.chatId);
    const isMember = chat.members.some(m => m.userId === currentUser.id);
    if (!isMember) {
        throw new ForbiddenException('You are not a member of this chat');
    }

    // Сохраняем prekeys
    await this.secretChatService.savePrekeys(
        currentUser.id,
        dto.chatId,
        dto.prekeys
    );

    return { success: true };
}
```

### 2. Метаданные секретных сообщений

#### POST /api/secret-chat/messages/metadata

**Назначение**: Сохранить метаданные секретного сообщения

**Request Body**:
```typescript
{
    chatId: string;
    receiverId: string;
    messageId: string; // ID сообщения на клиенте
    timestamp: string; // ISO string
}
```

**Response**:
```typescript
{
    id: string;
    messageId: string;
    timestamp: string;
}
```

**Реализация**:
```typescript
@Post('messages/metadata')
async saveMessageMetadata(
    @Body() dto: SaveMessageMetadataDto,
    @CurrentUser() currentUser: User
) {
    // Проверяем доступ к чату
    const chat = await this.chatService.getChatById(dto.chatId);
    const isMember = chat.members.some(m => m.userId === currentUser.id);
    if (!isMember) {
        throw new ForbiddenException('You are not a member of this chat');
    }

    // Сохраняем метаданные
    const metadata = await this.secretChatService.saveMessageMetadata({
        chatId: dto.chatId,
        senderId: currentUser.id,
        receiverId: dto.receiverId,
        messageId: dto.messageId,
        timestamp: new Date(dto.timestamp),
    });

    // Отправляем уведомление получателю через WebSocket
    await this.secretChatGateway.notifyNewSecretMessage(
        dto.receiverId,
        {
            chatId: dto.chatId,
            messageId: dto.messageId,
            senderId: currentUser.id,
            timestamp: metadata.timestamp,
        }
    );

    return metadata;
}
```

#### PATCH /api/secret-chat/messages/:messageId/delivered

**Назначение**: Отметить сообщение как доставленное

**Response**:
```typescript
{
    success: boolean;
}
```

#### PATCH /api/secret-chat/messages/:messageId/read

**Назначение**: Отметить сообщение как прочитанное

**Response**:
```typescript
{
    success: boolean;
}
```

### 3. Получение метаданных

#### GET /api/secret-chat/messages/metadata/:chatId

**Назначение**: Получить метаданные секретных сообщений для чата

**Query Parameters**:
- `limit`: number (default: 50)
- `cursor`: string (optional)

**Response**:
```typescript
{
    metadata: {
        id: string;
        messageId: string;
        senderId: string;
        receiverId: string;
        timestamp: string;
        isDelivered: boolean;
        isRead: boolean;
    }[];
    nextCursor?: string;
    hasNext: boolean;
}
```

## WebSocket Gateway

### События

#### secret-message:new

**Назначение**: Уведомление о новом секретном сообщении (только метаданные)

**Emit to**: `user:${receiverId}`

**Payload**:
```typescript
{
    chatId: string;
    messageId: string;
    senderId: string;
    timestamp: string;
}
```

**Реализация**:
```typescript
// secret-chat.gateway.ts
@WebSocketGateway({
    namespace: '/secret-chat',
    cors: { origin: '*' },
})
export class SecretChatGateway {
    constructor(
        private readonly secretChatService: SecretChatService,
    ) {}

    async notifyNewSecretMessage(
        receiverId: string,
        metadata: {
            chatId: string;
            messageId: string;
            senderId: string;
            timestamp: Date;
        }
    ) {
        this.server.to(`user:${receiverId}`).emit('secret-message:new', {
            chatId: metadata.chatId,
            messageId: metadata.messageId,
            senderId: metadata.senderId,
            timestamp: metadata.timestamp.toISOString(),
        });
    }

    async notifyMessageDelivered(
        senderId: string,
        messageId: string
    ) {
        this.server.to(`user:${senderId}`).emit('secret-message:delivered', {
            messageId,
        });
    }

    async notifyMessageRead(
        senderId: string,
        messageId: string
    ) {
        this.server.to(`user:${senderId}`).emit('secret-message:read', {
            messageId,
        });
    }
}
```

#### secret-message:delivered

**Назначение**: Уведомление о доставке сообщения

**Emit to**: `user:${senderId}`

**Payload**:
```typescript
{
    messageId: string;
}
```

#### secret-message:read

**Назначение**: Уведомление о прочтении сообщения

**Emit to**: `user:${senderId}`

**Payload**:
```typescript
{
    messageId: string;
}
```

## Сервисы

### SecretChatService

```typescript
// secret-chat.service.ts
@Injectable()
export class SecretChatService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getPrekeys(userId: string, chatId: string) {
        const keys = await this.prisma.secretChatKey.findMany({
            where: {
                userId,
                chatId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10, // Возвращаем последние 10 prekeys
        });

        return keys.map(key => ({
            prekeyId: key.prekeyId,
            publicKey: key.publicKey,
            signedPrekey: key.signedPrekey,
        }));
    }

    async savePrekeys(
        userId: string,
        chatId: string,
        prekeys: { prekeyId: string; publicKey: string; signedPrekey?: string }[]
    ) {
        // Удаляем старые prekeys для этого чата
        await this.prisma.secretChatKey.deleteMany({
            where: {
                userId,
                chatId,
            },
        });

        // Сохраняем новые prekeys
        await this.prisma.secretChatKey.createMany({
            data: prekeys.map(prekey => ({
                userId,
                chatId,
                prekeyId: prekey.prekeyId,
                publicKey: prekey.publicKey,
                signedPrekey: prekey.signedPrekey,
            })),
        });
    }

    async saveMessageMetadata(data: {
        chatId: string;
        senderId: string;
        receiverId: string;
        messageId: string;
        timestamp: Date;
    }) {
        return await this.prisma.secretMessageMetadata.create({
            data,
        });
    }

    async markAsDelivered(messageId: string, chatId: string) {
        return await this.prisma.secretMessageMetadata.updateMany({
            where: {
                messageId,
                chatId,
            },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
            },
        });
    }

    async markAsRead(messageId: string, chatId: string) {
        return await this.prisma.secretMessageMetadata.updateMany({
            where: {
                messageId,
                chatId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }

    async getMessageMetadata(chatId: string, limit: number = 50, cursor?: string) {
        const where: any = { chatId };
        if (cursor) {
            where.id = { gt: cursor };
        }

        const metadata = await this.prisma.secretMessageMetadata.findMany({
            where,
            orderBy: {
                timestamp: 'desc',
            },
            take: limit + 1,
        });

        const hasNext = metadata.length > limit;
        const items = hasNext ? metadata.slice(0, -1) : metadata;
        const nextCursor = hasNext ? items[items.length - 1].id : undefined;

        return {
            metadata: items.reverse(),
            nextCursor,
            hasNext,
        };
    }
}
```

## Безопасность

### Важные моменты

1. **Сервер не хранит содержимое сообщений**:
   - Только метаданные (ID, timestamp, статусы)
   - Содержимое сообщений хранится только на клиенте

2. **Ключи хранятся в зашифрованном виде**:
   - Использовать шифрование для prekeys на сервере
   - Ключи шифрования ключей хранятся отдельно

3. **Валидация доступа**:
   - Проверять, что пользователь является участником чата
   - Проверять права доступа к ключам

4. **Очистка старых данных**:
   - Удалять старые prekeys (старше 30 дней)
   - Удалять старые метаданные (старше 90 дней)

## Миграции

```sql
-- Создание таблиц для секретного режима
CREATE TABLE `secret_chat_keys` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `chat_id` VARCHAR(255) NOT NULL,
    `public_key` TEXT NOT NULL,
    `prekey_id` VARCHAR(255) NOT NULL,
    `signed_prekey` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `secret_chat_keys_user_id_chat_id_prekey_id_key`(`user_id`, `chat_id`, `prekey_id`),
    INDEX `secret_chat_keys_user_id_idx`(`user_id`),
    INDEX `secret_chat_keys_chat_id_idx`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `secret_message_metadata` (
    `id` VARCHAR(191) NOT NULL,
    `chat_id` VARCHAR(255) NOT NULL,
    `sender_id` VARCHAR(255) NOT NULL,
    `receiver_id` VARCHAR(255) NOT NULL,
    `message_id` VARCHAR(255) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_delivered` BOOLEAN NOT NULL DEFAULT false,
    `delivered_at` DATETIME(3) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `read_at` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `secret_message_metadata_chat_id_message_id_key`(`chat_id`, `message_id`),
    INDEX `secret_message_metadata_chat_id_timestamp_idx`(`chat_id`, `timestamp`),
    INDEX `secret_message_metadata_sender_id_idx`(`sender_id`),
    INDEX `secret_message_metadata_receiver_id_idx`(`receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Связанные задачи

- [Сквозное шифрование для чатов и звонков (Backend)](./end-to-end-encryption.md) - базовая реализация Signal Protocol
- [Секретный режим в чате (Frontend)](../frontend/tasks/secret-chat-mode.md) - frontend реализация

## Этапы реализации

### Этап 1: Модели и миграции

- [ ] Добавить модели `SecretChatKey` и `SecretMessageMetadata` в Prisma schema
- [ ] Создать миграцию
- [ ] Обновить типы

### Этап 2: Сервисы

- [ ] Создать `SecretChatService`
- [ ] Реализовать методы для работы с prekeys
- [ ] Реализовать методы для работы с метаданными

### Этап 3: API Endpoints

- [ ] Создать `SecretChatController`
- [ ] Реализовать endpoints для обмена ключами
- [ ] Реализовать endpoints для метаданных

### Этап 4: WebSocket Gateway

- [ ] Создать `SecretChatGateway`
- [ ] Реализовать события для уведомлений
- [ ] Интегрировать с существующим WebSocket

### Этап 5: Безопасность

- [ ] Добавить валидацию доступа
- [ ] Реализовать шифрование ключей на сервере
- [ ] Добавить очистку старых данных

### Этап 6: Тестирование

- [ ] Протестировать обмен ключами
- [ ] Протестировать сохранение метаданных
- [ ] Протестировать WebSocket события
- [ ] Протестировать безопасность
