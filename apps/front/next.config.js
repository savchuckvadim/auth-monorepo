/** @type {import('next').NextConfig} */
const nextConfig = {

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
}

export default nextConfig
