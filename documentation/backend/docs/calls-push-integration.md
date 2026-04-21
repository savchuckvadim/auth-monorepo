# Звонки и mobile push: статус интеграции

Краткий чеклист по внедрению **FCM**, **APNS**, **VoIP push** и связке со **звонками** и **сообщениями** при офлайн-клиенте. Подробное описание провайдеров, моделей `PushDevice` и сценариев отправки см. в **[Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md)**.

## Сделано

- Сущности и enum в Prisma для push-устройств и причин завершения звонка.
- API регистрации устройств для push:
  - `POST /api/notifications/devices/register`
  - `POST /api/notifications/devices/deactivate`
  - `GET /api/notifications/devices`
- Расширение API звонков: `GET /api/calls/chat/:chatId/history`.
- `CallsGateway` для сигналинга и совместимости с веб-клиентом.
- Fallback для мобильных клиентов в сигналинге:
  - входящий звонок, если получатель офлайн → **VoIP push**;
  - новое сообщение, если нет активного сокета мессенджера → **обычный push** (FCM / APNS).
- Системные записи таймлайна звонка для не-секретных чатов (по текущей логике модуля).
- Реализация провайдеров push (**FCM** / **APNS** / **APNS VoIP**) с учётными данными из окружения.

## Осталось

- Прописать реальные credentials в `.env` и проверить доставку на устройствах.
- Прогнать сквозные сценарии:
  - звонок web → web;
  - звонок web → mobile;
  - входящий звонок в mobile в фоне / после убийства процесса;
  - push при офлайн-сообщении.
- При разработке мобильного клиента выровнять источник OpenAPI для Orval с локальным backend (`ORVAL_INPUT`).
- По желанию: усилить тесты, убрать lint-suppressions в spec-файлах.

## Переменные окружения (сводка)

| Область | Переменные |
|--------|------------|
| FCM | `FCM_SERVICE_ACCOUNT_JSON` или `FCM_SERVICE_ACCOUNT_PATH` |
| APNS (alert) | `APNS_KEY` или `APNS_KEY_PATH`, `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_BUNDLE_ID` |
| APNS VoIP (опционально отдельный ключ) | `APNS_VOIP_KEY` или `APNS_VOIP_KEY_PATH`, `APNS_VOIP_KEY_ID`, `APNS_VOIP_TEAM_ID`, `APNS_VOIP_TOPIC` |

Расшифровка и поведение см. в [Signal E2EE и mobile push](./encryption/signal-e2ee-and-mobile-push.md).

## См. также

- [Уведомления (WebSocket и push)](./notifications.md)
- [Модули: calls, notifications](./modules.md)
