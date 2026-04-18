'use client';

import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';
import { NAME_MAX_CHARS } from '../lib/user-person-card.consts';

export type TruncatedNameWithTooltipProps = {
    name: string;
    href?: string;
    className?: string;
};

export function TruncatedNameWithTooltip({
    name,
    href,
    className,
}: TruncatedNameWithTooltipProps) {
    const needsTip = name.length > NAME_MAX_CHARS;
    const display = needsTip
        ? `${name.slice(0, NAME_MAX_CHARS).trimEnd()}…`
        : name;

    const inner = (
        <span
            className={cn(
                'block min-h-7 max-w-full truncate text-center text-base font-semibold leading-tight text-foreground',
                href && 'hover:underline',
                className,
            )}
        >
            {needsTip ? display : name}
        </span>
    );

    const linked = href ? (
        <Link href={href} className="min-w-0 outline-none">
            {inner}
        </Link>
    ) : (
        inner
    );

    if (!needsTip) {
        return linked;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="block min-w-0">{linked}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
                {name}
            </TooltipContent>
        </Tooltip>
    );
}
