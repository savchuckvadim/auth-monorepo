/**
 * Кеш **расшифрованного** текста входящих E2EE по `messageId`.
 *
 * Нужен, чтобы после F5 не вызывать `decrypt` повторно по тому же ciphertext (повторный decrypt
 * ломает ratchet) и не перегружать UI. Те же ограничения, что у `signal-sent-plaintext-cache.ts`:
 * plaintext в `localStorage` доступен любому JS на origin — см. комментарий там про XSS.
 */
const STORAGE_KEY = 'messenger_e2ee_incoming_plaintext_v1';
const MAX_KEYS = 3000;

function readMap(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? (parsed as Record<string, string>)
            : {};
    } catch {
        return {};
    }
}

function writeMap(m: Record<string, string>): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
    } catch {
        /* quota */
    }
}

function trim(m: Record<string, string>): void {
    const keys = Object.keys(m);
    if (keys.length <= MAX_KEYS) return;
    keys.sort();
    for (let i = 0; i < keys.length - MAX_KEYS; i++) {
        const k = keys[i];
        if (k) delete m[k];
    }
}

export function rememberIncomingPlaintext(
    messageId: string,
    plaintext: string,
): void {
    if (typeof window === 'undefined' || !messageId) return;
    const m = readMap();
    m[messageId] = plaintext;
    trim(m);
    writeMap(m);
}

export function getIncomingPlaintext(messageId: string): string | undefined {
    if (typeof window === 'undefined' || !messageId) return undefined;
    return readMap()[messageId];
}
