import { Geist, Geist_Mono } from 'next/font/google';
import '@workspace/ui/globals.css';
import '@workspace/theme/themes.css';
import { Providers } from '@/components/providers';
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

const metadata: Metadata = {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
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
                {/* <LoadingScreen /> */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
