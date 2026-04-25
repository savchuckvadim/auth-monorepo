'use client';

import type { ReactNode } from 'react';
import { Card } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

type AppCardProps = {
    className?: string;
    children: ReactNode;
};

/**
 * Карточка с типовой шириной для диалогов и панелей; без лишней разметки в виджетах.
 */
export function AppCard({ className, children }: AppCardProps) {
    return (
        <Card className={cn('w-full max-w-md border-none', className)}>{children}</Card>
    );
}

export {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
