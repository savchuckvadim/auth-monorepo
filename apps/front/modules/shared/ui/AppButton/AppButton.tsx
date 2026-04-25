'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

const sizeClass = {
    /** Формы входа / регистрации: полная ширина, 48px */
    auth: 'h-12 w-full min-w-0 px-4 text-sm',
    /** Карточки людей, профиль: 40px */
    md: 'h-10 min-w-0 px-4',
    sm: 'h-9 min-w-0 px-3 text-sm',
    lg: 'h-11 min-w-0 px-5',
    /**
     * Карточка пользователя Follow/Unfollow: выше на десктопе (макет «толстая» кнопка).
     */
    userCard: 'h-11 min-w-0 w-full px-4 text-sm md:h-14 md:px-5 md:text-base',
} as const;

export type AppButtonSize = keyof typeof sizeClass;

export type AppButtonProps = Omit<ComponentProps<typeof Button>, 'size'> & {
    isLoading?: boolean;
    loadingLabel?: ReactNode;
    /** Иконка слева в обычном состоянии (как LogIn, UserPlus). */
    leadIcon?: ReactNode;
    /** Размер: `auth` — как на экранах логина; `md` — 40px для карточек. */
    appSize?: AppButtonSize;
    type?: 'button' | 'submit' | 'reset';
};

/**
 * Кнопка приложения: единый спиннер при `isLoading`, отступы для форм и карточек.
 */
export function AppButton({
    className,
    isLoading = false,
    loadingLabel,
    leadIcon,
    children,
    disabled,
    appSize = 'md',
    variant = 'default',
    type = 'button',
    ...rest
}: AppButtonProps) {
    const showSpinner = Boolean(isLoading);
    return (
        <Button
            type={type}
            variant={variant}
            disabled={disabled || showSpinner}
            className={cn(sizeClass[appSize], className)}
            {...rest}
        >
            {showSpinner ? (
                <>
                    <Loader2
                        className={cn(
                            'h-4 w-4 shrink-0 animate-spin',
                            variant === 'default' && 'text-primary-foreground',
                            variant !== 'default' && 'text-muted-foreground',
                        )}
                        aria-hidden
                    />
                    {loadingLabel ?? children}
                </>
            ) : (
                <>
                    {leadIcon ? (
                        <span className="inline-flex shrink-0 [&_svg]:size-4">
                            {leadIcon}
                        </span>
                    ) : null}
                    {children}
                </>
            )}
        </Button>
    );
}
