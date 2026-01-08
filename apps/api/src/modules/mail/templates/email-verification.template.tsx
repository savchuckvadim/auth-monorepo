import React from 'react'
import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text
} from '@react-email/components'


interface EmailVerificationTemplateProps {
    name?: string
    activationLink: string
    clientUrl: string
}

export function EmailVerificationTemplate({ name, activationLink, clientUrl }: EmailVerificationTemplateProps) {
    const logoLink = `${clientUrl}/logo.svg`

    // Цвета из sociopath-light темы
    const colors = {
        background: '#F4F4F4', // oklch(0.96 0 0)
        foreground: '#212121', // oklch(0.25 0 0)
        primary: '#F44848', // oklch(0.65 0.2 25)
        card: '#FFFFFF', // oklch(1 0 0)
        mutedForeground: '#808080', // oklch(0.55 0 0)
        border: '#EDEDED', // oklch(0.94 0 0)
    }

    return (
        <Tailwind>
            <Html>
                <Head>
                    <Font
                        fontFamily='Geist'
                        fallbackFontFamily='Arial'
                        webFont={{
                            url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;500;700&display=swap',
                            format: 'woff2'
                        }}
                    />
                </Head>

                <Body style={{ backgroundColor: colors.background, fontFamily: 'Geist, Arial, sans-serif', margin: 0, padding: 0 }}>
                    <Preview>Подтверди email, чтобы завершить вход в Sociopath</Preview>

                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
                        <Section style={{ backgroundColor: colors.card, borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            {/* Логотип */}
                            <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <Img
                                    src={logoLink}
                                    alt="Sociopath Logo"
                                    width="120"
                                    height="auto"
                                    style={{ margin: '0 auto' }}
                                />
                            </Section>

                            {/* Приветствие */}
                            <Text style={{
                                fontSize: '18px',
                                lineHeight: '1.6',
                                color: colors.foreground,
                                marginBottom: '24px',
                                fontFamily: 'Geist, Arial, sans-serif'
                            }}>
                                Привет.
                            </Text>

                            <Text style={{
                                fontSize: '18px',
                                lineHeight: '1.6',
                                color: colors.foreground,
                                marginBottom: '24px',
                                fontFamily: 'Geist, Arial, sans-serif'
                            }}>
                                Это Sociopath.
                            </Text>

                            <Text style={{
                                fontSize: '18px',
                                lineHeight: '1.6',
                                color: colors.foreground,
                                marginBottom: '32px',
                                fontFamily: 'Geist, Arial, sans-serif'
                            }}>
                                Подтверди email, чтобы завершить вход.
                            </Text>

                            <Text style={{
                                fontSize: '18px',
                                lineHeight: '1.6',
                                color: colors.foreground,
                                marginBottom: '32px',
                                fontFamily: 'Geist, Arial, sans-serif'
                            }}>
                                Дальше — по желанию.
                            </Text>

                            {/* Кнопка подтверждения */}
                            <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <Button
                                    href={activationLink}
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: '#FFFFFF',
                                        padding: '14px 32px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        display: 'inline-block',
                                        fontFamily: 'Geist, Arial, sans-serif',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Подтвердить email
                                </Button>
                            </Section>

                            {/* Футер */}
                            <Text style={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: colors.mutedForeground,
                                marginTop: '32px',
                                fontFamily: 'Geist, Arial, sans-serif'
                            }}>
                                Если ты здесь случайно — просто проигнорируй письмо.
                            </Text>

                            <Text className='mt-6 text-sm text-gray-400' style={{ fontFamily: 'Geist, Arial' }}>
                                © {new Date().getFullYear()} Sociopath. Все права защищены.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    )
}
