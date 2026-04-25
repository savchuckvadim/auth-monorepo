'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AppProvider } from '@/modules/app';
import { AprilThemeProvider } from '@workspace/theme';
import { ReactQueryProvider } from './tanstack-query.provider';
import { AppToastProvider } from '@/modules/shared/ui';
// Side-effect: конфигурируем axios-клиент из @workspace/nest-api на первом
// импорте провайдеров. Это гарантирует, что baseURL и onSessionExpired
// будут выставлены до первого API-запроса со страниц.
import './back-api.bootstrap';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="sociopath-dark"
            themes={['sociopath-light', 'sociopath-dark']}
            enableSystem={false}
            disableTransitionOnChange
            enableColorScheme
            storageKey="theme"
        >      <AprilThemeProvider >
                <ReactQueryProvider>
                    <AppToastProvider>
                        <AppProvider>{children}</AppProvider>
                    </AppToastProvider>
                </ReactQueryProvider>
            </AprilThemeProvider>
        </NextThemesProvider>
    );
}
