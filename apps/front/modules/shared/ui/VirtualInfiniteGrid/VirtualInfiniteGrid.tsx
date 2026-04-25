'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@workspace/ui/lib/utils';

export interface VirtualInfiniteGridProps<TItem> {
    /** Плоский массив всех загруженных элементов. */
    items: TItem[];
    /** Количество колонок. Снаружи при желании меняется через `useMediaQuery`. */
    columns: number;
    /** Оценка высоты одной «ячейки» в пикселях (без учёта `gap`). */
    estimateRowHeight: number;
    /** Есть ли ещё страницы. */
    hasNext: boolean;
    /** Идёт ли сейчас подгрузка. */
    isFetchingNext?: boolean;
    /** Коллбек «догрузить следующую страницу». */
    onEndReached: () => void;
    /** Рендер одной ячейки. */
    renderItem: (item: TItem, index: number) => ReactNode;
    /** Плейсхолдер при пустом списке. */
    renderEmpty?: ReactNode;
    /** Плейсхолдер внизу во время подгрузки следующей страницы. */
    renderLoadingMore?: ReactNode;
    /** Стабильный ключ элемента; **обязательно** передавать, если есть `id`. */
    getItemKey?: (item: TItem, index: number) => string | number;
    /** Сколько строк держать вне viewport с каждой стороны. Default 5. */
    overscan?: number;
    /** Зазор между ячейками (px). */
    gap?: number;
    className?: string;
    style?: CSSProperties;
}

/**
 * Grid-версия виртуализированной бесконечной ленты — для списков с
 * **равной** высотой карточек (пользователи, плитки товаров, превью
 * групп). Под капотом `@tanstack/react-virtual` на строках, внутри
 * строки — обычный CSS grid.
 *
 * Когда скролл приближается к последней виртуализованной строке,
 * вызывается `onEndReached`. Дедупликация — ответственность
 * вызывающей стороны (React Query `useInfiniteQuery` сам это делает
 * при правильном `getNextPageParam`).
 */
export function VirtualInfiniteGrid<TItem>({
    items,
    columns,
    estimateRowHeight,
    hasNext,
    isFetchingNext = false,
    onEndReached,
    renderItem,
    renderEmpty,
    renderLoadingMore,
    getItemKey,
    overscan = 5,
    gap = 0,
    className,
    style,
}: VirtualInfiniteGridProps<TItem>) {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const rowCount = Math.ceil(items.length / Math.max(columns, 1));

    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateRowHeight + gap,
        overscan,
    });

    const virtualRows = virtualizer.getVirtualItems();
    const lastVirtualRow = virtualRows[virtualRows.length - 1];

    useEffect(() => {
        if (!hasNext || isFetchingNext) return;
        if (!lastVirtualRow) return;
        if (rowCount === 0) return;
        if (lastVirtualRow.index >= rowCount - 1) {
            onEndReached();
        }
    }, [hasNext, isFetchingNext, lastVirtualRow, rowCount, onEndReached]);

    if (items.length === 0 && !isFetchingNext) {
        return renderEmpty ? <>{renderEmpty}</> : null;
    }

    return (
        <div
            ref={parentRef}
            className={cn('h-full w-full overflow-auto', className)}
            style={style}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    position: 'relative',
                    width: '100%',
                }}
            >
                {virtualRows.map(row => {
                    const startIdx = row.index * columns;
                    const rowItems = items.slice(startIdx, startIdx + columns);
                    return (
                        <div
                            key={row.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${row.start}px)`,
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                                gap,
                            }}
                        >
                            {rowItems.map((item, colIdx) => {
                                const index = startIdx + colIdx;
                                return (
                                    <div
                                        key={
                                            getItemKey
                                                ? getItemKey(item, index)
                                                : index
                                        }
                                    >
                                        {renderItem(item, index)}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {isFetchingNext && renderLoadingMore ? (
                <div className="py-4">{renderLoadingMore}</div>
            ) : null}
        </div>
    );
}
