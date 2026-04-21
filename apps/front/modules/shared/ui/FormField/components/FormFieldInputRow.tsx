import type { ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

import { FORM_FIELD_INPUT_ROW } from './form-field.constants';

type FormFieldInputRowProps = {
    children: ReactNode;
    className?: string;
};

export function FormFieldInputRow({
    children,
    className,
}: FormFieldInputRowProps) {
    return (
        <div
            className={cn(
                'relative flex w-full items-center gap-2.5 px-3',
                FORM_FIELD_INPUT_ROW,
                className,
            )}
        >
            {children}
        </div>
    );
}
