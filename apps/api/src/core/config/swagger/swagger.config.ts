import { INestApplication } from '@nestjs/common';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';

export const getSwaggerConfig = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Auth backend')
        .setDescription('API for auth backend for monorepo')
        .setVersion('1.0')
        .addTag('auth-monorepo')
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => {
            const cleanController = controllerKey.replace(/Controller$/i, '');
            return `${cleanController}_${methodKey}`;
        },
    };
    const documentFactory = () =>
        SwaggerModule.createDocument(app, config, options);


    SwaggerModule.setup('docs/api', app, documentFactory);
};
