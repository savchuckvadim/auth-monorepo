import * as winston from 'winston';

const stringifyLogValue = (value: unknown): string => {
    if (typeof value === 'string') {
        return value;
    }

    if (value instanceof Error) {
        return value.message;
    }

    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

export const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, context, timestamp }) => {
            const safeTimestamp = stringifyLogValue(timestamp);
            const safeContext = stringifyLogValue(context ?? 'App');
            const safeMessage = stringifyLogValue(message);

            return `[${safeTimestamp}] [${safeContext}] ${level.toUpperCase()}: ${safeMessage}`;
        }),
    ),
    transports: [new winston.transports.Console()],
});
// asd
// export const winstonLogger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.errors({ stack: true }),
//     winston.format.json()
//   ),
//   transports: [new winston.transports.Console()],
// });
