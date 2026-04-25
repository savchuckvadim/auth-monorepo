'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@workspace/ui/lib/utils';

export interface VirtualInfiniteListProps<TItem> {
    /**
     * Плоский массив всех загруженных страниц (после `flatMap` по
     * `infiniteQuery.data.pages`). Виртуализация сама рендерит только
     * видимые элементы — список из 100k item'ов держится без проблем.
     */
    items: TItem[];
    /** Есть ли ещё страницы на сервере. */
    hasNext: boolean;
    /** Идёт ли подгрузка следующей страницы (для футера-спиннера). */
    isFetchingNext?: boolean;
    /** Коллбек «догрузить следующую страницу». */
    onEndReached: () => void;
    /** Рендер одного элемента. `index` пригождается для стилей «разделитель между». */
    renderItem: (item: TItem, index: number) => ReactNode;
    /** Что показывать, когда `items.length === 0` и подгрузка завершена. */
    renderEmpty?: ReactNode;
    /** Что показывать под списком во время подгрузки следующей страницы. */
    renderLoadingMore?: ReactNode;
    /** Хедер списка — фильтры, поиск, etc. Прокручивается вместе со списком. */
    renderHeader?: ReactNode;
    /**
     * Стабильный ключ для элемента. По умолчанию — `index`, но если у
     * сущности есть `id`, **обязательно** передать свой `computeItemKey`,
     * иначе на фильтрах/поиске Virtuoso может перепутать DOM-узлы.
     */
    computeItemKey?: (index: number, item: TItem) => string | number;
    /**
     * Сколько «пиксельного запаса» рендерить за пределами viewport
     * с каждой стороны. Больше = меньше «дырок» при быстром скролле,
     * но больше DOM-нод. По умолчанию 400.
     */
    overscan?: number;
    className?: string;
    style?: CSSProperties;
}

/**
 * Универсальная виртуализованная лента с бесконечной прокруткой
 * (Virtuoso под капотом).
 *
 * Подходит для **feed**-ов (посты, уведомления) и любого списка
 * с элементами **разной высоты**. Для grid'ов (карточки в 2-3
 * колонки) используй `VirtualInfiniteGrid`. Для сообщений в чате —
 * отдельную будущую обёртку `VirtualChatMessages` (reverse-scroll).
 *
 * @example
 *   <VirtualInfiniteList
 *     items={posts}
 *     hasNext={hasNextPage}
 *     isFetchingNext={isFetchingNextPage}
 *     onEndReached={fetchNextPage}
 *     renderItem={(post) => <PostCard post={post} />}
 *     computeItemKey={(_, post) => post.id}
 *     renderEmpty={<Empty>Нет постов</Empty>}
 *   />
 */
export function VirtualInfiniteList<TItem>({
    items,
    hasNext,
    isFetchingNext = false,
    onEndReached,
    renderItem,
    renderEmpty,
    renderLoadingMore,
    renderHeader,
    computeItemKey,
    overscan = 400,
    className,
    style,
}: VirtualInfiniteListProps<TItem>) {
    const handleEndReached = () => {
        if (hasNext && !isFetchingNext) {
            onEndReached();
        }
    };

    return (
        <Virtuoso
            data={items}
            endReached={handleEndReached}
            overscan={overscan}
            increaseViewportBy={overscan}
            className={cn('h-full w-full', className)}
            style={style}
            computeItemKey={
                computeItemKey
                    ? (index, item) => computeItemKey(index, item)
                    : undefined
            }
            itemContent={(index, item) => renderItem(item, index)}
            components={{
                Header: renderHeader ? () => <>{renderHeader}</> : undefined,
                Footer: () => {
                    if (isFetchingNext && renderLoadingMore) {
                        return <>{renderLoadingMore}</>;
                    }
                    return null;
                },
                EmptyPlaceholder:
                    items.length === 0 && !isFetchingNext && renderEmpty
                        ? () => <>{renderEmpty}</>
                        : undefined,
            }}
        />
    );
}
