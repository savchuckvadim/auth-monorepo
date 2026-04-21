'use client';

import type { ReactNode } from 'react';
import { DropdownMenuItem } from '@/modules/shared';
import { cn } from '@workspace/ui/lib/utils';

export type PolicyToggleMenuRowProps = {
    icon: ReactNode;
    label: string;
    active: boolean;
    detail?: string;
    onActivate: () => void;
};

export function PolicyToggleMenuRow({
    icon,
    label,
    active,
    detail,
    onActivate,
}: PolicyToggleMenuRowProps) {
    return (
        <DropdownMenuItem
            className="flex flex-col items-start gap-1 py-2"
            onSelect={e => {
                e.preventDefault();
                onActivate();
            }}
        >
            <span className="flex w-full items-center justify-between gap-2 font-medium">
                <span className="inline-flex items-center gap-1.5">
                    {icon}
                    {label}
                </span>
                <span
                    className={cn(
                        'text-[10px] uppercase tracking-wide',
                        active
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-muted-foreground',
                    )}
                >
                    {active ? 'вкл' : 'выкл'}
                </span>
            </span>
            {detail ? (
                <span className="text-xs text-muted-foreground">{detail}</span>
            ) : null}
        </DropdownMenuItem>
    );
}
