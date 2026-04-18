'use client';

import type { ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

export type AppSurfaceVariant = 'default' | 'muted' | 'emphasis';

const variantClass: Record<AppSurfaceVariant, string> = {
    default: 'border-border bg-card shadow-sm',
    muted: 'border-muted/80 bg-muted/25 shadow-none',
    emphasis: 'border-primary/25 bg-card shadow-md',
};

type AppSurfaceCardProps = {
    className?: string;
    children: ReactNode;
    variant?: AppSurfaceVariant;
};

/**
 * Обёртка с едиными скруглением и бордером для карточек в ленте / списках.
 */
export function AppSurfaceCard({
    className,
    children,
    variant = 'default',
}: AppSurfaceCardProps) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl',
                variantClass[variant],
                className,
            )}
        >
            {children}
        </div>
    );
}
