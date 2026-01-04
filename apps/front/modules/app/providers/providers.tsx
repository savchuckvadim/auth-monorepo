'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AppProvider } from '@/modules/app';
import { AprilThemeProvider } from '@workspace/theme';
import { ReactQueryProvider } from './tanstack-query.provider';

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
                    <AppProvider>{children}</AppProvider>
                </ReactQueryProvider>
            </AprilThemeProvider>
        </NextThemesProvider>
    );
}
