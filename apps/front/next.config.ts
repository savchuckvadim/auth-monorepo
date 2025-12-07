import type { NextConfig } from 'next';

// Проверяем наличие обязательных переменных окружения
const requiredEnvVars = ['API_URL',];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const nextConfig: NextConfig = {
    env: {
        API_URL: process.env.API_URL,

    },
    // Добавляем поддержку TypeScript для конфигурации
    typescript: {
        // Включаем проверку типов при сборке
        ignoreBuildErrors: false,
    },
    // Настройки для монорепозитория
    transpilePackages: ['@workspace/api', '@workspace/ui', '@workspace/nest-api'],
};

export default nextConfig;
