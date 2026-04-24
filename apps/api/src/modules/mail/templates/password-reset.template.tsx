import React from 'react';
import { Section, Text } from '@react-email/components';

import { DarkEmailShell, DarkEmailPrimaryButton } from './shared';

interface PasswordResetTemplateProps {
    name: string;
    resetLink: string;
    /** Пока не используется визуально — оставлено для будущей локализации доменов. */
    clientUrl: string;
    expiresInMinutes: number;
}

export function PasswordResetTemplate({
    name,
    resetLink,
    expiresInMinutes,
}: PasswordResetTemplateProps) {
    return (
        <DarkEmailShell
            preview="Сброс пароля в сети Sociopath"
            heroTitle="Сброс пароля"
            heroSubtitle={`Ссылка действует ${expiresInMinutes} минут и одноразовая.`}
        >
            <Text className="mx-0 mt-0 mb-5 text-center text-[15px] leading-relaxed text-email-fg">
                Привет, {name}! Мы получили запрос на сброс пароля для твоего
                аккаунта в Sociopath. Если это ты — нажми кнопку ниже, чтобы
                задать новый пароль.
            </Text>

            <Section className="px-0 py-2 pt-2 pb-1 text-center">
                <DarkEmailPrimaryButton href={resetLink}>
                    Установить новый пароль
                </DarkEmailPrimaryButton>
            </Section>

            <Text className="mx-0 mt-6 mb-1 text-center text-xs leading-normal text-email-muted">
                Если кнопка не работает, скопируй ссылку в адресную строку:
            </Text>
            <Text className="m-0 break-all text-center text-[11px] leading-normal text-email-primary">
                {resetLink}
            </Text>

            <Text className="mx-0 mt-7 mb-0 text-center text-xs leading-normal text-email-muted">
                Не запрашивал сброс? Проигнорируй письмо — пароль останется прежним.
                После успешного сброса все активные сессии будут разлогинены.
            </Text>
        </DarkEmailShell>
    );
}
