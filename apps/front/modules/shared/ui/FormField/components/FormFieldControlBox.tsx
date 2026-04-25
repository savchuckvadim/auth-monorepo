import type { ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

type FormFieldControlBoxProps = {
    invalid: boolean;
    className?: string;
    children: ReactNode;
};

export function FormFieldControlBox({
    invalid,
    className,
    children,
}: FormFieldControlBoxProps) {
    return (
        <div
            className={cn(
                'outline-primary group rounded-2xl border-none text-foreground transition-colors duration-200',
                'bg-muted/55 dark:bg-muted/35',
                'focus-within:bg-background dark:focus-within:bg-card',
                'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
                invalid &&
                    'border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30',
                className,
            )}
        >
            {children}
        </div>
    );
}
