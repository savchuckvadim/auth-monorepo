'use client';

import { useSearchParams } from 'next/navigation';

import { ResetPasswordForm } from '@/modules/features/password';

export default function ResetPasswordFormWrapper() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return <ResetPasswordForm token={token} />;
}
