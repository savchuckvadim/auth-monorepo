'use client';
import { useEffect, useState } from 'react';

/**
 * Возвращает значение, «застывшее» после тишины длиной `delay` мс.
 *
 * Классический debouncer для поисковых полей: пока пользователь печатает,
 * запрос на сервер не уходит — но как только ввод прекратился на `delay` мс,
 * возвращаемое значение обновляется и потребитель может перерендериться /
 * запустить fetch.
 *
 * @example
 *   const [raw, setRaw] = useState('');
 *   const search = useDebouncedValue(raw, 300);
 *   useInfiniteQuery({ queryKey: ['users', search], ... });
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
