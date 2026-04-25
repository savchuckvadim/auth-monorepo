import type { ReactNode } from 'react';
import { AppCard, CardContent } from '@/modules/shared/ui/AppCard';
import { cn } from '@workspace/ui/lib/utils';

type AuthFormPageShellProps = {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    /** Доп. классы на карточку (тень, граница и т.д.) */
    cardClassName?: string;
};

/**
 * Заголовок и подзаголовок над карточкой + единая карточка для auth-форм (логин / регистрация).
 */
export function AuthFormPageShell({
    title,
    description,
    children,
    className,
    cardClassName,
}: AuthFormPageShellProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center px-4 pb-12 pt-6 sm:pt-10',
                className,
            )}
        >
            <div className="mb-8 w-full max-w-md space-y-2 text-center">
                <h1 className="text-3xl bold font-semibold tracking-tight">{title}</h1>
                {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            <AppCard className={cardClassName}>
                <CardContent className="p-4 py-0 sm:p-5 sm:py-0">{children}</CardContent>
            </AppCard>
        </div>
    );
}
