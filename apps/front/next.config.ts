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

    //for debug
    compress: false, // <--- отключает gzip-сжатие и минификацию на сервере

    // // если хочешь также отключить минификацию сборки (клиентского JS), допиши:
    webpack(config, { dev, isServer }) {
        if (!dev) {
            config.optimization.minimize = false;
        }
        return config;
    },
    reactStrictMode: true,



    productionBrowserSourceMaps: true,

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
    // Настройки для изображений из S3
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's3.*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'sociopath-network-bucket.s3.eu-north-1.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
