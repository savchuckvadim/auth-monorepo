/**
 * Маленький bridge между LoginForm и ForgotPasswordForm: если логин
 * упал и пользователь перешёл по ссылке «Forgot password?», мы
 * подставляем введённый на логине email, чтобы ему не пришлось
 * набирать его заново.
 *
 * Передавать через query string мы не хотим — email бы попал в
 * referer-заголовки. Через React state тоже не получится, так как
 * роутер — server component, и между страницами теряется.
 *
 * Решение — `sessionStorage` с одноразовым ключом. Хранится ровно до
 * первого `consumeForgotEmailHint`, ограничено временем жизни вкладки.
 */
const STORAGE_KEY = 'forgot-password-email-hint';
/** После часа забываем подсказку — safety net, если consume не произошёл. */
const MAX_AGE_MS = 60 * 60 * 1000;

interface StoredHint {
    email: string;
    at: number;
}

function canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function saveForgotEmailHint(email: string): void {
    if (!canUseStorage()) return;
    const trimmed = email.trim();
    if (!trimmed) return;
    try {
        const payload: StoredHint = { email: trimmed, at: Date.now() };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // sessionStorage недоступен (приватный режим Safari) — молча игнорируем.
    }
}

export function consumeForgotEmailHint(): string | null {
    if (!canUseStorage()) return null;
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        window.sessionStorage.removeItem(STORAGE_KEY);
        const parsed = JSON.parse(raw) as Partial<StoredHint>;
        if (!parsed.email || typeof parsed.email !== 'string') return null;
        if (typeof parsed.at === 'number' && Date.now() - parsed.at > MAX_AGE_MS) {
            return null;
        }
        return parsed.email;
    } catch {
        return null;
    }
}
