import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, EResultCode } from '../interfaces/response.interface';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiResponse<T>> {
        const req = context.switchToHttp().getRequest<Request>();
        // 🔥 Пропускаем без обертки, если это /metrics
        if (req.url === '/api/metrics') {
            return next.handle() as Observable<ApiResponse<T>>;
        }

        return next.handle().pipe(
            map(data => ({
                resultCode: EResultCode.SUCCESS,
                data,
            })),
        );
    }
}
