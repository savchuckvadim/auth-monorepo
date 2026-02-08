# Redis

## Обзор

Redis используется в проекте для:
- **Кэширования данных**
- **Очередей Bull** (фоновые задачи)
- **Хранения сессий** (если нужно)

## Настройка

### Расположение

```
src/core/redis/
├── redis.module.ts      # Модуль Redis
├── redis.service.ts      # Сервис для работы с Redis
└── redis.config.ts      # Конфигурация
```

### Переменные окружения

```env
REDIS_HOST=localhost
REDIS_PORT=6334
# Или
REDIS_URL=redis://localhost:6334
```

### Docker Compose

В development используется Docker Compose:

```yaml
redis-auth-monorepo:
    image: redis:7
    ports:
        - "6334:6379"
```

## RedisService

**Расположение**: `core/redis/redis.service.ts`

Глобальный сервис для работы с Redis:

```typescript
@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: Redis;

    constructor(private readonly configService: ConfigService) {
        // Создание клиента
        this.client = new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        });
    }

    getClient(): Redis {
        return this.client;
    }
}
```

### Использование

```typescript
@Injectable()
export class SomeService {
    constructor(
        private readonly redis: RedisService,
    ) {}

    async cacheData(key: string, value: string) {
        const client = this.redis.getClient();
        await client.set(key, value, 'EX', 3600); // TTL 1 час
    }

    async getCachedData(key: string) {
        const client = this.redis.getClient();
        return await client.get(key);
    }
}
```

## Использование в Bull

Redis используется как хранилище для очередей Bull. Подробнее см. [Документацию по очередям](./queues.md).

## Best Practices

1. **Устанавливайте TTL** для кэшированных данных
2. **Используйте префиксы** для ключей (например: `user:123`)
3. **Обрабатывайте ошибки** подключения
4. **Закрывайте соединение** при завершении модуля

## Ссылки

- [Redis Documentation](https://redis.io/docs/)
- [ioredis Documentation](https://github.com/redis/ioredis)
