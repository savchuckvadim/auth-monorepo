import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sociopath authentication',
    description: 'Sociopath authentication',
};

/**
 * Фон и шапка задаются в app/auth/layout.tsx — здесь только метаданные сегмента.
 */
export default function AuthStartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
