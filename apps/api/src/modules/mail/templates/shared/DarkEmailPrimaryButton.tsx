import React from 'react';
import { Button } from '@react-email/components';

interface DarkEmailPrimaryButtonProps {
    href: string;
    children: React.ReactNode;
}

/**
 * «Пилюля»-кнопка auth-писем: соответствует главному CTA на
 * `apps/front/app/start/page.tsx` (вариант `default` из `@workspace/ui`)
 * — красная заливка `primary`, белый текст, скруглённые углы.
 *
 * Стилизация — через Tailwind-классы (рендер через
 * `@react-email/tailwind` внутри `DarkEmailShell`). Все цвета берутся
 * из единого конфига `EMAIL_TAILWIND_CONFIG`.
 */
export function DarkEmailPrimaryButton({
    href,
    children,
}: DarkEmailPrimaryButtonProps) {
    return (
        <Button
            href={href}
            className="inline-block rounded-full bg-email-primary px-10 py-4 text-[15px] font-semibold leading-none tracking-wide text-email-primary-fg no-underline"
        >
            {children}
        </Button>
    );
}
