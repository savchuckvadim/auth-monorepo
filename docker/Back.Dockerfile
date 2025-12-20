FROM node:20-slim

WORKDIR /app

# Устанавливаем OpenSSL для Prisma
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем всё монорепо
COPY . .

# Ставим зависимости с учётом workspaces
RUN pnpm install --frozen-lockfile

# Генерируем Prisma с retry механизмом
# Prisma может падать из-за нестабильного интернета при скачивании engines
# Увеличиваем таймауты Node.js и добавляем retry
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=0
# Увеличиваем таймауты для HTTP запросов (в миллисекундах)
ENV PRISMA_ENGINES_DOWNLOAD_TIMEOUT=300000
RUN for i in 1 2 3 4 5; do \
        echo "Prisma generate attempt $i/5..." && \
        pnpm --filter back exec prisma generate && \
        echo "Prisma generate succeeded!" && break || \
        (echo "Attempt $i failed, waiting 10 seconds before retry..." && sleep 10); \
    done || (echo "All Prisma generate attempts failed!" && exit 1)

# Строим только API
RUN pnpm --filter back build

EXPOSE 3000
CMD ["node", "apps/api/dist/main"]

