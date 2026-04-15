import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, EResultCode } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const req = context.switchToHttp().getRequest();
        // 🔥 Пропускаем без обертки, если это /metrics
        if (req.url === '/api/metrics') {
            return next.handle();
        }

        return next.handle().pipe(
            map(data => {
                return {
                    resultCode: EResultCode.SUCCESS,
                    data: data,
                };
            }),
        );
    }
}
