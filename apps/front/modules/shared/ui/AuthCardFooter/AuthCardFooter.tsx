import type { ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

type AuthCardFooterProps = {
    children: ReactNode;
    className?: string;
};

/** Нижняя зона карточки auth: только отступы и сетка, без доменных текстов. */
export function AuthCardFooter({ children, className }: AuthCardFooterProps) {
    return (
        <div className={cn('mt-4 space-y-6', className)}>{children}</div>
    );
}

/** Серая линия-разделитель между блоками футера. */
export function AuthCardFooterSeparator() {
    return <div className="h-px w-full bg-border" role="separator" />;
}
