'use client';

import type { ReactNode } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';

type AppDropdownMenuProps = {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'start' | 'center' | 'end';
    contentClassName?: string;
    /** Управляемое открытие (например из виджета-обёртки). */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

/**
 * Триггер + контент с типовой шириной; без лишней разметки в виджетах.
 */
export function AppDropdownMenu({
    trigger,
    children,
    align = 'end',
    contentClassName,
    open,
    onOpenChange,
}: AppDropdownMenuProps) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                className={cn('w-72', contentClassName)}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
