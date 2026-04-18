import { useCallback, useRef } from 'react';

/**
 * Как RxJS {@link https://rxjs.dev/api/operators/exhaustMap exhaustMap}: пока выполняется
 * предыдущий вызов async-функции, последующие вызовы отбрасываются (не ставятся в очередь).
 *
 * Удобно для отправки по Enter/кнопке без двойного сабмита до ре-рендера и без зависимости
 * от `isPending`. Это не debounce/throttle по времени — только «один полёт».
 */
export function useExhaustingCallback<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult | void>,
): (...args: TArgs) => Promise<TResult | void | undefined> {
    const busy = useRef(false);
    const fnRef = useRef(fn);
    fnRef.current = fn;

    return useCallback(async (...args: TArgs) => {
        if (busy.current) {
            return undefined;
        }
        busy.current = true;
        try {
            return await fnRef.current(...args);
        } finally {
            busy.current = false;
        }
    }, []);
}
