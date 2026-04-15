import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TelegramService } from '../../modules/telegram/telegram.service';
import * as path from 'path';
import { ApiResponse, EResultCode } from '../interfaces/response.interface';

const stringifyHeader = (value: string | string[] | undefined): string =>
    Array.isArray(value) ? value.join(', ') : (value ?? 'unknown');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    constructor(private readonly telegram: TelegramService) {}

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // if (status === HttpStatus.UNAUTHORIZED) {
        //     return response.status(401).json({
        //         resultCode: EResultCode.ERROR,
        //         message: 'Пользователь не авторизован',
        //     });
        // }

        const error =
            exception instanceof Error
                ? exception
                : new Error(JSON.stringify(exception));

        // Обработка валидационных ошибок
        if (
            exception instanceof BadRequestException &&
            typeof exception.getResponse === 'function'
        ) {
            return await this.handleValidationException(
                exception,
                request,
                response,
            );
        }

        // Разбор stack trace
        let file = '';
        let line = '';
        let func = '';
        let code = '';
        try {
            const stackLines = error.stack?.split('\n') || [];
            const target = stackLines.find(
                l => l.includes('/src/') || l.includes('src\\'),
            );
            if (target) {
                const match = target.match(/\((.*):(\d+):(\d+)\)/);
                if (match) {
                    const [, filepath, lineno] = match;
                    file = path.relative(process.cwd(), filepath);
                    line = lineno;
                }
            }

            func = stackLines[1]?.trim().split(' ')[1] || 'unknown';
            code = stackLines[1] || '';
        } catch (e) {
            console.warn('Stack trace parse failed', e);
        }

        const ip = stringifyHeader(
            request.headers['x-forwarded-for'] ?? request.socket.remoteAddress,
        );
        const userAgent = stringifyHeader(request.headers['user-agent']);
        const referer = stringifyHeader(request.headers['referer']);

        const message = `⚠️ Ошибка: ${error.name}\n\n📄 Файл: ${file}\n🔢 Строка: ${line}\n🔧 Функция: ${func}\n\n💥 Код: ${code}\n\n📬 Сообщение: ${error.message}\n\n📍 URL: ${request.method} ${request.url}\n🧭 User-Agent: ${userAgent}\n🌍 IP: ${ip}\n🔗 Referer: ${referer}
        `;
        await this.telegram.sendMessage(message);
        console.log(message);
        const responseBody: ApiResponse<null> = {
            resultCode: EResultCode.ERROR,
            message: error.message,
        };
        response.status(status).json(responseBody);
    }

    private async handleValidationException(
        exception: BadRequestException,
        request: Request,
        response: Response,
    ): Promise<Response> {
        const res = exception.getResponse();
        const responseData: { message?: string | string[] } =
            typeof res === 'object' && res !== null
                ? (res as { message?: string | string[] })
                : {};
        const messageArray = responseData.message ?? [];

        const validationMessages = Array.isArray(messageArray)
            ? messageArray.join('\n- ')
            : String(messageArray);

        const fullMessage = `❌ Validation error:\n- ${validationMessages}\n\n📍 URL: ${request.method} ${request.url} `;
        this.logger.warn(fullMessage);
        await this.telegram.sendMessage(fullMessage);

        return response.status(400).json({
            resultCode: EResultCode.ERROR,
            message: 'Validation failed',
            errors: messageArray,
        });
    }
}
