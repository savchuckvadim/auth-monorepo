'use client';

import { MessageAttachment } from '../../lib/types/messages.types';

interface VideoMessageAttachmentProps {
    attachment: MessageAttachment;
}

/**
 * HTML5-плеер. `preload="metadata"` — чтобы не качать всё видео до первого
 * воспроизведения, но длительность у браузера уже была.
 */
export function VideoMessageAttachment({
    attachment,
}: VideoMessageAttachmentProps) {
    if (!attachment.url) return null;
    return (
        <video
            src={attachment.url}
            poster={attachment.thumbnailUrl ?? undefined}
            controls
            preload="metadata"
            className="max-h-[60vh] w-full max-w-[360px] rounded-md bg-black"
        />
    );
}
