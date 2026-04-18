'use client';
import { Provider } from 'react-redux';
import { store } from '../model/store';
import { ErrorBoundary } from './error-boundry.provider';
import App from '../ui/App';
import { NotificationsProvider } from '@/modules/features/notifiactions';
import { AuthSessionListener } from '@/modules/processes/auth/ui/AuthSessionListener/AuthSessionListener';
import { useEffect, useState } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.store = store;
        }
    }, [isClient]);

    return (
        <Provider store={store}>
            <ErrorBoundary>
                <App>
                    <AuthSessionListener />
                    <NotificationsProvider>
                        {children}
                    </NotificationsProvider>
                </App>
            </ErrorBoundary>
        </Provider>
    );
}
