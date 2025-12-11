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
    email: string
    name: string
    activationLink: string

}



export function EmailVerificationTemplate({ name, activationLink }: EmailVerificationTemplateProps) {



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

                <Body style={{ backgroundColor: '#f8f9fa', fontFamily: 'Inter, Arial, sans-serif' }}>

                    <Preview>Активация аккаунта на IT Booster Platform</Preview>
                    <Container className='mx-auto my-10 max-w-[500px] rounded-lg bg-white p-8 shadow-lg'>
                        <Section className='text-center'>

                            <Heading className='text-2xl font-bold text-gray-800' style={{ fontFamily: 'Geist, Arial' }}>
                                Активация аккаунта
                            </Heading>
                            <Text className='mb-6 text-gray-500' style={{ fontFamily: 'Geist, Arial' }}>
                                Привет, {name} ! Мы получили запрос на активацию вашего аккаунта.
                            </Text>
                            <Section className='mb-8 rounded-lg border border-gray-100 bg-gray-50 p-6'>
                                <Text className='mb-4 text-gray-800' style={{ fontFamily: 'Geist, Arial' }}>
                                    Нажмите на кнопку ниже, чтобы подтвердить ваш адрес электронной почты.
                                </Text>
                                <Button
                                    href={activationLink}
                                    className='inline-flex items-center justify-center rounded-full bg-gray-800 px-8 py-3 text-sm font-medium text-white hover:bg-pink-600/90 leading-none'
                                    style={{ fontFamily: 'Geist, Arial' }}
                                >
                                    Активировать
                                </Button>
                            </Section>
                            <Text className='text-sm text-gray-500' style={{ fontFamily: 'Geist, Arial' }}>
                                Если вы не запрашивали активацию аккаунта, просто проигнорируйте это письмо.
                            </Text>
                            <Text className='mt-6 text-sm text-gray-400' style={{ fontFamily: 'Geist, Arial' }}>
                                © {new Date().getFullYear()} IT Booster Platform. Все права защищены.
                            </Text>
                        </Section>
                    </Container>
                </Body>

            </Html>
        </Tailwind>
    )
}
