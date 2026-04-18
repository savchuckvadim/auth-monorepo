const domains = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map(origin => origin.trim());

/**
 * Клиент (`packages/nest-api` / `customAxios`) вешает на каждый запрос `Cache-Control` и `Pragma`.
 * Это делает запрос «непростым» → браузер шлёт preflight OPTIONS и ждёт
 * `Access-Control-Allow-Headers` с этими именами. Иначе в консоли выглядит как CORS.
 * PATCH нужен для `PATCH /api/chats/:id` и др. — без него в списке методов preflight падает.
 */
export const cors = {
    origin: domains,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Pragma',
        'X-Requested-With',
    ],
};
