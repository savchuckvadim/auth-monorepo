'use client';

import Image from 'next/image';
import { MessageAttachment } from '../../lib/types/messages.types';

interface ImageMessageAttachmentProps {
    attachment: MessageAttachment;
    onClick?: () => void;
}

/**
 * Одна картинка в сетке. Ограничиваем высоту и используем `object-cover`,
 * чтобы все тайлы в сетке были одинаковой высоты — иначе grid прыгает.
 */
export function ImageMessageAttachment({
    attachment,
    onClick,
}: ImageMessageAttachmentProps) {
    if (!attachment.url) return null;
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative block overflow-hidden rounded-md bg-muted"
            style={{ aspectRatio: '1 / 1' }}
            aria-label={attachment.name ?? 'Изображение'}
        >
            {/* next/image требует width/height или fill; у нас тайл с фикс.аспектом. */}
            <Image
                src={attachment.url}
                alt={attachment.name ?? ''}
                fill
                sizes="(max-width: 768px) 50vw, 320px"
                className="object-cover transition group-hover:brightness-95"
                unoptimized
            />
        </button>
    );
}
