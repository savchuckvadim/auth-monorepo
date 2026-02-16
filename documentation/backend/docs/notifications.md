# Уведомления (Backend)

## Обзор

Система уведомлений оповещает пользователей о новых событиях через WebSocket. Уведомления отправляются только когда пользователь не находится в соответствующем контексте (например, не открыт чат для сообщений).

## Архитектура

### Компоненты

1. **NotificationsGateway** (`src/modules/notifications/notifications.gateway.ts`)
   - WebSocket gateway для уведомлений
   - Namespace: `/notifications`
   - Управляет подключениями пользователей
   - Отправляет уведомления в комнаты пользователей

2. **Интеграция с другими модулями**:
   - `MessagesGateway` - отправляет уведомления о новых сообщениях
   - `PostsGateway` - отправляет уведомления о новых постах (через основной socket)

## NotificationsGateway

### WebSocket подключение

**Namespace**: `/notifications`

**Аутентификация**:
- Получает `userId` из `client.handshake.query.userId`
- TODO: Должно получать из JWT токена

### Структура комнат

- `user:${userId}` - комната для уведомлений конкретного пользователя
- Все сокеты пользователя автоматически присоединяются к этой комнате

### Методы

#### notifyNewMessage(userId: string, message: object)

Отправляет уведомление о новом сообщении.

**Параметры**:
```typescript
userId: string;
message: {
    id: string;
    chatId: string;
    content: string;
    sender: { name: string };
}
```

**Логика**:
- Отправляет событие `notification:new-message` в комнату `user:${userId}`
- Все сокеты пользователя получают уведомление

**Пример**:
```typescript
notificationsGateway.notifyNewMessage('user123', {
    id: 'msg456',
    chatId: 'chat789',
    content: 'Привет!',
    sender: { name: 'Иван' }
});
```

**Событие на клиенте**:
```typescript
{
    type: 'new-message',
    message: {
        id: 'msg456',
        chatId: 'chat789',
        content: 'Привет!',
        sender: { name: 'Иван' }
    },
    timestamp: '2024-01-01T12:00:00.000Z'
}
```

#### notifyNewFollower(userId: string, follower: object)

Отправляет уведомление о новом подписчике.

**Параметры**:
```typescript
userId: string;
follower: {
    id: string;
    name: string;
    email: string;
}
```

**Пример**:
```typescript
notificationsGateway.notifyNewFollower('user123', {
    id: 'user456',
    name: 'Петр',
    email: 'petr@example.com'
});
```

**Событие на клиенте**:
```typescript
{
    type: 'new-follower',
    follower: {
        id: 'user456',
        name: 'Петр',
        email: 'petr@example.com'
    },
    timestamp: '2024-01-01T12:00:00.000Z'
}
```

## Интеграция с MessagesGateway

### Отправка уведомлений о сообщениях

В `MessagesGateway.broadcastMessage()`:

```typescript
// Отправляем уведомления участникам, которые не в чате
chatMembers.forEach(member => {
    if (member.userId !== senderId) {
        // Проверяем, находится ли пользователь в комнате чата
        // Если не в комнате - отправляем уведомление
        const isInChatRoom = /* проверка через Socket.IO комнаты */;

        if (!isInChatRoom) {
            this.notificationsGateway.notifyNewMessage(member.userId, {
                id: message.id,
                chatId: chatId,
                content: message.content,
                sender: message.sender || { name: 'Пользователь' },
            });
        }
    }
});
```

**Логика**:
1. При отправке сообщения проверяются все участники чата
2. Для каждого участника (кроме отправителя) проверяется, открыт ли у него чат
3. Если чат не открыт, отправляется уведомление через `NotificationsGateway`
4. Если чат открыт, уведомление не отправляется (сообщение уже видно)

### Проверка открытости чата

**Варианты реализации**:

1. **Через комнаты Socket.IO**:
   ```typescript
   const isInChatRoom = socket.rooms.has(`chat:${chatId}`);
   ```

2. **Через отдельный сервис**:
   ```typescript
   const isInChatRoom = await this.chatService.isUserInChat(userId, chatId);
   ```

## Интеграция с постами

### Уведомления о новых постах

Посты отправляются через основной socket (не через NotificationsGateway):

```typescript
// В PostService или PostGateway
server.emit('post:created', postData);
```

**Причина**: Уведомления о постах обрабатываются на клиенте и создаются локально в Redux, а не через отдельный WebSocket namespace.

## Поток работы

### 1. Подключение клиента

```
Клиент подключается к /notifications namespace
→ handleConnection вызывается
→ userId получается из query параметров
→ Клиент присоединяется к комнате user:${userId}
→ Сокет сохраняется в Map для отслеживания
```

### 2. Новое сообщение

```
Пользователь отправляет сообщение
→ MessagesGateway.broadcastMessage вызывается
→ Проверяется, открыт ли чат у получателя
→ Если чат не открыт:
  → NotificationsGateway.notifyNewMessage вызывается
  → Уведомление отправляется в комнату user:${userId}
  → Все сокеты пользователя получают событие notification:new-message
```

### 3. Новый подписчик

```
Пользователь подписывается на другого пользователя
→ FollowService создает подписку
→ NotificationsGateway.notifyNewFollower вызывается
→ Уведомление отправляется в комнату user:${userId}
```

### 4. Отключение клиента

```
Клиент отключается от /notifications namespace
→ handleDisconnect вызывается
→ Сокет удаляется из Map
→ Клиент автоматически покидает комнату user:${userId}
```

## Структура данных

### Уведомление о сообщении

```typescript
{
    type: 'new-message',
    message: {
        id: string;
        chatId: string;
        content: string;
        sender: {
            name: string;
        };
    },
    timestamp: string; // ISO 8601
}
```

### Уведомление о подписчике

```typescript
{
    type: 'new-follower',
    follower: {
        id: string;
        name: string;
        email: string;
    },
    timestamp: string; // ISO 8601
}
```

## Управление подключениями

### Хранение сокетов

```typescript
private readonly socketToUserId = new Map<string, string>();
private readonly userIdToSockets = new Map<string, Set<string>>();
```

**Логика**:
- `socketToUserId` - маппинг socket.id → userId
- `userIdToSockets` - маппинг userId → Set<socket.id>
- Позволяет отслеживать все сокеты пользователя

### Подключение

```typescript
async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    // Сохраняем маппинги
    this.socketToUserId.set(client.id, userId);

    if (!this.userIdToSockets.has(userId)) {
        this.userIdToSockets.set(userId, new Set());
    }
    this.userIdToSockets.get(userId)!.add(client.id);

    // Присоединяем к комнате
    client.join(`user:${userId}`);
}
```

### Отключение

```typescript
handleDisconnect(client: Socket) {
    const userId = this.socketToUserId.get(client.id);

    if (userId) {
        const sockets = this.userIdToSockets.get(userId);
        if (sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.userIdToSockets.delete(userId);
            }
        }
        this.socketToUserId.delete(client.id);
    }
}
```

## Безопасность

### Текущая реализация

- `userId` получается из query параметров
- Нет проверки JWT токена
- Нет проверки прав доступа

### TODO

- [ ] Получать `userId` из JWT токена
- [ ] Проверять права доступа перед отправкой уведомлений
- [ ] Валидировать данные перед отправкой

## Производительность

### Оптимизации

1. **Использование комнат Socket.IO**:
   - Эффективная доставка уведомлений
   - Автоматическое управление подписками

2. **Проверка открытости чата**:
   - Избегает отправки уведомлений, когда они не нужны
   - Снижает нагрузку на клиент

### Ограничения

1. **Множественные подключения**: Один пользователь может иметь несколько открытых вкладок/устройств
2. **Масштабируемость**: При горизонтальном масштабировании нужен Redis adapter для Socket.IO

## Мониторинг

### Метрики для отслеживания

- Количество активных подключений к /notifications
- Количество отправленных уведомлений
- Время отклика отправки уведомлений
- Количество уведомлений по типам

### Логирование

```typescript
console.log(`Notification socket connected: ${client.id} (user: ${userId})`);
console.log(`Notification socket disconnected: ${client.id}`);
```
