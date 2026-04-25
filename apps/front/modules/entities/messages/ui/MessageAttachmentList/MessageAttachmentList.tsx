'use client';

import { useState } from 'react';
import {
    MessageAttachment,
    MessageAttachmentKind,
} from '../../lib/types/messages.types';
import { ImageMessageAttachment } from './ImageMessageAttachment';
import { VideoMessageAttachment } from './VideoMessageAttachment';
import { FileMessageAttachment } from './FileMessageAttachment';
import { ImageLightbox } from './ImageLightbox';
import { CircleMessageVideo } from './CircleMessageVideo';
import { ForwardedMessageCard } from './ForwardedMessageCard';
import { SharedPostCard } from './SharedPostCard';
import { VoiceMessagePlayer } from '../VoiceMessage';
import { cn } from '@workspace/ui/lib/utils';

interface MessageAttachmentListProps {
    attachments: MessageAttachment[];
    isOwn: boolean;
}

/**
 * Рендерит вложения сообщения: группирует IMAGE-ы в сетку 1-4 и открывает
 * lightbox по клику, VIDEO/FILE — отдельно столбиком. Порядок — как пришёл
 * с бэка, без пересортировки (бэк возвращает в порядке загрузки).
 */
export function MessageAttachmentList({
    attachments,
    isOwn,
}: MessageAttachmentListProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const images = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.IMAGE && Boolean(a.url),
    );
    const videos = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.VIDEO && Boolean(a.url),
    );
    const files = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.FILE && Boolean(a.url),
    );
    const voices = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.VOICE && Boolean(a.url),
    );
    const circles = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.CIRCLE && Boolean(a.url),
    );
    const forwards = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.FORWARD_SNAPSHOT,
    );
    const sharedPosts = attachments.filter(
        (a) => a.kind === MessageAttachmentKind.POST_SHARE && Boolean(a.postId),
    );

    const hasAny =
        images.length > 0 ||
        videos.length > 0 ||
        files.length > 0 ||
        voices.length > 0 ||
        circles.length > 0 ||
        forwards.length > 0 ||
        sharedPosts.length > 0;
    if (!hasAny) return null;

    const imagesGridCols = Math.min(images.length, 2);

    return (
        <>
            <div className="mb-2 flex flex-col gap-2">
                {forwards.map((f) => (
                    <ForwardedMessageCard
                        key={f.id}
                        attachment={f}
                        tone={isOwn ? 'own' : 'incoming'}
                    />
                ))}

                {sharedPosts.map((s) => (
                    <SharedPostCard
                        key={s.id}
                        attachment={s}
                        tone={isOwn ? 'own' : 'incoming'}
                    />
                ))}

                {images.length > 0 ? (
                    <div
                        className={cn(
                            'grid gap-1',
                            imagesGridCols === 1
                                ? 'grid-cols-1'
                                : 'grid-cols-2',
                        )}
                    >
                        {images.map((img, idx) => (
                            <ImageMessageAttachment
                                key={img.id}
                                attachment={img}
                                onClick={() => setLightboxIndex(idx)}
                            />
                        ))}
                    </div>
                ) : null}

                {videos.map((v) => (
                    <VideoMessageAttachment key={v.id} attachment={v} />
                ))}

                {circles.map((c) => (
                    <CircleMessageVideo key={c.id} attachment={c} />
                ))}

                {voices.map((a) => (
                    <VoiceMessagePlayer
                        key={a.id}
                        attachment={a}
                        tone={isOwn ? 'own' : 'incoming'}
                    />
                ))}

                {files.map((f) => (
                    <FileMessageAttachment
                        key={f.id}
                        attachment={f}
                        tone={isOwn ? 'own' : 'incoming'}
                    />
                ))}
            </div>

            {lightboxIndex !== null ? (
                <ImageLightbox
                    images={images}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            ) : null}
        </>
    );
}
