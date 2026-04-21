import { Metadata } from 'next';

import { AuthFormPageShell } from '@/modules/shared/ui';
import { LoginAuthCardFooter } from '@/modules/widgets/auth';
import LoginFormWrapper from './LoginFormWrapper';

export const metadata: Metadata = {
    title: 'Вход в систему — Sociopath Network',
    description: 'Войдите в свой аккаунт для доступа к приватному сообществу',
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
            title="Log in"
            description="Use your email and password to continue"
        >
            <LoginFormWrapper />
            <LoginAuthCardFooter />
        </AuthFormPageShell>
    );
}
