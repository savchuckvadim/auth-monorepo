/**
 * Лёгкая эвристика силы пароля — обходимся без `zxcvbn` (+200KB в
 * бандле). Даёт достаточно полезный сигнал пользователю, чтобы не
 * выбирать `qwerty12`, и идентична для web и mobile (код дублируется
 * один-в-один).
 *
 * Шкала:
 *  0 — пусто
 *  1 — слабый (<8 символов или только буквы/цифры)
 *  2 — средний (8+ и смешанный регистр/цифры)
 *  3 — хороший (12+ и спецсимволы)
 *  4 — сильный (16+ и 3+ класса символов + спецсимволы)
 */
export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
    score: PasswordStrengthScore;
    label: string;
    /** Сколько из 4 сегментов заполнять в UI. */
    filled: number;
    /** Tailwind-класс для сегментов (используется и в web, и в RN через nativewind). */
    colorClass: string;
    /** Подсказка «что улучшить», если пароль слабый. Пусто для сильного. */
    hint: string | null;
}

const LABELS: Record<PasswordStrengthScore, string> = {
    0: 'Введите пароль',
    1: 'Слабый',
    2: 'Средний',
    3: 'Хороший',
    4: 'Сильный',
};

const COLORS: Record<PasswordStrengthScore, string> = {
    0: 'bg-muted',
    1: 'bg-red-500',
    2: 'bg-amber-500',
    3: 'bg-lime-500',
    4: 'bg-emerald-500',
};

function countClasses(value: string): number {
    let n = 0;
    if (/[a-z]/.test(value)) n++;
    if (/[A-Z]/.test(value)) n++;
    if (/\d/.test(value)) n++;
    if (/[^A-Za-z0-9]/.test(value)) n++;
    return n;
}

export function evaluatePasswordStrength(value: string): PasswordStrength {
    const password = value ?? '';
    if (password.length === 0) {
        return {
            score: 0,
            label: LABELS[0],
            filled: 0,
            colorClass: COLORS[0],
            hint: null,
        };
    }

    const classes = countClasses(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score: PasswordStrengthScore = 1;
    if (password.length >= 8 && classes >= 2) score = 2;
    if (password.length >= 12 && classes >= 3 && hasSpecial) score = 3;
    if (password.length >= 16 && classes >= 3 && hasSpecial) score = 4;

    const hints: string[] = [];
    if (password.length < 12) hints.push('длиннее 12 символов');
    if (!/[A-Z]/.test(password)) hints.push('заглавные буквы');
    if (!/\d/.test(password)) hints.push('цифры');
    if (!hasSpecial) hints.push('спецсимволы (!@#$)');

    return {
        score,
        label: LABELS[score],
        filled: score,
        colorClass: COLORS[score],
        hint: score >= 3 || hints.length === 0 ? null : `Добавьте: ${hints.join(', ')}`,
    };
}
