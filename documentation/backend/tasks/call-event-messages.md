# Call event messages (`MessageType.CALL_EVENT`)

Замена plain-text системных сообщений о звонках на структурированные события.

## Состояние: ✅ бэк, ✅ web

## Схема

- `MessageType` расширен значением `CALL_EVENT`.
- `Message.metadata: Json?` — хранит payload события.

Payload:

```ts
interface CallEventMetadata {
  callId: string;
  type: 'AUDIO' | 'VIDEO';
  direction: 'INCOMING' | 'OUTGOING';
  status: 'MISSED' | 'DECLINED' | 'ENDED' | 'FAILED';
  initiatorId: string;
  receiverId?: string | null;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
}
```

## Где создаётся

`CallsGateway.createCallHistorySystemMessage` — после `end-call`, `decline`,
`miss-timeout`. Ранее писал `type=SYSTEM, content="Пропущенный звонок"`.
Теперь — `type=CALL_EVENT, metadata=...`, `content` пишем fallback-строку для
старых клиентов.

## Клиент

`CallEventNotice` (web): выбирает иконку/цвет/текст по `metadata.status` и
`direction`. Missed у получателя — красная иконка, outgoing ended — серая
стрелка. Для группового чата — всегда audio с `status=ENDED` (групповые
call-событий missed у нас нет).

## Совместимость

- Старые сообщения `SYSTEM` рендерятся как раньше (без иконки).
- Новые — обязательно имеют `metadata`. `CallEventNotice` рендерит fallback
  `content`, если `metadata` отсутствует.
