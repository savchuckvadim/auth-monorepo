'use client';

import { useEffect, useState } from 'react';
import type { MouseEventHandler, RefObject } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

export interface BackToTopButtonProps {
    /**
     * Ref на скроллящийся контейнер. Если не передать — слушаем `window`
     * (страничный скролл). Для virtuoso / tanstack-virtual — обычно
     * скролл на `<Virtuoso>` или `parentRef`.
     */
    containerRef?: RefObject<HTMLElement | null>;
    /** После скольких пикселей сверху показывать кнопку. По умолчанию 320. */
    showAfter?: number;
    /** Дополнительные классы. */
    className?: string;
    /** Подпись для a11y. */
    ariaLabel?: string;
}

/**
 * Плавающая кнопка «наверх», появляющаяся после скролла вниз. Работает
 * и с window-скроллом, и с любым DOM-контейнером через `containerRef`.
 *
 * @example
 *   // Страничный скролл:
 *   <BackToTopButton />
 *
 *   // Внутри скроллящегося контейнера:
 *   const scrollRef = useRef<HTMLDivElement>(null);
 *   <div ref={scrollRef} className="overflow-auto">...</div>
 *   <BackToTopButton containerRef={scrollRef} />
 */
export function BackToTopButton({
    containerRef,
    showAfter = 320,
    className,
    ariaLabel = 'Наверх',
}: BackToTopButtonProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target: Window | HTMLElement =
            containerRef?.current ?? window;
        const getScrollTop = () =>
            target instanceof Window
                ? window.scrollY
                : target.scrollTop;

        const onScroll = () => {
            setVisible(getScrollTop() > showAfter);
        };

        onScroll();
        target.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            target.removeEventListener('scroll', onScroll);
        };
    }, [containerRef, showAfter]);

    const onClick: MouseEventHandler<HTMLButtonElement> = () => {
        const target: Window | HTMLElement =
            containerRef?.current ?? window;
        if (target instanceof Window) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            target.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={ariaLabel}
            title={ariaLabel}
            onClick={onClick}
            className={cn(
                'fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-opacity duration-200',
                visible
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0',
                className,
            )}
        >
            <ArrowUp className="size-5" />
        </Button>
    );
}
