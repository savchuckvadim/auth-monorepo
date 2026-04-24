'use client';

import { useState } from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

import { AppButton, AppConfirmDialog } from '@/modules/shared';

import { useSessions } from '../lib/hooks/useSessions';
import { SessionItem } from './SessionItem';

/**
 * Лёгкий скелетон одной сессии — повторяет layout `SessionItem`,
 * чтобы при загрузке не было визуального «скачка» контента. Использует
 * `animate-pulse` из tailwind и цвета темы.
 */
function SessionItemSkeleton() {
    return (
        <li className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="min-w-0 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted/80" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted/60" />
                </div>
            </div>
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        </li>
    );
}

/**
 * Полный раздел «Активные сессии» для страницы настроек. Под капотом:
 *  1. Загружает список сессий через `useSessions`.
 *  2. Позволяет ревокнуть отдельную сессию.
 *  3. Кнопка «Выйти со всех устройств» с подтверждением.
 */
export function SessionsList() {
    const {
        sessions,
        isLoading,
        error,
        revokeSessionAsync,
        pendingRevokeId,
        revokeAllSessionsAsync,
        isRevokingAll,
    } = useSessions();

    const [logoutAllOpen, setLogoutAllOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground">Активные сессии</h2>
                        <p className="text-sm text-muted-foreground">
                            Устройства, с которых сейчас выполнен вход.
                        </p>
                    </div>
                </div>
                <ul className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SessionItemSkeleton key={index} />
                    ))}
                </ul>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <div className="space-y-1">
                    <p className="font-medium">Не удалось загрузить активные сессии</p>
                    <p className="text-destructive/80">
                        {error instanceof Error ? error.message : 'Попробуйте ещё раз позже.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-foreground">Активные сессии</h2>
                    <p className="text-sm text-muted-foreground">
                        Устройства, с которых сейчас выполнен вход. Если видите что-то незнакомое — завершите сессию и смените пароль.
                    </p>
                </div>
                <AppButton
                    appSize="sm"
                    variant="destructive"
                    onClick={() => setLogoutAllOpen(true)}
                    isLoading={isRevokingAll}
                    loadingLabel="Завершаем..."
                    leadIcon={<LogOut />}
                >
                    Выйти со всех устройств
                </AppButton>
            </div>

            {sessions.length === 0 ? (
                <p className="rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
                    Активных сессий не найдено.
                </p>
            ) : (
                <ul className="space-y-3">
                    {sessions.map((session) => (
                        <SessionItem
                            key={session.id}
                            session={session}
                            onRevoke={(id) => {
                                void revokeSessionAsync(id);
                            }}
                            isRevoking={pendingRevokeId === session.id}
                        />
                    ))}
                </ul>
            )}

            <AppConfirmDialog
                open={logoutAllOpen}
                onOpenChange={setLogoutAllOpen}
                title="Выйти со всех устройств?"
                description="Все ваши активные сессии будут завершены, включая текущее окно. Придётся залогиниться заново везде."
                cancelLabel="Отмена"
                confirmLabel="Выйти везде"
                confirmVariant="destructive"
                isConfirming={isRevokingAll}
                onCancel={() => setLogoutAllOpen(false)}
                onConfirm={async () => {
                    await revokeAllSessionsAsync();
                    setLogoutAllOpen(false);
                    if (typeof window !== 'undefined') {
                        window.location.replace('/auth/login');
                    }
                }}
            />
        </div>
    );
}
