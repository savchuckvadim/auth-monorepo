import { Geist, Geist_Mono } from 'next/font/google';
import '@workspace/ui/globals.css';
import '@workspace/theme/themes.css';
import { Providers } from '@/modules/app';
import { APP_DESCRIPTION, APP_TITLE } from '@/modules/app';
import { Metadata } from 'next';



const fontSans = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});



export const metadata: Metadata = {
    title: `${APP_TITLE} — приватное общение и поиск единомышленников`,
    description:
        `${APP_DESCRIPTION}`,
    keywords: [
        'приватное общение',
        'закрытое сообщество',
        'поиск единомышленников',
        'анонимное общение',
        'альтернативные социальные сети',
        'осознанные сообщества',
        'sociopath network',
    ],
    openGraph: {
        title: `${APP_TITLE} — закрытая социальная платформа`,
        description:
            'Пространство для тех, кто ценит приватность, смысл и честное общение. Ищи своих. Общайся без фильтров.',
        type: 'website',
        url: 'https://sociopath-network.ru',
        images: [
            {
                url: 'https://sociopath-network.ru/og/cover.png',
                width: 1200,
                height: 630,
                alt: `${APP_TITLE} — приватное сообщество`,
            },
        ],
        siteName: `${APP_TITLE}`,
    },
    twitter: {
        card: 'summary_large_image',
        title: `${APP_TITLE}`,
        description:
            'Закрытая сеть для приватного общения и поиска единомышленников. Минимум шума — максимум смысла.',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            className="scrollbar-hide"
            lang="en"
            suppressHydrationWarning
        >
            <body
                className={`${fontSans.variable} ${fontMono.variable} scrollbar-hide  font-sans antialiased `}
            >

                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
