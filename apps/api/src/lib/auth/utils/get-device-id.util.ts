import type { IncomingHttpHeaders } from 'http';
import type { Request } from 'express';

/** Клиент (браузер / натив) передаёт стабильный id устройства; иначе сервер выдаёт новый и клиент должен сохранить. */
export const DEVICE_ID_HEADER = 'x-device-id';
const DEFAULT_DEVICE_ID = 'web';

export interface AuthRequestInfo {
    deviceId: string;
    userAgent?: string;
    ipAddress?: string;
}

function pickHeader(
    headers: IncomingHttpHeaders,
    ...keys: string[]
): string | undefined {
    for (const key of keys) {
        const raw = headers[key] ?? headers[key.toLowerCase()];
        const v = Array.isArray(raw) ? raw[0] : raw;
        if (typeof v === 'string' && v.trim().length > 0) {
            return v.trim();
        }
    }
    return undefined;
}

export function resolveDeviceIdFromHeaders(
    headers: IncomingHttpHeaders,
): string {
    return (
        pickHeader(headers, DEVICE_ID_HEADER, 'X-Device-Id') ??
        DEFAULT_DEVICE_ID
    );
}

export function resolveUserAgentFromHeaders(
    headers: IncomingHttpHeaders,
): string | undefined {
    return pickHeader(headers, 'user-agent', 'User-Agent');
}

/**
 * Определяем реальный IP клиента с учётом типичной цепочки прокси.
 *
 * Порядок источников (первый непустой выигрывает):
 *   1. `cf-connecting-ip` — Cloudflare всегда кладёт сюда IP **конечного**
 *      клиента. Если доверять только `x-forwarded-for`, то первым IP часто
 *      оказывается IP edge-ноды Cloudflare (`162.158.*.*`, `172.70.*.*`
 *      и т.п.), а не пользователь.
 *   2. `true-client-ip` — альтернативный заголовок Cloudflare Enterprise /
 *      Akamai. Полезен, если на сайте включён "Enterprise True-Client-IP".
 *   3. `x-forwarded-for` — цепочка прокси. С учётом `app.set('trust proxy', 1)`
 *      и того, что мы берём **первый** элемент, он чаще всего указывает на
 *      клиента — но только если перед nodejs стоит ровно один корректно
 *      настроенный прокси. За CF это ненадёжно, отсюда приоритет выше.
 *   4. `req.ip` / `req.socket.remoteAddress` — для локальной разработки
 *      (обычно вернёт `::1` или `127.0.0.1`).
 */
export function resolveIpFromRequest(req: Request): string | undefined {
    const cfIp = pickHeader(
        req.headers,
        'cf-connecting-ip',
        'CF-Connecting-IP',
    );
    if (cfIp) return cfIp;

    const trueClientIp = pickHeader(
        req.headers,
        'true-client-ip',
        'True-Client-IP',
    );
    if (trueClientIp) return trueClientIp;

    const forwarded = pickHeader(req.headers, 'x-forwarded-for');
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim();
        if (first) return first;
    }
    return req.ip || req.socket?.remoteAddress || undefined;
}

export function resolveAuthRequestInfo(req: Request): AuthRequestInfo {
    return {
        deviceId: resolveDeviceIdFromHeaders(req.headers),
        userAgent: resolveUserAgentFromHeaders(req.headers),
        ipAddress: resolveIpFromRequest(req),
    };
}
