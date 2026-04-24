import React from 'react';
import { Section, Text } from '@react-email/components';

import { DarkEmailShell, DarkEmailPrimaryButton } from './shared';

interface EmailVerificationTemplateProps {
    name: string;
    activationLink: string;
    /**
     * Оставляем в пропсах для совместимости с уже задеплоенным
     * `SendMailVerificationDto`, хотя сейчас сам компонент `clientUrl`
     * не использует — лого встраивается как data-URI, а копирайт
     * берётся из `new Date().getFullYear()`.
     */
    clientUrl: string;
}

export function EmailVerificationTemplate({
    name,
    activationLink,
}: EmailVerificationTemplateProps) {
    return (
        <DarkEmailShell
            preview="Активация аккаунта в сети Sociopath"
            heroTitle="Become a Sociopath."
            heroSubtitle="Подтвердите email, чтобы войти в приватное сообщество."
        >
            <Text className="mx-0 mt-0 mb-5 text-center text-[15px] leading-relaxed text-email-fg">
                Привет, {name}! Мы получили запрос на активацию твоего аккаунта.
                Это последний шаг — подтверди email, и сразу попадёшь в сеть.
            </Text>

            <Section className="px-0 py-2 pt-2 pb-1 text-center">
                <DarkEmailPrimaryButton href={activationLink}>
                    Активировать аккаунт
                </DarkEmailPrimaryButton>
            </Section>

            <Text className="mx-0 mt-6 mb-1 text-center text-xs leading-normal text-email-muted">
                Если кнопка не работает, скопируй ссылку в адресную строку:
            </Text>
            <Text className="m-0 break-all text-center text-[11px] leading-normal text-email-primary">
                {activationLink}
            </Text>

            <Text className="mx-0 mt-7 mb-0 text-center text-xs leading-normal text-email-muted">
                Если ты здесь случайно — просто проигнорируй письмо.
            </Text>
        </DarkEmailShell>
    );
}
