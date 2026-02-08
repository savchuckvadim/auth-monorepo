# Очереди (Bull)

## Обзор

Проект использует **Bull** для создания и управления очередями задач на основе Redis. Используется для фоновых задач, таких как отправка email.

## Настройка

### Расположение

```
src/core/queue/
├── queue.module.ts           # Модуль очередей
├── queue-dispatcher.service.ts # Сервис для добавления задач
├── consts/
│   ├── queue-names.enum.ts   # Названия очередей
│   └── job-names.enum.ts     # Названия задач
└── dispatch/
    └── queue-dispatcher.service.ts
```

### Регистрация очередей

```typescript
@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const redisOptions = createRedisOptions(configService);
                return {
                    redis: redisOptions.url || redisOptions,
                };
            },
        }),
        BullModule.registerQueue(
            ...Object.values(QueueNames).map(name => ({ name })),
        ),
    ],
})
export class QueueModule {}
```

## Доступные очереди

### QueueNames

```typescript
export enum QueueNames {
    MAIL = 'mail',
    // Добавьте другие очереди здесь
}
```

### JobNames

```typescript
export enum JobNames {
    ACTIVATION_LINK = 'activation-link',
    // Добавьте другие задачи здесь
}
```

## Использование

### Добавление задачи в очередь

```typescript
@Injectable()
export class MailService {
    constructor(
        private readonly queueDispatcher: QueueDispatcherService,
    ) {}

    async sendActivationLink(data: EmailData) {
        await this.queueDispatcher.dispatch(
            QueueNames.MAIL,
            JobNames.ACTIVATION_LINK,
            data,
        );
    }
}
```

### Обработка задачи

```typescript
@Processor(QueueNames.MAIL)
export class MailProcessor {
    @Process(JobNames.ACTIVATION_LINK)
    async handleActivationLink(job: Job<EmailData>) {
        const { email, name, activationLink } = job.data;

        // Отправка email
        await this.mailService.sendEmail({
            to: email,
            subject: 'Activation',
            html: `...`,
        });
    }
}
```

## QueueDispatcherService

**Расположение**: `core/queue/dispatch/queue-dispatcher.service.ts`

Сервис для добавления задач в очереди:

```typescript
@Injectable()
export class QueueDispatcherService {
    async dispatch<T>(
        queueName: QueueNames,
        jobName: JobNames,
        data: any,
        jobId?: string,
    ): Promise<Job<T>> {
        const queue = this.getQueue(queueName);
        return await queue.add(jobName, data, { jobId });
    }
}
```

## Пример: Отправка Email

### 1. Добавление задачи

```typescript
// modules/auth/services/auth.service.ts
await this.mailService.activationLink({
    email: user.email,
    name: user.name,
    activationLink: activationLink
});
```

### 2. Обработка задачи

```typescript
// modules/mail/queue/mail.processor.ts
@Processor(QueueNames.MAIL)
export class MailProcessor {
    @Process(JobNames.ACTIVATION_LINK)
    async handleActivationLink(job: Job<EmailData>) {
        // Отправка email
    }
}
```

## Настройки задач

### Retry (повторные попытки)

```typescript
await queue.add('job-name', data, {
    attempts: 3, // Количество попыток
    backoff: {
        type: 'exponential',
        delay: 2000,
    },
});
```

### Приоритет

```typescript
await queue.add('job-name', data, {
    priority: 10, // Высокий приоритет
});
```

### Задержка

```typescript
await queue.add('job-name', data, {
    delay: 5000, // Задержка 5 секунд
});
```

## Мониторинг

### Bull Board (опционально)

Можно добавить Bull Board для визуального мониторинга очередей:

```typescript
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';

BullBoardModule.forRoot({
    route: '/admin/queues',
});
```

## Best Practices

1. **Используйте типизацию** для данных задач
2. **Обрабатывайте ошибки** в процессорах
3. **Логируйте** выполнение задач
4. **Устанавливайте лимиты** на количество попыток
5. **Мониторьте очереди** в production

## Ссылки

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [NestJS Bull Module](https://docs.nestjs.com/techniques/queues)
