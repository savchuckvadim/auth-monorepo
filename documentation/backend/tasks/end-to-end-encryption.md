# Сквозное шифрование для чатов и звонков (Backend)

## Назначение

Реализовать backend поддержку сквозного шифрования (End-to-End Encryption, E2EE) для чатов и звонков по типу протокола Signal. Обеспечить инфраструктуру для обмена ключами, хранения prekeys и поддержки зашифрованных сообщений.

## Справочная информация

**Протокол Signal** ([Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB_Signal)):
- Использует **Double Ratchet Algorithm** для постоянного обновления ключей
- **Prekeys** и расширенный протокол тройного обмена ключами Диффи-Хеллмана (3-DH)
- Криптографические примитивы: **Curve25519**, **AES-256**, **HMAC-SHA256**
- Сервер не видит содержимое сообщений, только метаданные

## Требования

### Функционал

1. **Управление prekeys**:
   - Хранение prekeys пользователей
   - Выдача prekeys для обмена ключами
   - Обновление prekeys

2. **Хранение зашифрованных сообщений**:
   - Сохранение зашифрованного контента
   - Метаданные сообщений (без расшифровки)
   - Поддержка флага `isEncrypted`

3. **Поддержка LiveKit E2EE**:
   - **LiveKit имеет встроенную поддержку E2EE** - шифрование медиа происходит полностью на клиенте
   - **Backend НЕ участвует в шифровании звонков** - это полностью клиентская функциональность
   - Токены LiveKit не требуют изменений для E2EE
   - Backend только обеспечивает безопасную генерацию и передачу токенов
   - **Опционально**: можно добавить обмен ключами E2EE между участниками через Signal Protocol (для дополнительной безопасности)

4. **Безопасность**:
   - Сервер не должен иметь возможность расшифровать сообщения
   - Хранение только публичных ключей
   - Защита от перехвата ключей

## База данных

### Prisma Schema

**Новые модели**:

```prisma
// User encryption keys
model UserEncryptionKey {
    id              String   @id @default(uuid())
    userId          String   @unique @map("user_id") @db.VarChar(255)
    identityKey     String   @map("identity_key") @db.Text // Публичный ключ идентичности
    signedPreKey    String   @map("signed_pre_key") @db.Text // Подписанный prekey
    signedPreKeySig String   @map("signed_pre_key_sig") @db.Text // Подпись signed prekey
    registrationId  Int      @map("registration_id") // ID регистрации
    createdAt       DateTime @default(now()) @map("created_at")
    updatedAt       DateTime @updatedAt @map("updated_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
    @@map("user_encryption_keys")
}

// Prekeys для обмена ключами
model PreKey {
    id        String   @id @default(uuid())
    userId    String   @map("user_id") @db.VarChar(255)
    keyId     Int      @map("key_id") // ID prekey (1-100)
    publicKey String   @map("public_key") @db.Text // Публичный ключ
    createdAt DateTime @default(now()) @map("created_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, keyId])
    @@index([userId])
    @@map("prekeys")
}

// One-time prekeys (одноразовые)
model OneTimePreKey {
    id        String   @id @default(uuid())
    userId    String   @map("user_id") @db.VarChar(255)
    keyId     Int      @map("key_id")
    publicKey String   @map("public_key") @db.Text
    createdAt DateTime @default(now()) @map("created_at")
    usedAt    DateTime? @map("used_at") // Когда был использован

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, keyId])
    @@index([userId])
    @@index([usedAt])
    @@map("one_time_prekeys")
}
```

**Обновление существующих моделей**:

```prisma
// Обновить модель Message
model Message {
    // ... существующие поля
    isEncrypted Boolean @default(false) @map("is_encrypted") // Флаг зашифрованного сообщения
    encryptedContent String? @map("encrypted_content") @db.Text // Зашифрованный контент (если isEncrypted = true)

    @@index([isEncrypted])
}

// Обновить модель User
model User {
    // ... существующие поля

    // Новые relations
    encryptionKey UserEncryptionKey?
    preKeys       PreKey[]
    oneTimePreKeys OneTimePreKey[]
}
```

## API Endpoints

### Encryption Keys

#### `POST /api/encryption/keys`
Регистрация ключей пользователя

**Request**:
```typescript
{
    identityKey: string;        // Публичный ключ идентичности
    signedPreKey: string;       // Подписанный prekey
    signedPreKeySig: string;    // Подпись signed prekey
    registrationId: number;     // ID регистрации
    preKeys: Array<{            // Prekeys (до 100)
        keyId: number;
        publicKey: string;
    }>;
    oneTimePreKeys: Array<{     // One-time prekeys (до 100)
        keyId: number;
        publicKey: string;
    }>;
}
```

**Response**: `{ success: boolean }`

#### `GET /api/encryption/keys/me`
Получение своих ключей

**Response**:
```typescript
{
    identityKey: string;
    signedPreKey: string;
    signedPreKeySig: string;
    registrationId: number;
    preKeys: Array<{
        keyId: number;
        publicKey: string;
    }>;
}
```

#### `PUT /api/encryption/keys/me`
Обновление ключей

**Request**: Аналогично POST, но можно обновлять частично

**Response**: `{ success: boolean }`

### PreKey Bundle

#### `GET /api/encryption/prekey-bundle/:userId`
Получение prekey bundle для пользователя (для обмена ключами)

**Response**:
```typescript
{
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
}
```

**Логика**:
- Возвращает signed prekey и identity key
- Если есть one-time prekey, возвращает его и помечает как использованный
- Если нет one-time prekey, возвращает обычный prekey

### One-Time PreKeys

#### `POST /api/encryption/one-time-prekeys`
Загрузка one-time prekeys

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

#### `GET /api/encryption/one-time-prekeys/count`
Получение количества доступных one-time prekeys

**Response**: `{ count: number }`

## Реализация

### Module: `modules/encryption/`

**Структура**:
```
modules/encryption/
├── encryption.module.ts
├── controllers/
│   └── encryption.controller.ts
├── services/
│   ├── encryption.service.ts
│   ├── prekey.service.ts
│   └── key-exchange.service.ts
├── repositories/
│   ├── encryption-key.repository.ts
│   └── prekey.repository.ts
├── dto/
│   ├── register-keys.dto.ts
│   ├── prekey-bundle.dto.ts
│   └── encryption-key.dto.ts
└── types/
    └── encryption.types.ts
```

### EncryptionService

**Методы**:

```typescript
// Регистрация ключей пользователя
async registerKeys(userId: string, dto: RegisterKeysDto): Promise<void>

// Получение ключей пользователя
async getKeys(userId: string): Promise<EncryptionKeyDto>

// Обновление ключей
async updateKeys(userId: string, dto: Partial<RegisterKeysDto>): Promise<void>

// Получение prekey bundle для обмена ключами
async getPreKeyBundle(userId: string, requesterId: string): Promise<PreKeyBundleDto>
```

### PreKeyService

**Методы**:

```typescript
// Загрузка prekeys
async uploadPreKeys(userId: string, preKeys: PreKeyDto[]): Promise<void>

// Загрузка one-time prekeys
async uploadOneTimePreKeys(userId: string, oneTimePreKeys: OneTimePreKeyDto[]): Promise<void>

// Получение prekey bundle
async getPreKeyBundle(userId: string): Promise<PreKeyBundleDto>

// Использование one-time prekey
async useOneTimePreKey(userId: string, keyId: number): Promise<void>

// Проверка количества one-time prekeys
async getOneTimePreKeyCount(userId: string): Promise<number>
```

### KeyExchangeService

**Методы**:

```typescript
// Получение prekey bundle для обмена
async getPreKeyBundleForExchange(
    userId: string,
    requesterId: string
): Promise<PreKeyBundleDto> {
    // 1. Получить identity key и signed prekey
    // 2. Попытаться получить one-time prekey (если есть)
    // 3. Если нет one-time prekey, использовать обычный prekey
    // 4. Пометить использованный one-time prekey
    // 5. Вернуть bundle
}
```

### Обновление MessageService

**Поддержка зашифрованных сообщений**:

```typescript
// В messages.service.ts
public async createMessage(
    senderId: string,
    dto: CreateMessageDto
): Promise<MessageDto> {
    // Сохраняем зашифрованный контент как есть
    // Сервер не расшифровывает
    const message = await this.repo.create({
        ...dto,
        senderId,
        content: dto.isEncrypted ? dto.encryptedContent : dto.content,
        isEncrypted: dto.isEncrypted || false,
    });

    return new MessageDto(message);
}
```

## Безопасность

### Принципы

1. **Сервер не расшифровывает**:
   - Сохраняем зашифрованный контент как есть
   - Не пытаемся расшифровать на сервере

2. **Хранение только публичных ключей**:
   - Сохраняем только публичные части ключей
   - Приватные ключи остаются на клиенте

3. **Защита от перехвата**:
   - Использовать HTTPS для всех запросов
   - Валидация подписей ключей
   - Защита от replay атак

4. **Очистка использованных ключей**:
   - Удалять использованные one-time prekeys
   - Периодическая очистка старых prekeys

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

### Опционально: Дополнительная безопасность через Signal Protocol

Если нужна **дополнительная безопасность** и **верификация участников**, можно интегрировать Signal Protocol для обмена ключами между участниками звонка:

1. **Обмен ключами перед звонком**:
   - Участники обмениваются ключами через Signal Protocol (как для чатов)
   - Верификация участников через fingerprint ключей

2. **Использование ключей Signal в LiveKit**:
   - Можно использовать ключи из Signal Protocol для дополнительной верификации
   - Но это опционально - LiveKit E2EE работает и без этого

**Реализация (опционально)**:

```typescript
// Если решим добавить обмен ключами для звонков
async generateTokenWithE2EE(
    roomName: string,
    participantIdentity: string,
    encryptionKeys?: EncryptionKeys // Опционально
): Promise<string> {
    // Токен генерируется так же
    // Ключи используются на клиенте для верификации
    const at = new AccessToken(this.apiKey, this.apiSecret, {
        identity: participantIdentity,
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });

    return at.toJwt();
}
```

### Итог

**Для LiveKit E2EE на Backend**:
- ✅ **Текущая реализация уже поддерживает E2EE** - ничего менять не нужно
- ✅ Токены работают одинаково для обычных и E2EE звонков
- ✅ Backend не участвует в шифровании медиа
- ⚠️ **Опционально**: можно добавить обмен ключами через Signal Protocol для дополнительной верификации участников

**Основная работа по E2EE для звонков**:
- 🔧 **На Frontend**: включение E2EE через `E2EEKeyProvider`
- 🔧 **На Frontend**: настройка `Room` с опцией `e2ee`
- ❌ **На Backend**: ничего дополнительного не требуется (для базовой поддержки)

## Миграции базы данных

### Prisma Schema: Encryption Models

**Добавить в `apps/api/prisma/schema.prisma`**:

```prisma
model UserEncryptionKey {
    id                String   @id @default(uuid())
    userId            String   @unique @map("user_id") @db.VarChar(255)
    identityKey       String   @map("identity_key") @db.Text
    signedPreKey      String   @map("signed_pre_key") @db.Text
    signedPreKeySig   String   @map("signed_pre_key_sig") @db.Text
    registrationId    Int      @map("registration_id")
    createdAt         DateTime @default(now()) @map("created_at")
    updatedAt         DateTime @updatedAt @map("updated_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
    @@map("user_encryption_keys")
}

model Prekey {
    id        String   @id @default(uuid())
    userId    String   @map("user_id") @db.VarChar(255)
    keyId     Int      @map("key_id")
    publicKey String   @map("public_key") @db.Text
    createdAt DateTime @default(now()) @map("created_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, keyId])
    @@index([userId])
    @@map("prekeys")
}

model OneTimePrekey {
    id        String    @id @default(uuid())
    userId    String    @map("user_id") @db.VarChar(255)
    keyId     Int       @map("key_id")
    publicKey String    @map("public_key") @db.Text
    createdAt DateTime  @default(now()) @map("created_at")
    usedAt    DateTime? @map("used_at")

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([userId, keyId])
    @@index([userId])
    @@index([usedAt])
    @@map("one_time_prekeys")
}
```

**Обновить модель User** (добавить relations):

```prisma
model User {
    // ... существующие поля

    // Encryption relations
    encryptionKey      UserEncryptionKey?
    prekeys           Prekey[]
    oneTimePrekeys    OneTimePrekey[]
}
```

**Обновить модель Message** (добавить поля для шифрования):

```prisma
model Message {
    // ... существующие поля

    isEncrypted      Boolean?  @default(false) @map("is_encrypted")
    encryptedContent String?   @map("encrypted_content") @db.Text

    @@index([isEncrypted])
}
```

**После добавления моделей выполнить**:

```bash
# Сгенерировать миграцию
npx prisma migrate dev --name add_encryption_tables

# Или создать миграцию вручную
npx prisma migrate dev --create-only --name add_encryption_tables
```

## Задачи

### Этап 1: База данных

- [ ] Создать Prisma модели для ключей шифрования
- [ ] Создать миграцию базы данных
- [ ] Обновить модель Message (добавить isEncrypted, encryptedContent)

### Этап 2: Модуль encryption

- [ ] Создать модуль `encryption`
- [ ] Создать EncryptionService
- [ ] Создать PreKeyService
- [ ] Создать репозитории для ключей

### Этап 3: API Endpoints

- [ ] Создать endpoints для регистрации ключей
- [ ] Создать endpoints для получения prekey bundle
- [ ] Создать endpoints для управления one-time prekeys
- [ ] Добавить валидацию DTOs

### Этап 4: Интеграция с сообщениями

- [ ] Обновить MessageService для поддержки зашифрованных сообщений
- [ ] Обновить DTOs сообщений
- [ ] Обновить WebSocket gateway (если нужно)

### Этап 5: Безопасность

- [ ] Реализовать валидацию подписей ключей
- [ ] Реализовать защиту от replay атак
- [ ] Реализовать очистку использованных ключей
- [ ] Добавить rate limiting для endpoints ключей

### Этап 6: Тестирование

- [ ] Unit тесты для сервисов
- [ ] Integration тесты для API endpoints
- [ ] Тесты безопасности

## Файлы для работы

- `apps/api/prisma/schema.prisma` - обновить схему
- Создать `apps/api/src/modules/encryption/` - новый модуль
- Обновить `apps/api/src/modules/messages/` - поддержка зашифрованных сообщений

## Связанные задачи

- [Frontend задача по сквозному шифрованию](../../frontend/tasks/end-to-end-encryption.md) - связанная frontend задача

## Примечания

- Сервер **не должен** иметь возможность расшифровать сообщения
- Хранить только публичные ключи
- Использовать проверенные криптографические библиотеки
- Следовать принципам Signal Protocol
- Обеспечить обратную совместимость с незашифрованными сообщениями
