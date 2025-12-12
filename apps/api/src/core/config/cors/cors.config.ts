const domains = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map(origin => origin.trim());

export const cors = {
    origin: domains,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};
