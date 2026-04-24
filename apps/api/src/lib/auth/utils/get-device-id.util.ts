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

/** Берём первый IP из `x-forwarded-for` (если сервер за прокси), иначе `req.ip` / сокет. */
export function resolveIpFromRequest(req: Request): string | undefined {
    const forwarded = pickHeader(req.headers, 'x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0]?.trim();
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
