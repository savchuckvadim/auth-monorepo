'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MessageAttachment } from '../../lib/types/messages.types';

interface CircleMessageVideoProps {
    attachment: MessageAttachment;
}

/**
 * Telegram-style кружочек 240x240. По клику — unmute, как в реальных
 * мессенджерах. Автоплей muted в loop (коротких видео).
 */
export function CircleMessageVideo({ attachment }: CircleMessageVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        // iOS требует muted + playsinline для autoplay.
        v.muted = true;
        v.play().catch(() => {
            /* ignore */
        });
    }, [attachment.url]);

    if (!attachment.url) return null;

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
        if (!v.muted) v.play().catch(() => undefined);
    };

    return (
        <button
            type="button"
            onClick={toggleMute}
            className="group relative h-[240px] w-[240px] overflow-hidden rounded-full bg-black"
            aria-label={muted ? 'Включить звук' : 'Выключить звук'}
        >
            <video
                ref={videoRef}
                src={attachment.url}
                poster={attachment.thumbnailUrl ?? undefined}
                autoPlay
                loop
                playsInline
                muted={muted}
                className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 p-2 text-white opacity-90 transition group-hover:opacity-100">
                {muted ? (
                    <VolumeX className="h-4 w-4" />
                ) : (
                    <Volume2 className="h-4 w-4" />
                )}
            </div>
        </button>
    );
}
