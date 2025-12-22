/** @type {import('next').NextConfig} */
const nextConfig = {


    //for debug
    // webpack(config, { dev, isServer }) {
    //     if (!dev) {
    //         config.optimization.minimize = false;
    //     }
    //     return config;
    // },
    // reactStrictMode: true,


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
}

export default nextConfig
