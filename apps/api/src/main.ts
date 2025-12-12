import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

import { getSwaggerConfig } from './core/config/swagger/swagger.config';
import { cors } from './core/config/cors/cors.config';

import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
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

    // глобально подключаем interceptor
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(app.get(GlobalExceptionFilter));
    app.enableCors(cors);



    //documentation
    getSwaggerConfig(app);


    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
