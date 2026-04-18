'use client';

import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';

type AppDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    contentClassName?: string;
};

/**
 * Готовый состав Dialog: оболочка + заголовок/описание + тело + опциональный футер.
 */
export function AppDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    contentClassName,
}: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('sm:max-w-md', contentClassName)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? (
                        <DialogDescription>{description}</DialogDescription>
                    ) : null}
                </DialogHeader>
                {children}
                {footer ? (
                    <DialogFooter className="gap-2 sm:gap-0">{footer}</DialogFooter>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
