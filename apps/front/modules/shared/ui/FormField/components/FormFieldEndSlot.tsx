import type { ReactNode } from 'react';

type FormFieldEndSlotProps = {
    children: ReactNode;
};

export function FormFieldEndSlot({ children }: FormFieldEndSlotProps) {
    return (
        <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-0.5">
            {children}
        </div>
    );
}
