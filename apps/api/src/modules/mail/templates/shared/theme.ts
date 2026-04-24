/**
 * Цветовая палитра email-писем, синхронизирована с темой `sociopath-dark`
 * из `packages/ui/src/styles/themes/sociopath-dark.css`.
 *
 * Используем только plain hex, потому что почтовые клиенты (Gmail,
 * Outlook, Apple Mail) не поддерживают `oklch()` и CSS-переменные. Все
 * значения ниже — ручной перевод соответствующих `oklch(...)` в
 * ближайший sRGB hex.
 */
export const EMAIL_DARK_THEME = {
    /** `oklch(0.25 0 0)` — основной тёмный фон страницы */
    background: '#212121',
    /** `oklch(0.22 0 0)` — поверхность карточки */
    card: '#1C1C1C',
    /** `oklch(0.35 0 0)` — акцентный блок, слегка светлее карточки */
    accent: '#3A3A3A',
    /** `oklch(0.4 0 0)` — граница/муки/инпут */
    border: '#595959',
    /** `oklch(0.95 0 0)` — основной светлый текст */
    foreground: '#EEEEEE',
    /** `oklch(0.7 0 0)` — приглушённый текст */
    mutedForeground: '#A8A8A8',
    /** `oklch(0.65 0.2 25)` — фирменный красный акцент */
    primary: '#F44848',
    /** `oklch(0.98 0 0)` — белый текст на красной кнопке */
    primaryForeground: '#FFFFFF',
} as const;

/**
 * Базовые параметры типографики для fallback и <Font/>-тега в head.
 */
export const EMAIL_FONT_STACK = 'Geist, "Segoe UI", Arial, sans-serif';

/**
 * Конфиг для `<Tailwind>`-обёртки из `@react-email/components`.
 *
 * Имена токенов совпадают с теми, что используются во фронтовой
 * `sociopath-dark` теме, но сюда экспортируются под префиксом `email-*`,
 * чтобы не пересекаться с классами Tailwind по умолчанию. В шаблонах
 * используются только эти токены — так правки цвета в одном месте
 * моментально расходятся по всем письмам.
 */
export const EMAIL_TAILWIND_CONFIG = {
    theme: {
        extend: {
            colors: {
                'email-bg': EMAIL_DARK_THEME.background,
                'email-card': EMAIL_DARK_THEME.card,
                'email-accent': EMAIL_DARK_THEME.accent,
                'email-border': EMAIL_DARK_THEME.border,
                'email-fg': EMAIL_DARK_THEME.foreground,
                'email-muted': EMAIL_DARK_THEME.mutedForeground,
                'email-primary': EMAIL_DARK_THEME.primary,
                'email-primary-fg': EMAIL_DARK_THEME.primaryForeground,
            },
            fontFamily: {
                email: ['Geist', 'Segoe UI', 'Arial', 'sans-serif'],
            },
        },
    },
};
