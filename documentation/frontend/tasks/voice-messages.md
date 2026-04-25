# Аудиосообщения

## Назначение

Добавить возможность отправлять аудиосообщения (голосовые сообщения) в посты и сообщения.

## Требования

- Быстрая запись аудиосообщения (удержание кнопки)
- Автоматическая отправка после записи
- Превью перед отправкой (опционально)
- Ограничение по длительности

## Отличия от аудиозаписей

- Аудиосообщения - короткие (до 1 минуты), быстрая запись и отправка
- Аудиозаписи - полноценные треки (до 5 минут), с возможностью редактирования

## Архитектура FSD

### Feature: `modules/features/voice-message/`

**Структура**:
```
features/voice-message/
├── index.ts
├── ui/
│   ├── VoiceMessageRecorder.tsx        # Компонент записи голосового сообщения
│   ├── VoiceMessageButton.tsx          # Кнопка для записи (удержание)
│   └── VoiceMessagePlayer.tsx          # Плеер для прослушивания голосовых сообщений
├── lib/
│   ├── hook/
│   │   ├── useVoiceMessage.hook.ts      # Хук для записи голосового сообщения
│   │   └── useVoiceMessagePlayback.hook.ts  # Хук для воспроизведения
│   └── utils/
│       └── voice-message.utils.ts       # Утилиты для работы с голосовыми сообщениями
└── model/
    └── slice/
        └── VoiceMessageSlice.ts         # Redux slice для состояния записи
```

## Детальная реализация

### 1. useVoiceMessage hook

```typescript
const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
    audioBlob,
    audioUrl,
    sendVoiceMessage
} = useVoiceMessage();
```

### 2. Ограничения

- Максимальная длительность: 1 минута (60 секунд)
- Формат: OGG (для лучшего сжатия)
- Качество: 32 kbps (достаточно для речи)
- Автоматическая отправка после записи (или по кнопке "Отправить")

### 3. UI компоненты

#### VoiceMessageButton (для сообщений)

- Иконка микрофона
- При нажатии и удержании - начинается запись
- Показывает индикатор записи (анимация)
- Показывает длительность записи
- При отпускании - останавливается запись
- Показывает превью с кнопками "Отправить" и "Отменить"

#### VoiceMessageRecorder (для постов)

- Кнопка "Записать голосовое сообщение"
- При нажатии начинается запись
- Показывает таймер и визуальную индикацию записи
- Кнопки "Остановить", "Отправить", "Отменить"

### 4. Интеграция в ChatInput

- Добавить кнопку микрофона рядом с полем ввода
- При удержании кнопки - запись
- При отпускании - показ превью и отправка

### 5. Интеграция в CreatePost

- Добавить опцию "Голосовое сообщение" в форму
- Показывать VoiceMessageRecorder
- После записи добавлять к посту

### 6. Отображение голосовых сообщений

- В сообщениях: показывать как специальный тип сообщения
- В постах: показывать как вложение
- VoiceMessagePlayer для прослушивания
- Показывать длительность и автора

## Backend требования

- [ ] API endpoint для загрузки голосовых сообщений
- [ ] Валидация длительности на backend (максимум 60 секунд)
- [ ] Хранение голосовых сообщений
- [ ] Обновление схемы БД для постов и сообщений (добавить поле voiceMessageUrl или type: 'voice')

## Файлы для работы

- Создать `modules/features/voice-message/`
- Обновить `modules/features/post/CreatePost/` - добавить поддержку голосовых сообщений
- Обновить `modules/widgetes/chat/ChatInputWidget/` - добавить кнопку микрофона
- Обновить компоненты отображения сообщений - добавить поддержку голосовых сообщений
- Backend: создать endpoint для загрузки голосовых сообщений
- Backend: обновить DTO для постов и сообщений

## Реализация (итерация 8, 2026-04)

Волна `messenger-features-expansion` закрыла голосовые сообщения для чатов
(посты — по-прежнему follow-up). Без Redux, через React Query.

### Что готово

- `apps/front/modules/entities/messages/lib/hooks/useVoiceRecorder.ts` —
  `MediaRecorder` + `AnalyserNode` для сбора пиков (RMS). Автостоп по
  `MAX_DURATION_MS=60_000`. Лицензионный blob `audio/webm;codecs=opus`,
  сжатие даёт ~24 kbps.
- `apps/front/modules/widgets/chat/chat-current/ChatInputWidget/VoiceRecordButton.tsx`
  — hold-to-record: `pointerdown` старт, `pointerup` отправляет blob в
  `useUploadMessageAttachment` с `kind=VOICE`, `durationMs`, `waveform`. На
  `pointerleave`/ESC — отмена.
- `apps/front/modules/entities/messages/ui/VoiceMessage/VoiceMessagePlayer.tsx`
  — play/pause + простой equalizer-style bar-chart (24 бара из peaks),
  таймер mm:ss.
- Рендерятся через `MessageAttachmentList` как отдельный kind `VOICE`.

### Отличия от исходной спеки

- Нет `VoiceMessageSlice` / Redux — вся запись live-state в `useVoiceRecorder`,
  upload — через React Query. Это консистентно с остальным мессенджером.
- Формат — `audio/webm`, не OGG (поддержка Safari 17+ из коробки).
- Пока нет интеграции в `CreatePost` — это остаётся follow-up, паттерн
  переиспользуемый.

### Известные ограничения

- Safari &lt; 17.4 не поддерживает `MediaRecorder` с webm — нужен polyfill
  (`opus-recorder`) в будущей волне.
- Waveform рассчитывается на клиенте и сохраняется как JSON peaks, сервер
  не перегенерирует.
