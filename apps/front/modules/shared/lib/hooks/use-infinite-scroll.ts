'use client';
import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
    /** Есть ли следующая страница. Если `false` — sentinel не подгружает. */
    hasNext: boolean;
    /** Идёт ли сейчас подгрузка следующей страницы (чтобы не стрелять дубли). */
    isFetchingNext: boolean;
    /** Коллбек «загрузить следующую страницу». */
    fetchNext: () => void;
    /**
     * Расстояние в пикселях от низа контейнера, при достижении которого
     * запускается подгрузка. По умолчанию 400 px — достаточно, чтобы
     * подгрузка успевала до того, как пользователь действительно упрётся
     * в низ списка.
     */
    rootMargin?: string;
}

/**
 * IntersectionObserver-based infinite scroll для **не-виртуализированных**
 * или простых списков. Возвращает `ref`, который нужно повесить на
 * sentinel-элемент (невидимый div внизу списка).
 *
 * Для виртуализированных списков использовать `VirtualInfiniteList` /
 * `VirtualInfiniteGrid` — у них подгрузка уже встроена через `endReached` /
 * `scroll + overscan`.
 *
 * @example
 *   const sentinelRef = useInfiniteScroll({ hasNext, isFetchingNext, fetchNext });
 *   return (
 *     <>
 *       {items.map(...)}
 *       <div ref={sentinelRef} />
 *     </>
 *   );
 */
export function useInfiniteScroll({
    hasNext,
    isFetchingNext,
    fetchNext,
    rootMargin = '0px 0px 400px 0px',
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const fetchNextRef = useRef(fetchNext);
    fetchNextRef.current = fetchNext;

    useEffect(() => {
        if (!hasNext) return;
        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry?.isIntersecting && !isFetchingNext) {
                    fetchNextRef.current();
                }
            },
            { rootMargin },
        );
        observer.observe(node);
        return () => {
            observer.disconnect();
        };
    }, [hasNext, isFetchingNext, rootMargin]);

    return sentinelRef;
}
