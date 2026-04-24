import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthFormPageShell, AuthCardFooter, LoadingComponent } from '@/modules/shared/ui';
import ResetPasswordFormWrapper from './ResetPasswordFormWrapper';

export const metadata: Metadata = {
    title: 'Новый пароль — Sociopath Network',
    description: 'Установите новый пароль для вашего аккаунта по ссылке из письма.',
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
};

export default function Page() {
    return (
        <AuthFormPageShell
            title="Reset password"
            description="Задайте новый пароль — после сохранения все старые сессии будут завершены."
        >
            <Suspense fallback={<LoadingComponent />}>
                <ResetPasswordFormWrapper />
            </Suspense>
            <AuthCardFooter>
                <p className="text-center text-sm text-muted-foreground">
                    Неверная ссылка?{' '}
                    <Link
                        href="/auth/forgot-password"
                        className="font-medium text-primary hover:underline"
                    >
                        Запросить ещё одну
                    </Link>
                </p>
            </AuthCardFooter>
        </AuthFormPageShell>
    );
}
