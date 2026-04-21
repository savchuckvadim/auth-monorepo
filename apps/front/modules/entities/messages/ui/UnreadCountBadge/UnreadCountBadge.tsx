'use client';

import { cn } from '@workspace/ui/lib/utils';

export type UnreadCountBadgeVariant = 'nav' | 'list';

const variantClass: Record<UnreadCountBadgeVariant, string> = {
    nav: 'absolute -top-1 -right-1 md:static md:ml-0 min-w-[1.125rem] h-[1.125rem] px-1 text-[10px]',
    list: 'min-w-[1.25rem] h-6 px-1.5 text-[11px]',
};

export interface UnreadCountBadgeProps {
    count: number;
    variant?: UnreadCountBadgeVariant;
    className?: string;
    /** e.g. "непрочитанных сообщений" */
    ariaLabelSuffix?: string;
}

/** Shared red unread counter (nav + chat list). */
export function UnreadCountBadge({
    count,
    variant = 'list',
    className,
    ariaLabelSuffix = 'непрочитанных',
}: UnreadCountBadgeProps) {
    if (count <= 0) return null;

    const label = `${count} ${ariaLabelSuffix}`;

    return (
        <span
            className={cn(
                'shrink-0 flex items-center justify-center rounded-full bg-[#F44848] font-semibold text-white leading-none',
                variantClass[variant],
                className,
            )}
            aria-label={label}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}
