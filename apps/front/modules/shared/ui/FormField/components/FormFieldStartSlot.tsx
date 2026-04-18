import type { ReactNode } from 'react';

type FormFieldStartSlotProps = {
    children: ReactNode;
};

export function FormFieldStartSlot({ children }: FormFieldStartSlotProps) {
    return (
        <span
            className="-ml-0.5 flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-200 group-focus-within:text-primary"
            aria-hidden
        >
            {children}
        </span>
    );
}
