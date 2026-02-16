import React from 'react'
import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text
} from '@react-email/components'


interface EmailVerificationTemplateProps {
    name: string
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

                <Body style={{ backgroundColor: colors.background, fontFamily: 'Inter, Arial, sans-serif' }}>

                    <Preview>Активация аккаунта в сети Sociopath</Preview>
                    <Container className='mx-auto my-10 max-w-[500px] rounded-lg p-8 shadow-lg'
                        style={{ backgroundColor: colors.card }}
                    >
                        <Section className='text-center'>

                            <Heading className='text-2xl font-bold text-gray-800' style={{ fontFamily: 'Geist, Arial' }}>
                                Активация аккаунта
                            </Heading>
                            <Text className='mb-6 ' style={{ fontFamily: 'Geist, Arial', color: colors.foreground }}>
                                Привет, {name}!  Это Sociopath. Мы получили запрос на активацию твоего аккаунта.
                            </Text>
                            <Section className='mb-8 rounded-lg border border-gray-100 bg-gray-50 p-6'>
                                <Text className='mb-4' style={{ fontFamily: 'Geist, Arial', color: colors.primary }}>
                                    Подтверди email, чтобы завершить вход.
                                </Text>
                                <Button
                                    href={activationLink}
                                    className={`inline-flex items-center justify-center rounded-full bg-gray-800 px-8 py-3 text-sm font-medium text-white hover:${colors.primary} leading-none`}
                                    style={{ fontFamily: 'Geist, Arial' }}
                                >
                                    Активировать
                                </Button>
                            </Section>
                            <Text className='text-sm text-gray-500' style={{ fontFamily: 'Geist, Arial' }}>
                                Если ты здесь случайно — просто проигнорируй письмо.
                            </Text>
                            <Text className='mt-6 text-sm' style={{ fontFamily: 'Geist, Arial', color: colors.mutedForeground }}>
                                © {new Date().getFullYear()} Sociopath. Все права защищены.
                            </Text>
                        </Section>
                    </Container>
                </Body>

            </Html>
        </Tailwind>
    )
}
