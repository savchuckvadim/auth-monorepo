/**
 * Кеш **открытого текста** исходящих E2EE, чтобы после перезагрузки показывать «свои» сообщения
 * без повторного шифрования (сервер хранит только ciphertext).
 *
 * **Безопасность и `localStorage`:**
 * - Любой скрипт на странице (в т.ч. после XSS) может прочитать `localStorage` — это **не** защита
 *   на уровне ОС и не эквивалент шифрования диска.
 * - Для threat model «секрет только от сервера» этого достаточно: сервер не видит plaintext.
 * - Если нужна устойчивость к XSS/локальному доступу к профилю браузера — нужны другие меры
 *   (CSP, минимизация inline-скриптов, при необходимости шифрование кеша ключом из Web Crypto
 *   с выносом секрета за пределы JS — отдельная сложная тема).
 *
 * Ключ `messenger_e2ee_sent_plaintext_v1`: объект JSON `messageId → plaintext`, с усечением по числу ключей.
 */
const STORAGE_KEY = 'messenger_e2ee_sent_plaintext_v1';
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

/** Сохраняет исходный текст исходящего E2EE после ответа API (id сообщения). */
export function rememberSentPlaintext(messageId: string, plaintext: string): void {
    if (typeof window === 'undefined' || !messageId) return;
    const m = readMap();
    m[messageId] = plaintext;
    trim(m);
    writeMap(m);
}

export function getSentPlaintext(messageId: string): string | undefined {
    if (typeof window === 'undefined' || !messageId) return undefined;
    return readMap()[messageId];
}
