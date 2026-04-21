import { Metadata } from 'next';

import { AuthFormPageShell } from '@/modules/shared/ui';
import { RegisterAuthCardFooter } from '@/modules/widgets/auth';
import RegistrationFormWrapper from './RegistrationFormWrapper';

export const metadata: Metadata = {
    title: 'Регистрация — Sociopath Network',
    description:
        'Зарегистрируйтесь в приватном сообществе для общения и поиска единомышленников',
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
            title="Getting started"
            description="Create an account to continue and connect with the Sociopaths."
        >
            <RegistrationFormWrapper />
            <RegisterAuthCardFooter />
        </AuthFormPageShell>
    );
}
