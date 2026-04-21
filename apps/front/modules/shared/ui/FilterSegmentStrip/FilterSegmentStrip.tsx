'use client';

import { cn } from '@workspace/ui/lib/utils';

export type SegmentOption<T extends string> = {
    value: T;
    label: string;
};

type FilterSegmentStripProps<T extends string> = {
    value: T;
    onChange: (value: T) => void;
    options: SegmentOption<T>[];
    className?: string;
};

/**
 * Минималистичный фильтр: полоса на всю ширину без бордера, фон чуть отличается от страницы; пункты слева.
 */
export function FilterSegmentStrip<T extends string>({
    value,
    onChange,
    options,
    className,
}: FilterSegmentStripProps<T>) {
    return (
        <div
            role="tablist"
            className={cn(
                'flex w-full min-h-12 flex-wrap items-center justify-start gap-x-4 gap-y-1 rounded-xl bg-card px-3 py-2 text-sm dark:bg-muted/30',
                className,
            )}
        >
            {options.map((opt) => {
                const selected = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'cursor-pointer border-0 bg-transparent p-0 text-left text-sm transition-colors',
                            selected
                                ? 'font-medium text-primary'
                                : 'font-normal text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
