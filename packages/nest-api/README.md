# @workspace/nest-api

TypeScript API-клиент (Orval + axios + `customAxios` из `src/lib/back-api.ts`).

## Генерация — только из OpenAPI, без правок `src/generated/**` вручную

1. В **apps/api** добавьте или измените DTO/контроллеры и декораторы Swagger (`@ApiProperty`, `@ApiOkResponse`, и т.д.).
2. Поднимите API (по умолчанию `http://localhost:3000`), чтобы был доступен спецификация: `GET http://localhost:3000/docs/api-json`.
3. Из этой папки выполните:

```bash
pnpm run generate
```

Скрипт вызывает [Orval](https://orval.dev/) и перезаписывает `src/generated/`. Любые ручные правки в сгенерированных файлах будут потеряны при следующем запуске.
