import type { SessionDto } from '@workspace/nest-api';

/**
 * Ультра-лёгкий парсер `User-Agent` под UI списка сессий.
 * Хватит для «Chrome на macOS», «Safari на iPhone» и пр.
 *
 * Мы не тащим полноценный `ua-parser-js`, чтобы не раздувать бандл —
 * если здесь чего-то не хватит, замена в одном месте.
 */
export type SessionPlatform = 'ios' | 'android' | 'web' | 'desktop' | 'unknown';

export interface SessionDisplay {
    deviceLabel: string;
    browserLabel: string;
    shortIp: string | null;
    /**
     * Стабильный тип платформы — определяется в первую очередь по
     * префиксу `deviceId` (формат `<platform>-<version>-<uuid>` задаётся
     * мобильным приложением), а если `deviceId` пустой — падаем на
     * regexp по `User-Agent`.
     */
    platform: SessionPlatform;
}

const OS_PATTERNS: ReadonlyArray<[RegExp, string]> = [
    [/windows nt 10/i, 'Windows 10'],
    [/windows nt/i, 'Windows'],
    [/mac os x/i, 'macOS'],
    [/android/i, 'Android'],
    [/iphone|ipad|ipod/i, 'iOS'],
    [/cros/i, 'ChromeOS'],
    [/linux/i, 'Linux'],
];

const BROWSER_PATTERNS: ReadonlyArray<[RegExp, string]> = [
    [/edg\//i, 'Edge'],
    [/opr\//i, 'Opera'],
    [/chrome\//i, 'Chrome'],
    [/safari\//i, 'Safari'],
    [/firefox\//i, 'Firefox'],
    [/expo/i, 'Expo'],
    [/okhttp/i, 'Android (native)'],
    [/cfnetwork/i, 'iOS (native)'],
];

function pick(regexes: ReadonlyArray<[RegExp, string]>, value: string, fallback: string) {
    for (const [re, label] of regexes) {
        if (re.test(value)) return label;
    }
    return fallback;
}

/**
 * Возвращает «семейство» платформы:
 *  1. Первым делом смотрим на `deviceId` (мобилка присылает
 *     `ios-17.4-<uuid>` / `android-13-<uuid>` — см.
 *     `mobile/app/api/lib/auth/device-id.api.ts`).
 *  2. Если deviceId пуст — парсим User-Agent.
 */
export function resolveSessionPlatform(session: SessionDto): SessionPlatform {
    const id = session.deviceId?.toLowerCase() ?? '';
    if (id.startsWith('ios-')) return 'ios';
    if (id.startsWith('android-')) return 'android';

    const ua = session.userAgent?.toLowerCase() ?? '';
    if (!ua) return 'unknown';
    if (/iphone|ipad|ipod|cfnetwork/.test(ua)) return 'ios';
    if (/android|okhttp/.test(ua)) return 'android';
    if (/windows|mac os x|cros|linux/.test(ua)) return 'desktop';
    if (/chrome|safari|firefox|edg|opr/.test(ua)) return 'web';
    return 'unknown';
}

/** Метка устройства из deviceId мобилки (iOS 17.4 / Android 13). */
function platformLabelFromDeviceId(deviceId: string | null | undefined): string | null {
    if (!deviceId) return null;
    const id = deviceId.toLowerCase();
    const iosMatch = id.match(/^ios-([^-]+)-/);
    if (iosMatch) return `iOS ${iosMatch[1]}`;
    const androidMatch = id.match(/^android-([^-]+)-/);
    if (androidMatch) return `Android ${androidMatch[1]}`;
    return null;
}

export function buildSessionDisplay(session: SessionDto): SessionDisplay {
    const ua = session.userAgent ?? '';
    const fromDeviceId = platformLabelFromDeviceId(session.deviceId);
    const os = fromDeviceId ?? (ua ? pick(OS_PATTERNS, ua, 'Устройство') : 'Устройство');
    const browser = ua ? pick(BROWSER_PATTERNS, ua, 'Браузер') : 'Браузер';

    return {
        deviceLabel: os,
        browserLabel: browser,
        shortIp: session.ipAddress?.trim() ? session.ipAddress.trim() : null,
        platform: resolveSessionPlatform(session),
    };
}

/**
 * Относительное «сколько назад» — без зависимости на date-fns.
 */
export function formatRelative(iso: string, now = Date.now()): string {
    const ts = new Date(iso).getTime();
    if (Number.isNaN(ts)) return iso;
    const diffSec = Math.max(0, Math.round((now - ts) / 1000));

    if (diffSec < 60) return 'только что';
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `${diffMin} мин назад`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${diffH} ч назад`;
    const diffD = Math.round(diffH / 24);
    if (diffD < 30) return `${diffD} дн назад`;
    const diffMo = Math.round(diffD / 30);
    if (diffMo < 12) return `${diffMo} мес назад`;
    const diffY = Math.round(diffMo / 12);
    return `${diffY} г назад`;
}

export function formatExactDateTime(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

/**
 * `true`, если сессия была создана совсем недавно и её стоит подсветить
 * в списке как «только что авторизовались». Порог — 30 минут, чтобы
 * заметить новые устройства, но не держать подсветку бесконечно.
 */
export function isRecentlyCreated(iso: string, thresholdMin = 30, now = Date.now()): boolean {
    const ts = new Date(iso).getTime();
    if (Number.isNaN(ts)) return false;
    const diffMin = (now - ts) / 60000;
    return diffMin >= 0 && diffMin <= thresholdMin;
}
