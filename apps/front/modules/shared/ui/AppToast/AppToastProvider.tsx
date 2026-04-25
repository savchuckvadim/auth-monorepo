'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type {
    AppToastContextValue,
    AppToastInput,
    AppToastItem,
} from './app-toast.types';
import { AppToastViewport } from './components/AppToastViewport';

const AppToastContext = createContext<AppToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [toasts, setToasts] = useState<AppToastItem[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (input: AppToastInput) => {
            const { title, description, variant = 'info' } = input;
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            setToasts((prev) => {
                if (
                    input.dedupeKey &&
                    prev.some((toast) => toast.dedupeKey === input.dedupeKey)
                ) {
                    return prev;
                }
                return [
                    ...prev,
                    {
                        id,
                        title,
                        description,
                        variant,
                        dedupeKey: input.dedupeKey,
                        href: input.href,
                        onClick: input.onClick,
                    },
                ];
            });
            window.setTimeout(() => dismissToast(id), 5000);
        },
        [dismissToast],
    );

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <AppToastContext.Provider value={value}>
            {children}
            <AppToastViewport
                toasts={toasts}
                router={router}
                onDismiss={dismissToast}
            />
        </AppToastContext.Provider>
    );
}

export function useAppToast(): AppToastContextValue {
    const ctx = useContext(AppToastContext);
    if (!ctx) {
        throw new Error('useAppToast must be used within AppToastProvider');
    }
    return ctx;
}
