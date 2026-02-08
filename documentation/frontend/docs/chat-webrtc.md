# Чат и WebRTC

## Обзор

В проекте реализованы два типа чатов:
1. **Обычные чаты** - через WebSocket и REST API
2. **Секретные чаты** - через WebRTC для P2P соединения

## Обычные чаты

### Архитектура

Обычные чаты работают через:
- **REST API** - для получения истории сообщений, отправки сообщений
- **WebSocket (Socket.IO)** - для real-time обновлений

### Компоненты

- `entities/chats` - работа с чатами
- `entities/messages` - работа с сообщениями
- `widgetes/chat` - UI виджеты для чатов

### Поток работы

1. **Получение списка чатов**: REST API → `useUserChats()`
2. **Открытие чата**: REST API → `useChatMessages(chatId)`
3. **Отправка сообщения**: REST API → `useSendMessage()`
4. **Real-time обновления**: WebSocket → автоматическое обновление через `useChatSocket()`

### WebSocket события

- `message:new` - новое сообщение
- `message:update` - обновление сообщения
- `chat:update` - обновление чата
- `chat:new` - новый чат

---

## Секретные чаты (WebRTC)

### Назначение

Секретные чаты используют **WebRTC** для создания прямого P2P соединения между пользователями, что обеспечивает:
- **Шифрование** - данные передаются напрямую между пользователями
- **Приватность** - сообщения не проходят через сервер
- **Безопасность** - только участники чата могут видеть сообщения

### Архитектура WebRTC

WebRTC использует:
- **STUN серверы** - для определения публичного IP адреса
- **TURN серверы** (опционально) - для обхода NAT
- **Signaling** - для обмена SDP (Session Description Protocol) через WebSocket

### Компоненты

#### 1. PeerService

**Расположение**: `modules/shared/lib/webrtc/peer-service.ts`

**Назначение**: Управление RTCPeerConnection

**Методы**:
```typescript
class PeerService {
    get connection(): RTCPeerConnection | null
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>
    getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>
    getOffer(): Promise<RTCSessionDescriptionInit>
    toggleAudio(): void
    toggleVideo(): void
    addTrack(track: MediaStreamTrack, stream: MediaStream): void
    close(): void
    recreate(): void
    isAudioEnabled(): boolean
    isVideoEnabled(): boolean
}
```

#### 2. WebRTC Config

**Расположение**: `modules/shared/lib/webrtc/webrtc.config.ts`

**Конфигурация**:
```typescript
export const WEBRTC_CONFIG: RTCConfiguration = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:global.stun.twilio.com:3478',
            ],
        },
    ],
};
```

### Поток установления соединения

#### 1. Инициация звонка (Caller)

```
1. Caller создает RTCPeerConnection
2. Caller добавляет медиа треки (аудио/видео)
3. Caller создает offer через createOffer()
4. Caller устанавливает local description
5. Caller отправляет offer через WebSocket другому пользователю
```

#### 2. Принятие звонка (Callee)

```
1. Callee получает offer через WebSocket
2. Callee создает RTCPeerConnection
3. Callee устанавливает remote description (offer)
4. Callee добавляет медиа треки
5. Callee создает answer через createAnswer()
6. Callee устанавливает local description
7. Callee отправляет answer через WebSocket Caller'у
```

#### 3. Завершение установки

```
1. Caller получает answer через WebSocket
2. Caller устанавливает remote description (answer)
3. ICE candidates обмениваются через WebSocket
4. Соединение устанавливается (ICE connection)
5. Медиа потоки начинают передаваться
```

### Код примера

```typescript
// Инициация звонка
const peerService = new PeerService();

// Получаем медиа потоки
const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
});

// Добавляем треки
stream.getTracks().forEach(track => {
    peerService.addTrack(track, stream);
});

// Создаем offer
const offer = await peerService.getOffer();

// Отправляем offer через WebSocket
socket.emit('webrtc:offer', { offer, to: userId });

// Получаем answer
socket.on('webrtc:answer', async ({ answer }) => {
    await peerService.setRemoteDescription(answer);
});

// Получаем ICE candidates
socket.on('webrtc:ice-candidate', async ({ candidate }) => {
    if (peerService.connection) {
        await peerService.connection.addIceCandidate(candidate);
    }
});
```

### WebSocket события для WebRTC

- `webrtc:offer` - отправка/получение offer
- `webrtc:answer` - отправка/получение answer
- `webrtc:ice-candidate` - обмен ICE candidates
- `webrtc:end` - завершение соединения

### Состояния соединения

RTCPeerConnection имеет несколько состояний:

- `new` - создано, но еще не настроено
- `have-local-offer` - установлен local offer
- `have-remote-offer` - установлен remote offer
- `have-local-pranswer` - установлен local pranswer
- `have-remote-pranswer` - установлен remote pranswer
- `stable` - соединение установлено

### Обработка ошибок

```typescript
peerService.connection?.addEventListener('iceconnectionstatechange', () => {
    const state = peerService.connection?.iceConnectionState;

    if (state === 'failed') {
        // Соединение не удалось установить
        console.error('ICE connection failed');
    } else if (state === 'disconnected') {
        // Соединение разорвано
        console.warn('ICE connection disconnected');
    } else if (state === 'connected') {
        // Соединение установлено
        console.log('ICE connection established');
    }
});
```

---

## Переход на LiveKit

### Текущее состояние

В проекте есть тестовая страница `/network/calls` для проверки работы LiveKit:
- `app/network/calls/page.tsx` - тестовая страница
- `modules/features/call/ui/LiveKitTest.tsx` - тестовый компонент

### Задача

Необходимо перевести чаты с WebRTC на LiveKit для:
- Лучшей стабильности соединений
- Упрощения настройки (не нужны STUN/TURN серверы)
- Масштабируемости (поддержка групповых звонков)
- Готовых UI компонентов

### LiveKit компоненты

```typescript
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';

export const VideoCall = ({ token }: { token: string }) => {
    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={LIVEKIT_URL}
            connect={true}
        >
            <VideoConference />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
};
```

### Получение токена LiveKit

```typescript
import { getCalls } from '@workspace/nest-api';

const api = getCalls();
const { token } = await api.callsGetToken({
    roomName: 'chat-123',
    userId: currentUser.id
});
```

---

## Сравнение подходов

| Аспект | WebRTC (текущий) | LiveKit (целевой) |
|--------|------------------|-------------------|
| **Настройка** | Сложная (STUN/TURN) | Простая (только токен) |
| **Стабильность** | Зависит от NAT | Высокая |
| **Масштабируемость** | Только P2P | Групповые звонки |
| **UI компоненты** | Нужно делать самому | Готовые компоненты |
| **Сервер** | Не нужен | Нужен LiveKit сервер |

---

## Документация

- [WebRTC MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [LiveKit Docs](https://docs.livekit.io/)
- [PeerService код](./modules/shared/lib/webrtc/peer-service.ts)
