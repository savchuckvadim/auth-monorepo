const UNIT_MS: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Преобразует строку длительности ("15m", "30d", "500ms", "2h", "1w") в миллисекунды.
 * Чистое число трактуется как уже посчитанные миллисекунды.
 * При некорректном вводе возвращает `fallback`.
 */
export function parseDurationToMs(
    input: string | number | undefined | null,
    fallback = 0,
): number {
    if (typeof input === 'number' && Number.isFinite(input)) {
        return input;
    }
    if (typeof input !== 'string') return fallback;

    const trimmed = input.trim();
    if (!trimmed) return fallback;

    if (/^\d+$/.test(trimmed)) return Number(trimmed);

    const match = trimmed.match(/^(\d+)\s*(ms|s|m|h|d|w)$/i);
    if (!match) return fallback;
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    return value * (UNIT_MS[unit] ?? 0);
}

export function addMsToDate(date: Date, ms: number): Date {
    return new Date(date.getTime() + ms);
}
