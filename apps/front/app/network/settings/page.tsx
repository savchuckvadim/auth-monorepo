'use client';

import { useAuth } from '@/modules/processes/auth/lib/hooks/auth.hook';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { SessionsList } from '@/modules/features/sessions';
import { ChangePasswordForm } from '@/modules/features/password';

export const dynamic = 'force-dynamic';

export default function NetworkSettingsPage() {
    const { currentUser } = useAuth();

    if (!currentUser || !currentUser?.id) {
        return <LoadingComponent />;
    }

    return (
        <div className="w-full flex flex-col gap-8 max-w-3xl mx-auto py-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
                <p className="text-sm text-muted-foreground">
                    Управление аккаунтом, паролем и активными устройствами.
                </p>
            </header>

            <section className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm">
                <SessionsList />
            </section>

            <section className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm">
                <ChangePasswordForm />
            </section>
        </div>
    );
}
