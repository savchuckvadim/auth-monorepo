import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthFormPageShell, AuthCardFooter } from '@/modules/shared/ui';
import ForgotPasswordFormWrapper from './ForgotPasswordFormWrapper';

export const metadata: Metadata = {
    title: 'Восстановление пароля — Sociopath Network',
    description:
        'Запросите ссылку для сброса пароля на указанный email, если забыли свой пароль.',
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
            title="Forgot password"
            description="Введите email от аккаунта — пришлём одноразовую ссылку для сброса пароля."
        >
            <ForgotPasswordFormWrapper />
            <AuthCardFooter>
                <p className="text-center text-sm text-muted-foreground">
                    Вспомнили пароль?{' '}
                    <Link
                        href="/auth/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Войти
                    </Link>
                </p>
            </AuthCardFooter>
        </AuthFormPageShell>
    );
}
