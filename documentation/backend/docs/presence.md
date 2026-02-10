# Presence (Backend)

## Обзор

Система Presence отслеживает онлайн/оффлайн статус пользователей в реальном времени с использованием Redis и WebSocket.

## Архитектура

### Компоненты

1. **PresenceService** (`src/modules/presence/service/presence.service.ts`)
   - Управляет presence в Redis
   - Использует TTL (Time To Live) для автоматического определения оффлайн статуса

2. **PresenceGateway** (`src/modules/presence/socket/presence.getway.ts`)
   - WebSocket gateway для presence событий
   - Обрабатывает подключения/отключения клиентов

## Redis структура

### Ключи

- Формат: `presence:user:${userId}`
- Значение: `'1'` (просто маркер наличия)
- TTL: 60 секунд

### Подписка на события истечения

```typescript
// Настройка Redis для отправки событий истечения ключей
await redis.config('SET', 'notify-keyspace-events', 'Ex');

// Подписка на события истечения
const expiredSubscriber = redis.duplicate();
await expiredSubscriber.psubscribe('__keyevent@0__:expired');

expiredSubscriber.on('pmessage', (pattern, channel, key) => {
    if (key.startsWith('presence:user:')) {
        const userId = key.replace('presence:user:', '');
        // Отправляем событие offline
    }
});
```

## Методы PresenceService

### markOnline(userId: string): Promise<boolean>

Помечает пользователя как онлайн.

**Логика**:
- Использует `SET key value EX TTL NX`
- `NX` - только если ключа нет (не перезаписывает существующий)
- Возвращает `true` если пользователь стал онлайн (был offline)

**Пример**:
```typescript
const becameOnline = await presenceService.markOnline(userId);
if (becameOnline) {
    // Пользователь только что стал онлайн
}
```

### refresh(userId: string): Promise<void>

Продлевает TTL для пользователя (обновляет время онлайн).

**Логика**:
- Использует `SET key value EX TTL` (без NX)
- Всегда обновляет ключ, даже если он существует
- Используется при получении ping от клиента

**Пример**:
```typescript
// Каждые 25 секунд от клиента
await presenceService.refresh(userId);
```

### markOffline(userId: string): Promise<boolean>

Помечает пользователя как оффлайн.

**Логика**:
- Удаляет ключ из Redis
- Возвращает `true` если пользователь был online

**Пример**:
```typescript
const wasOnline = await presenceService.markOffline(userId);
if (wasOnline) {
    // Отправляем событие offline всем клиентам
}
```

### isOnline(userId: string): Promise<boolean>

Проверяет, онлайн ли пользователь.

**Логика**:
- Проверяет существование ключа в Redis

**Пример**:
```typescript
const isOnline = await presenceService.isOnline(userId);
```

### getOnlineUsers(userIds: string[]): Promise<Set<string>>

Получает список онлайн пользователей из массива userIds.

**Логика**:
- Использует Redis pipeline для эффективной проверки
- Возвращает Set с ID онлайн пользователей

**Пример**:
```typescript
const onlineUsers = await presenceService.getOnlineUsers(['user1', 'user2', 'user3']);
// Set { 'user1', 'user3' }
```

### getAllOnlineUsers(): Promise<string[]>

Получает список всех онлайн пользователей.

**Логика**:
- Использует `KEYS presence:user:*` для получения всех ключей
- Извлекает userId из ключей

**Внимание**: `KEYS` может быть медленным на больших базах. Для продакшена лучше использовать `SCAN`.

**Пример**:
```typescript
const allOnlineUsers = await presenceService.getAllOnlineUsers();
// ['user1', 'user2', 'user3', ...]
```

## PresenceGateway

### WebSocket события

#### handleConnection(client: Socket)

Обрабатывает подключение клиента.

**Поток**:
1. Получает `userId` из `client.handshake.query.userId`
2. Вызывает `markOnline(userId)`
3. Отправляет `presence:online` всем клиентам
4. Отправляет `presence:bulk-online` новому клиенту со списком всех онлайн пользователей

**Пример события**:
```typescript
// Отправляется всем клиентам
server.emit('presence:online', { userId: 'user123' });

// Отправляется только новому клиенту
client.emit('presence:bulk-online', {
    users: ['user1', 'user2', 'user3']
});
```

#### handleDisconnect(client: Socket)

Обрабатывает отключение клиента.

**Поток**:
1. Получает `userId` из `client.handshake.query.userId`
2. Вызывает `markOffline(userId)`
3. Если пользователь был online, отправляет `presence:offline` всем клиентам

**Пример события**:
```typescript
server.emit('presence:offline', { userId: 'user123' });
```

#### @SubscribeMessage('presence:ping')

Обрабатывает ping от клиента.

**Поток**:
1. Получает `userId` из `client.handshake.query.userId`
2. Проверяет, был ли пользователь онлайн до ping
3. Вызывает `refresh(userId)` для продления TTL
4. Если ключ был истек, но пользователь все еще подключен, отправляет `presence:online`

**Пример**:
```typescript
// Клиент отправляет каждые 25 секунд
socket.emit('presence:ping');
```

## Поток работы

### 1. Подключение пользователя

```
Клиент подключается к WebSocket
→ handleConnection вызывается
→ markOnline(userId) создает ключ в Redis с TTL 60 сек
→ Сервер отправляет presence:online всем клиентам
→ Сервер отправляет presence:bulk-online новому клиенту
```

### 2. Поддержание онлайн статуса

```
Клиент отправляет presence:ping каждые 25 секунд
→ refresh(userId) обновляет TTL ключа (60 сек)
→ Если ping не приходит 60 секунд, ключ истекает
```

### 3. Истечение TTL

```
Redis ключ истекает (60 секунд без ping)
→ Redis отправляет событие expired через keyspace events
→ PresenceService получает событие через подписку
→ PresenceGateway отправляет presence:offline всем клиентам
```

### 4. Отключение пользователя

```
Клиент отключается от WebSocket
→ handleDisconnect вызывается
→ markOffline(userId) удаляет ключ из Redis
→ Сервер отправляет presence:offline всем клиентам
```

## Конфигурация

### Переменные окружения

Не требуются специальные переменные для presence. Используется общий Redis.

### Redis настройки

```typescript
// В PresenceService.onModuleInit()
await redis.config('SET', 'notify-keyspace-events', 'Ex');
```

`Ex` означает:
- `E` - включить keyspace events
- `x` - включить expired events

## Производительность

### Оптимизации

1. **Pipeline для массовых проверок**:
   ```typescript
   const pipeline = redis.pipeline();
   userIds.forEach(id => pipeline.exists(this.key(id)));
   const result = await pipeline.exec();
   ```

2. **Отдельное подключение для подписки**:
   ```typescript
   const expiredSubscriber = redis.duplicate();
   // Избегает блокировки основного подключения
   ```

### Ограничения

1. **KEYS команда**: `getAllOnlineUsers()` использует `KEYS`, что может быть медленно на больших базах. Для продакшена лучше использовать `SCAN`.

2. **TTL**: 60 секунд - баланс между точностью и нагрузкой. Можно настроить под требования.

3. **Ping интервал**: 25 секунд - баланс между точностью и нагрузкой на сервер.

## Мониторинг

### Метрики для отслеживания

- Количество онлайн пользователей
- Частота ping событий
- Количество expired событий
- Время отклика Redis операций

### Логирование

```typescript
console.log(`🟢 User ${userId} became online`);
console.log(`🔴 Presence expired for user: ${userId}`);
console.log(`📤 Sending ${allOnlineUsers.length} online users to new client`);
```
