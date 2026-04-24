import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

import { getSwaggerConfig } from './core/config/swagger/swagger.config';
import { cors } from './core/config/cors/cors.config';

import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: cors,
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        snapshot: true,
        // logger: WinstonModule.createLogger({ instance: winstonLogger }),
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            forbidUnknownValues: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.setGlobalPrefix('api');

    // Доверяем первому прокси в цепочке (nginx / cloudflare). Благодаря этому
    // `req.ip` и `X-Forwarded-For` разбираются корректно; без этого клиент
    // может подделать IP через заголовок, а `req.ip` будет равен IP прокси.
    // В dev (без прокси) — ничего не меняет.
    app.set('trust proxy', 1);

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(app.get(GlobalExceptionFilter));
    app.enableCors(cors);

    //documentation
    getSwaggerConfig(app);

    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap().catch(console.error);
