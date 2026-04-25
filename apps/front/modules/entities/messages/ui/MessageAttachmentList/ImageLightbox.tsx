'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MessageAttachment } from '../../lib/types/messages.types';

interface ImageLightboxProps {
    images: MessageAttachment[];
    initialIndex: number;
    onClose: () => void;
}

/**
 * Минималистичный lightbox без внешних зависимостей: оверлей + стрелки +
 * закрытие по Escape/клику по фону. Рендерится через портал, чтобы не
 * наследовать z-index от message bubble.
 */
export function ImageLightbox({
    images,
    initialIndex,
    onClose,
}: ImageLightboxProps) {
    const [index, setIndex] = useState(initialIndex);

    const goPrev = useCallback(() => {
        setIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const goNext = useCallback(() => {
        setIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [goPrev, goNext, onClose]);

    if (typeof document === 'undefined') return null;
    const current = images[index];
    if (!current?.url) return null;

    const canNavigate = images.length > 1;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <button
                type="button"
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                aria-label="Закрыть"
            >
                <X className="h-5 w-5" />
            </button>
            {canNavigate ? (
                <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                    onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                    }}
                    aria-label="Назад"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={current.url}
                alt={current.name ?? ''}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
            />
            {canNavigate ? (
                <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                    onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                    }}
                    aria-label="Вперёд"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            ) : null}
        </div>,
        document.body,
    );
}
