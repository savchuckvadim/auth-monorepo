'use client';

import type { ComponentProps, ReactElement, ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';

export type AppTooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type AppTooltipAlign = 'start' | 'center' | 'end';

export interface AppTooltipProps {
    /**
     * Содержимое всплывающей подсказки. Если пусто (undefined / null / false /
     * пустая строка) — тултип **не** рендерится, и `children` возвращается как
     * есть без обёртки. Удобно, чтобы на месте использования не приходилось
     * писать `content ? <Tooltip>...</Tooltip> : children`.
     */
    content?: ReactNode;
    children: ReactElement;
    side?: AppTooltipSide;
    align?: AppTooltipAlign;
    sideOffset?: number;
    className?: string;
    /** Пробрасывается в radix Root — нужен, например, для `open`/`onOpenChange`. */
    rootProps?: Omit<
        ComponentProps<typeof Tooltip>,
        'children' | 'defaultOpen' | 'open' | 'onOpenChange'
    > & {
        defaultOpen?: boolean;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    };
}

function isEmptyContent(content: ReactNode): boolean {
    if (content === null || content === undefined || content === false) {
        return true;
    }
    if (typeof content === 'string' && content.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * Обёртка над radix tooltip в одну строку.
 *
 * @example
 *   <AppTooltip content="Перейти в защищённый чат">
 *     <AppButton ... />
 *   </AppTooltip>
 *
 * Если `content` пустой — рендерится ровно `children`, без radix-обвязки,
 * поэтому не будет ни лишних провайдеров, ни мигающей пустой подсказки.
 */
export function AppTooltip({
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 4,
    className,
    rootProps,
}: AppTooltipProps) {
    if (isEmptyContent(content)) {
        return children;
    }

    return (
        <Tooltip {...rootProps}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                className={className}
            >
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
