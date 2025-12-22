import type { NextConfig } from 'next';

// Проверяем наличие обязательных переменных окружения
// NEXT_PUBLIC_ префикс обязателен для переменных, доступных в браузере
const requiredEnvVars = ['NEXT_PUBLIC_API_URL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const nextConfig: NextConfig = {
    //for debug on prod build
    webpack(config, { dev, isServer }) {
        if (!dev) {
            config.optimization.minimize = false;
        }
        return config;
    },
    reactStrictMode: true,
    // Next.js автоматически встраивает переменные с префиксом NEXT_PUBLIC_ в клиентский код
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    // Добавляем поддержку TypeScript для конфигурации
    typescript: {
        // Включаем проверку типов при сборке
        ignoreBuildErrors: false,
    },
    // Настройки для монорепозитория
    transpilePackages: ['@workspace/api', '@workspace/ui', '@workspace/nest-api'],
    // Отключаем кэширование transpiled пакетов для workspace пакетов
    // Это гарантирует, что изменения в пакетах всегда применяются
    experimental: {
        // Принудительно пересобираем transpiled пакеты при каждой сборке
        optimizePackageImports: ['@workspace/nest-api'],
    },
};

export default nextConfig;
