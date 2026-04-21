import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;

type Bucket = { resetAt: number; count: number };

function getUserIdFromRequest(req: Request): string | undefined {
    const rawUser: unknown = (req as { user?: unknown }).user;
    if (
        rawUser === null ||
        rawUser === undefined ||
        typeof rawUser !== 'object'
    ) {
        return undefined;
    }
    const candidate = (rawUser as { userId?: unknown }).userId;
    return typeof candidate === 'string' ? candidate : undefined;
}

@Injectable()
export class EncryptionRateLimitGuard implements CanActivate {
    private readonly buckets = new Map<string, Bucket>();

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return true;
        }
        const now = Date.now();
        let b = this.buckets.get(userId);
        if (!b || now > b.resetAt) {
            b = { resetAt: now + WINDOW_MS, count: 0 };
            this.buckets.set(userId, b);
        }
        b.count += 1;
        if (b.count > MAX_REQUESTS) {
            throw new HttpException(
                'Encryption API rate limit exceeded',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }
        return true;
    }
}
