import type { ReactNode } from 'react';
import { Label } from '@workspace/ui/components/label';

type FormFieldLabelProps = {
    htmlFor: string;
    children: ReactNode;
};

export function FormFieldLabel({ htmlFor, children }: FormFieldLabelProps) {
    return (
        <Label
            htmlFor={htmlFor}
            className="block text-xs font-medium text-muted-foreground"
        >
            {children}
        </Label>
    );
}
