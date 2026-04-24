import React from 'react';
import {
    Body,
    Container,
    Font,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

import { EMAIL_TAILWIND_CONFIG } from './theme';
import { SOCIOPATH_LOGO_DATA_URI } from './logo';

interface DarkEmailShellProps {
    /** Текст, показываемый в списке писем как preview (скрытый сниппет). */
    preview: string;
    /** Заголовок страницы письма — крупный hero в стиле /start. */
    heroTitle: string;
    /** Подзаголовок под hero (мелкий светло-серый). */
    heroSubtitle?: string;
    children: React.ReactNode;
}

/**
 * Общий каркас для всех auth-писем в dark-теме, визуально перекликается
 * со стартовой страницей веба (`apps/front/app/start/page.tsx`):
 *
 *  • темный фон `#212121`;
 *  • крупная «hero»-часть с логотипом и названием `Sociopath.`;
 *  • карточка `#1C1C1C` с контентом;
 *  • футер с копирайтом, тоже в dark-палитре.
 *
 * Стили построены через `<Tailwind>` из `@react-email/components` —
 * `@react-email/tailwind` превращает классы в inline-CSS на этапе
 * рендера, поэтому итоговое письмо совместимо с Gmail / Outlook /
 * Apple Mail (никаких `<style>`-блоков внутри тела).
 *
 * Набор токенов вынесен в {@link EMAIL_TAILWIND_CONFIG} и повторяет
 * имена переменных темы `sociopath-dark`.
 */
export function DarkEmailShell({
    preview,
    heroTitle,
    heroSubtitle,
    children,
}: DarkEmailShellProps) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Geist"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;500;700&display=swap',
                        format: 'woff2',
                    }}
                />
            </Head>
            <Preview>{preview}</Preview>
            <Tailwind config={EMAIL_TAILWIND_CONFIG}>
                <Body className="m-0 w-full bg-email-bg p-0 font-email text-email-fg">
                    <Container className="mx-auto max-w-[560px] px-4 pt-8 pb-10">
                        <Section className="px-0 py-2 pb-6 text-center">
                            <table
                                role="presentation"
                                cellPadding={0}
                                cellSpacing={0}
                                border={0}
                                align="center"
                                className="mx-auto"
                            >
                                <tbody>
                                    <tr>
                                        <td className="pr-3 align-middle">
                                            <Img
                                                src={SOCIOPATH_LOGO_DATA_URI}
                                                width={44}
                                                height={53}
                                                alt="Sociopath"
                                                className="block"
                                            />
                                        </td>
                                        <td className="align-middle">
                                            <Text className="m-0 text-[32px] font-bold leading-none tracking-tight text-email-fg">
                                                Sociopath.
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>
                        <Section className="rounded-2xl border border-solid border-email-border bg-email-card px-8 py-9">
                            <Text className="mx-0 mt-0 mb-2 text-center text-[28px] font-bold leading-tight text-email-fg">
                                {heroTitle}
                            </Text>
                            {heroSubtitle ? (
                                <Text className="mx-0 mt-0 mb-6 text-center text-[15px] leading-normal text-email-muted">
                                    {heroSubtitle}
                                </Text>
                            ) : null}
                            {children}
                        </Section>
                        <Text className="mx-0 mt-6 mb-0 text-center text-xs text-email-muted">
                            © {new Date().getFullYear()} Sociopath. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
