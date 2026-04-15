# Сквозное шифрование для чатов и звонков (Backend)

## Назначение

Реализовать backend поддержку сквозного шифрования (End-to-End Encryption, E2EE) для чатов и звонков по типу протокола Signal. Обеспечить инфраструктуру для обмена ключами, хранения prekeys и поддержки зашифрованных сообщений с поддержкой multi-device.

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Multi-Device архитектура

**В production каждое устройство = отдельная крипто-сущность.**

Это означает:
- Каждое устройство (мобильное, веб, планшет) имеет свой собственный набор ключей
- Сообщения шифруются отдельно для каждого устройства получателя
- Если пользователь имеет 3 устройства, сообщение должно быть зашифровано 3 раза
- **Сообщения видны только на том устройстве, на котором они были расшифрованы**
- При потере устройства все сессии с этим устройством становятся недействительными

## Справочная информация

**Протокол Signal** ([Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB_Signal)):
- Использует **Double Ratchet Algorithm** для постоянного обновления ключей
- **X3DH** - протокол установления сессии
- **Prekeys** и расширенный протокол тройного обмена ключами Диффи-Хеллмана (3-DH)
- Криптографические примитивы: **Curve25519**, **AES-256**, **HMAC-SHA256**
- Сервер не видит содержимое сообщений, только метаданные
- **Forward secrecy** - прошлые сообщения нельзя расшифровать при компрометации ключей
- **Post-compromise security** - восстановление безопасности после компрометации

## Требования

### Функционал

1. **Управление устройствами (multi-device)**:
   - Регистрация устройств пользователя
   - Хранение ключей для каждого устройства
   - Удаление устройств
   - Получение списка устройств пользователя

2. **Управление prekeys**:
   - Хранение prekeys для каждого устройства
   - Выдача prekey bundle для обмена ключами
   - Обновление prekeys
   - Автоматическая ротация signed prekeys

3. **Хранение зашифрованных сообщений**:
   - Сохранение зашифрованного контента
   - Метаданные сообщений (без расшифровки)
   - Поддержка флага `isEncrypted`
   - Поддержка `toDeviceId` для multi-device

4. **Поддержка LiveKit E2EE**:
   - **LiveKit имеет встроенную поддержку E2EE** - шифрование медиа происходит полностью на клиенте
   - **Backend НЕ участвует в шифровании звонков** - это полностью клиентская функциональность
   - Токены LiveKit не требуют изменений для E2EE
   - Backend только обеспечивает безопасную генерацию и передачу токенов

5. **Безопасность**:
   - Сервер не должен иметь возможность расшифровать сообщения
   - Хранение только публичных ключей
   - Защита от перехвата ключей
   - Rate limiting для endpoints ключей

## База данных

### Prisma Schema

**Новые модели для multi-device**:

```prisma
// Устройства пользователя
model Device {
    id                String   @id @default(uuid())
    userId            String   @map("user_id") @db.VarChar(255)
    deviceId           String   @unique @map("device_id") @db.VarChar(255) // UUID v4 от клиента
    name               String?  @map("name") @db.VarChar(255) // "iPhone 15", "Chrome Browser"
    type               String   @map("type") @db.VarChar(50) // "mobile", "web", "desktop"
    registrationId     Int      @map("registration_id")
    identityKey        String   @map("identity_key") @db.Text // Публичный ключ идентичности
    signedPreKey       String   @map("signed_pre_key") @db.Text // Подписанный prekey
    signedPreKeySig    String   @map("signed_pre_key_sig") @db.Text // Подпись signed prekey
    signedPreKeyExpiry DateTime? @map("signed_pre_key_expiry") // Срок действия signed prekey
    createdAt          DateTime @default(now()) @map("created_at")
    updatedAt          DateTime @updatedAt @map("updated_at")
    lastSeenAt         DateTime @default(now()) @map("last_seen_at")

    user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    preKeys  PreKey[]
    messages Message[] // Сообщения, отправленные на это устройство

    @@unique([userId, deviceId])
    @@index([userId])
    @@index([deviceId])
    @@map("devices")
}

// Prekeys для обмена ключами (для каждого устройства)
model PreKey {
    id        String   @id @default(uuid())
    deviceId  String   @map("device_id") @db.VarChar(255)
    keyId     Int      @map("key_id") // ID prekey (1-100)
    publicKey String   @map("public_key") @db.Text // Публичный ключ
    createdAt DateTime @default(now()) @map("created_at")

    device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

    @@unique([deviceId, keyId])
    @@index([deviceId])
    @@map("prekeys")
}

// One-time prekeys (одноразовые, для каждого устройства)
model OneTimePreKey {
    id        String    @id @default(uuid())
    deviceId  String    @map("device_id") @db.VarChar(255)
    keyId     Int       @map("key_id")
    publicKey String    @map("public_key") @db.Text
    createdAt DateTime  @default(now()) @map("created_at")
    usedAt    DateTime? @map("used_at") // Когда был использован

    device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

    @@unique([deviceId, keyId])
    @@index([deviceId])
    @@index([usedAt])
    @@map("one_time_prekeys")
}
```

**Обновление существующих моделей**:

```prisma
// Обновить модель Message
model Message {
    // ... существующие поля
    isEncrypted    Boolean?  @default(false) @map("is_encrypted") // Флаг зашифрованного сообщения
    encryptedContent String?  @map("encrypted_content") @db.Text // Зашифрованный контент (если isEncrypted = true)
    toDeviceId      String?   @map("to_device_id") @db.VarChar(255) // Для multi-device: на какое устройство отправлено
    messageType     String?   @map("message_type") @db.VarChar(50) // "prekey" | "whisper" (Signal типы)
    registrationId  Int?      @map("registration_id") // Registration ID получателя

    device Device? @relation(fields: [toDeviceId], references: [id], onDelete: SetNull)

    @@index([isEncrypted])
    @@index([toDeviceId])
}

// Обновить модель User
model User {
    // ... существующие поля

    // Новые relations
    devices Device[]
}
```

## API Endpoints

### Device Management

#### `POST /api/encryption/devices/register`
Регистрация нового устройства

**Request**:
```typescript
{
    deviceId: string;              // UUID v4 от клиента
    name?: string;                 // "iPhone 15", "Chrome Browser"
    type: "mobile" | "web" | "desktop";
    registrationId: number;       // ID регистрации
    identityKey: string;           // Публичный ключ идентичности
    signedPreKey: string;          // Подписанный prekey
    signedPreKeySig: string;       // Подпись signed prekey
    preKeys: Array<{               // Prekeys (до 100)
        keyId: number;
        publicKey: string;
    }>;
    oneTimePreKeys: Array<{        // One-time prekeys (до 100)
        keyId: number;
        publicKey: string;
    }>;
}
```

**Response**:
```typescript
{
    success: boolean;
    deviceId: string;
}
```

#### `GET /api/encryption/devices/me`
Получение списка своих устройств

**Response**:
```typescript
Array<{
    deviceId: string;
    name: string | null;
    type: string;
    lastSeenAt: string;
    createdAt: string;
}>
```

#### `DELETE /api/encryption/devices/:deviceId`
Удаление устройства

**Response**: `{ success: boolean }`

### Encryption Keys

#### `PUT /api/encryption/devices/:deviceId/keys`
Обновление ключей устройства

**Request**:
```typescript
{
    signedPreKey?: string;
    signedPreKeySig?: string;
    preKeys?: Array<{
        keyId: number;
        publicKey: string;
    }>;
    oneTimePreKeys?: Array<{
        keyId: number;
        publicKey: string;
    }>;
}
```

**Response**: `{ success: boolean }`

### PreKey Bundle

#### `GET /api/encryption/prekey-bundle/:userId`
Получение prekey bundle для всех устройств пользователя (для multi-device)

**Response**:
```typescript
Array<{
    deviceId: string;
    identityKey: string;
    signedPreKey: {
        keyId: number;
        publicKey: string;
        signature: string;
    };
    registrationId: number;
    preKey?: {                  // Опционально, если есть one-time prekey
        keyId: number;
        publicKey: string;
    };
}>
```

**Логика**:
- Возвращает bundle для ВСЕХ устройств пользователя
- Для каждого устройства возвращает signed prekey и identity key
- Если есть one-time prekey, возвращает его и помечает как использованный
- Если нет one-time prekey, возвращает обычный prekey

#### `GET /api/encryption/prekey-bundle/:userId/:deviceId`
Получение prekey bundle для конкретного устройства

**Response**:
```typescript
{
    deviceId: string;
    identityKey: string;
    signedPreKey: {
        keyId: number;
        publicKey: string;
        signature: string;
    };
    registrationId: number;
    preKey?: {
        keyId: number;
        publicKey: string;
    };
}
```

### One-Time PreKeys

#### `POST /api/encryption/devices/:deviceId/one-time-prekeys`
Загрузка one-time prekeys для устройства

**Request**:
```typescript
{
    oneTimePreKeys: Array<{
        keyId: number;
        publicKey: string;
    }>;
}
```

**Response**: `{ success: boolean, count: number }`

#### `GET /api/encryption/devices/:deviceId/one-time-prekeys/count`
Получение количества доступных one-time prekeys для устройства

**Response**: `{ count: number }`

### Fingerprint (MITM защита)

#### `GET /api/encryption/users/:userId/fingerprint`
Получение fingerprint для верификации ключей

**Response**:
```typescript
Array<{
    deviceId: string;
    fingerprint: string; // Safety number / fingerprint
}>
```

## Реализация

### Module: `modules/encryption/`

**Структура**:
```
modules/encryption/
├── encryption.module.ts
├── controllers/
│   ├── encryption.controller.ts
│   └── devices.controller.ts
├── services/
│   ├── encryption.service.ts
│   ├── device.service.ts
│   ├── prekey.service.ts
│   └── key-exchange.service.ts
├── repositories/
│   ├── device.repository.ts
│   ├── encryption-key.repository.ts
│   └── prekey.repository.ts
├── dto/
│   ├── register-device.dto.ts
│   ├── register-keys.dto.ts
│   ├── prekey-bundle.dto.ts
│   └── device.dto.ts
└── types/
    └── encryption.types.ts
```

### DeviceService

**Методы**:

```typescript
// Регистрация устройства
async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<DeviceDto>

// Получение устройств пользователя
async getUserDevices(userId: string): Promise<DeviceDto[]>

// Получение устройства по deviceId
async getDevice(deviceId: string, userId: string): Promise<DeviceDto>

// Удаление устройства
async deleteDevice(deviceId: string, userId: string): Promise<void>

// Обновление ключей устройства
async updateDeviceKeys(deviceId: string, userId: string, dto: UpdateKeysDto): Promise<void>

// Обновление lastSeenAt
async updateLastSeen(deviceId: string): Promise<void>
```

### EncryptionService

**Методы**:

```typescript
// Получение prekey bundle для всех устройств пользователя
async getPreKeyBundleForUser(userId: string, requesterId: string): Promise<PreKeyBundleDto[]>

// Получение prekey bundle для конкретного устройства
async getPreKeyBundleForDevice(userId: string, deviceId: string, requesterId: string): Promise<PreKeyBundleDto>

// Получение fingerprint для верификации
async getFingerprint(userId: string): Promise<FingerprintDto[]>
```

### PreKeyService

**Методы**:

```typescript
// Загрузка prekeys для устройства
async uploadPreKeys(deviceId: string, preKeys: PreKeyDto[]): Promise<void>

// Загрузка one-time prekeys для устройства
async uploadOneTimePreKeys(deviceId: string, oneTimePreKeys: OneTimePreKeyDto[]): Promise<void>

// Получение prekey bundle для устройства
async getPreKeyBundle(deviceId: string): Promise<PreKeyBundleDto>

// Использование one-time prekey
async useOneTimePreKey(deviceId: string, keyId: number): Promise<void>

// Проверка количества one-time prekeys
async getOneTimePreKeyCount(deviceId: string): Promise<number>

// Автоматическая ротация signed prekeys (cron job)
async rotateSignedPreKeys(): Promise<void>
```

### KeyExchangeService

**Методы**:

```typescript
// Получение prekey bundle для обмена (multi-device)
async getPreKeyBundleForExchange(
    userId: string,
    requesterId: string
): Promise<PreKeyBundleDto[]> {
    // 1. Получить все устройства пользователя
    // 2. Для каждого устройства:
    //    - Получить identity key и signed prekey
    //    - Попытаться получить one-time prekey (если есть)
    //    - Если нет one-time prekey, использовать обычный prekey
    //    - Пометить использованный one-time prekey
    // 3. Вернуть массив bundle для всех устройств
}
```

### Обновление MessageService

**Поддержка зашифрованных сообщений с multi-device**:

```typescript
// В messages.service.ts
public async createMessage(
    senderId: string,
    dto: CreateMessageDto
): Promise<MessageDto> {
    // Сохраняем зашифрованный контент как есть
    // Сервер не расшифровывает

    // Если сообщение зашифровано и указан toDeviceId
    if (dto.isEncrypted && dto.toDeviceId) {
        const message = await this.repo.create({
            ...dto,
            senderId,
            content: dto.encryptedContent || dto.content,
            isEncrypted: true,
            toDeviceId: dto.toDeviceId,
            messageType: dto.messageType, // "prekey" | "whisper"
            registrationId: dto.registrationId,
        });

        return new MessageDto(message);
    }

    // Обычное незашифрованное сообщение
    const message = await this.repo.create({
        ...dto,
        senderId,
        content: dto.content,
        isEncrypted: false,
    });

    return new MessageDto(message);
}

// Для multi-device: отправка на все устройства получателя
public async createEncryptedMessageForAllDevices(
    senderId: string,
    recipientId: string,
    chatId: string,
    encryptedMessages: Array<{
        toDeviceId: string;
        encryptedContent: string;
        messageType: "prekey" | "whisper";
        registrationId: number;
    }>
): Promise<MessageDto[]> {
    // Создаём отдельное сообщение для каждого устройства
    const messages = await Promise.all(
        encryptedMessages.map(msg =>
            this.repo.create({
                chatId,
                senderId,
                content: msg.encryptedContent,
                isEncrypted: true,
                toDeviceId: msg.toDeviceId,
                messageType: msg.messageType,
                registrationId: msg.registrationId,
            })
        )
    );

    return messages.map(msg => new MessageDto(msg));
}
```

### Обновление CreateMessageDto

```typescript
export class CreateMessageDto {
    chatId: string;
    content: string;
    type?: MessageType;

    // E2EE поля
    isEncrypted?: boolean;
    encryptedContent?: string;
    toDeviceId?: string;        // Для multi-device
    messageType?: "prekey" | "whisper";
    registrationId?: number;
}
```

## Безопасность

### Принципы

1. **Сервер не расшифровывает**:
   - Сохраняем зашифрованный контент как есть
   - Не пытаемся расшифровать на сервере
   - Не логируем ciphertext

2. **Хранение только публичных ключей**:
   - Сохраняем только публичные части ключей
   - Приватные ключи остаются на клиенте
   - Никогда не запрашиваем приватные ключи

3. **Защита от перехвата**:
   - Использовать HTTPS для всех запросов
   - Валидация подписей ключей
   - Защита от replay атак
   - Rate limiting для endpoints ключей

4. **Очистка использованных ключей**:
   - Удалять использованные one-time prekeys
   - Периодическая очистка старых prekeys
   - Автоматическая ротация signed prekeys (каждые 7-30 дней)

5. **Multi-device безопасность**:
   - Валидация deviceId при регистрации
   - Проверка принадлежности устройства пользователю
   - Уведомление других устройств при удалении устройства

### Rate Limiting

```typescript
// В encryption.controller.ts
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 запросов в минуту
@Get('prekey-bundle/:userId')
async getPreKeyBundle(...) { ... }
```

## Интеграция с LiveKit

### Как работает LiveKit E2EE

**Важно**: LiveKit E2EE работает **полностью на клиенте**. Backend **НЕ участвует** в процессе шифрования медиа-потоков.

**Принцип работы**:

1. **Клиент включает E2EE**:
   ```typescript
   // На фронтенде
   const room = new Room({
       e2ee: {
           keyProvider: createE2EEKeyProvider(),
       },
   });
   ```

2. **LiveKit шифрует медиа на клиенте**:
   - Аудио и видео потоки шифруются перед отправкой
   - Шифрование происходит в браузере/приложении
   - Сервер LiveKit получает уже зашифрованные данные

3. **Сервер LiveKit**:
   - Получает зашифрованные медиа-потоки
   - Передает их другим участникам
   - **НЕ может расшифровать** содержимое

4. **Клиент получателя расшифровывает**:
   - Получает зашифрованные данные
   - Расшифровывает с помощью ключей из E2EEKeyProvider
   - Воспроизводит медиа

### Что нужно делать на Backend

**Минимальные требования (уже реализовано)**:

1. **Генерация токенов LiveKit** (уже работает):
   ```typescript
   // В live-kit.service.ts (уже существует)
   async generateToken(
       roomName: string,
       participantIdentity: string
   ): Promise<string> {
       const at = new AccessToken(this.apiKey, this.apiSecret, {
           identity: participantIdentity,
       });

       at.addGrant({
           roomJoin: true,
           room: roomName,
           canPublish: true,
           canSubscribe: true,
       });

       // E2EE включается на клиенте, токен НЕ требует изменений
       // Токен работает одинаково для обычных и E2EE звонков
       return at.toJwt();
   }
   ```

2. **Безопасная передача токенов**:
   - Использовать HTTPS для всех запросов
   - Защита токенов от перехвата
   - Валидация пользователя перед выдачей токена

**Вывод**: Для базовой поддержки E2EE в LiveKit **ничего дополнительного делать не нужно**. Текущая реализация `LiveKitService.generateToken()` уже поддерживает E2EE звонки.

## Миграции базы данных

### Шаг 1: Добавить модели в schema.prisma

Добавить в `apps/api/prisma/schema.prisma`:

```prisma
model Device {
    id                String   @id @default(uuid())
    userId            String   @map("user_id") @db.VarChar(255)
    deviceId           String   @unique @map("device_id") @db.VarChar(255)
    name               String?  @map("name") @db.VarChar(255)
    type               String   @map("type") @db.VarChar(50)
    registrationId     Int      @map("registration_id")
    identityKey        String   @map("identity_key") @db.Text
    signedPreKey       String   @map("signed_pre_key") @db.Text
    signedPreKeySig    String   @map("signed_pre_key_sig") @db.Text
    signedPreKeyExpiry DateTime? @map("signed_pre_key_expiry")
    createdAt          DateTime @default(now()) @map("created_at")
    updatedAt          DateTime @updatedAt @map("updated_at")
    lastSeenAt         DateTime @default(now()) @map("last_seen_at")

    user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    preKeys  PreKey[]
    messages Message[]

    @@unique([userId, deviceId])
    @@index([userId])
    @@index([deviceId])
    @@map("devices")
}

model PreKey {
    id        String   @id @default(uuid())
    deviceId  String   @map("device_id") @db.VarChar(255)
    keyId     Int      @map("key_id")
    publicKey String   @map("public_key") @db.Text
    createdAt DateTime @default(now()) @map("created_at")

    device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

    @@unique([deviceId, keyId])
    @@index([deviceId])
    @@map("prekeys")
}

model OneTimePreKey {
    id        String    @id @default(uuid())
    deviceId  String    @map("device_id") @db.VarChar(255)
    keyId     Int       @map("key_id")
    publicKey String    @map("public_key") @db.Text
    createdAt DateTime  @default(now()) @map("created_at")
    usedAt    DateTime? @map("used_at")

    device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

    @@unique([deviceId, keyId])
    @@index([deviceId])
    @@index([usedAt])
    @@map("one_time_prekeys")
}
```

### Шаг 2: Обновить модель Message

```prisma
model Message {
    // ... существующие поля

    isEncrypted      Boolean?  @default(false) @map("is_encrypted")
    encryptedContent String?   @map("encrypted_content") @db.Text
    toDeviceId       String?   @map("to_device_id") @db.VarChar(255)
    messageType      String?   @map("message_type") @db.VarChar(50)
    registrationId   Int?      @map("registration_id")

    device Device? @relation(fields: [toDeviceId], references: [id], onDelete: SetNull)

    @@index([isEncrypted])
    @@index([toDeviceId])
}
```

### Шаг 3: Обновить модель User

```prisma
model User {
    // ... существующие поля

    devices Device[]
}
```

### Шаг 4: Создать миграцию

```bash
cd apps/api
npx prisma migrate dev --name add_e2ee_multi_device
```

Или создать миграцию вручную:

```bash
npx prisma migrate dev --create-only --name add_e2ee_multi_device
# Отредактировать созданный SQL файл при необходимости
npx prisma migrate dev
```

## Установка зависимостей

Backend не требует дополнительных криптографических библиотек, так как вся криптография происходит на клиенте. Backend только хранит публичные ключи и зашифрованный контент.

Однако, для валидации и работы с ключами можно использовать:

```bash
cd apps/api
npm install --save @noble/curves25519
npm install --save-dev @types/node
```

## Задачи

### Этап 1: База данных

- [ ] Добавить модель `Device` в Prisma schema
- [ ] Добавить модели `PreKey` и `OneTimePreKey` в Prisma schema
- [ ] Обновить модель `Message` (добавить поля для E2EE)
- [ ] Обновить модель `User` (добавить relation `devices`)
- [ ] Создать миграцию базы данных
- [ ] Применить миграцию

### Этап 2: Модуль encryption

- [ ] Создать модуль `encryption`
- [ ] Создать `DeviceService`
- [ ] Создать `EncryptionService`
- [ ] Создать `PreKeyService`
- [ ] Создать `KeyExchangeService`
- [ ] Создать репозитории для устройств и ключей

### Этап 3: API Endpoints

- [ ] Создать `DevicesController` (регистрация, получение, удаление устройств)
- [ ] Создать `EncryptionController` (prekey bundle, fingerprint)
- [ ] Добавить валидацию DTOs
- [ ] Добавить rate limiting для endpoints ключей

### Этап 4: Интеграция с сообщениями

- [ ] Обновить `MessageService` для поддержки зашифрованных сообщений
- [ ] Обновить `CreateMessageDto` (добавить поля E2EE)
- [ ] Обновить `MessageDto` (добавить поля E2EE)
- [ ] Обновить WebSocket gateway для работы с зашифрованными сообщениями
- [ ] Реализовать отправку на все устройства получателя

### Этап 5: Безопасность

- [ ] Реализовать валидацию подписей ключей
- [ ] Реализовать защиту от replay атак
- [ ] Реализовать очистку использованных ключей
- [ ] Добавить rate limiting для endpoints ключей
- [ ] Реализовать автоматическую ротацию signed prekeys (cron job)

### Этап 6: Тестирование

- [ ] Unit тесты для сервисов
- [ ] Integration тесты для API endpoints
- [ ] Тесты безопасности
- [ ] Тесты multi-device сценариев

## Файлы для работы

### Создать

- `apps/api/src/modules/encryption/` - новый модуль
- `apps/api/src/modules/encryption/controllers/devices.controller.ts`
- `apps/api/src/modules/encryption/controllers/encryption.controller.ts`
- `apps/api/src/modules/encryption/services/device.service.ts`
- `apps/api/src/modules/encryption/services/encryption.service.ts`
- `apps/api/src/modules/encryption/services/prekey.service.ts`
- `apps/api/src/modules/encryption/repositories/device.repository.ts`
- `apps/api/src/modules/encryption/repositories/prekey.repository.ts`
- `apps/api/src/modules/encryption/dto/register-device.dto.ts`
- `apps/api/src/modules/encryption/dto/prekey-bundle.dto.ts`

### Обновить

- `apps/api/prisma/schema.prisma` - добавить модели
- `apps/api/src/modules/messages/services/messages.service.ts` - поддержка E2EE
- `apps/api/src/modules/messages/dto/create-message.dto.ts` - добавить поля E2EE
- `apps/api/src/modules/messages/dto/message.dto.ts` - добавить поля E2EE

## Связанные задачи

- [Frontend задача по сквозному шифрованию](../../frontend/tasks/end-to-end-encryption.md) - связанная frontend задача
- [React Native задача по сквозному шифрованию](../../frontend/tasks/end-to-end-encryption-react-native.md) - связанная React Native задача

## Примечания

- Сервер **не должен** иметь возможность расшифровать сообщения
- Хранить только публичные ключи
- Каждое устройство = отдельная крипто-сущность
- Сообщения шифруются отдельно для каждого устройства получателя
- **Сообщения видны только на том устройстве, на котором они были расшифрованы**
- Использовать проверенные криптографические библиотеки на клиенте
- Следовать принципам Signal Protocol
- Обеспечить обратную совместимость с незашифрованными сообщениями
- Автоматическая ротация signed prekeys каждые 7-30 дней
- Мониторинг количества one-time prekeys (должно быть > 20)

## Production Checklist

- [ ] HTTPS only для всех endpoints
- [ ] WSS only для WebSocket
- [ ] Rate limit prekey endpoints
- [ ] Key transparency log (опционально)
- [ ] Audit логики удаления prekeys
- [ ] Backups БЕЗ plaintext
- [ ] Zero logging ciphertext
- [ ] Мониторинг количества one-time prekeys
- [ ] Автоматическая ротация signed prekeys
- [ ] Уведомление пользователей о новых устройствах
- [ ] Уведомление при удалении устройства
