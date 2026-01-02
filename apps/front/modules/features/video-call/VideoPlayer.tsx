'use client';

import { FC, useEffect, useRef } from 'react';
import { Card } from '@workspace/ui/components/card';

interface VideoPlayerProps {
    stream: MediaStream | null;
    name: string;
    isAudioMute?: boolean;
    className?: string;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
    stream,
    name,
    isAudioMute = false,
    className = '',
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const hasVideo = stream ? stream.getVideoTracks().length > 0 : false;
    const hasAudio = stream ? stream.getAudioTracks().length > 0 : false;

    useEffect(() => {
        if (!stream) return;
        console.log('🎬 [VIDEO PLAYER] Setting stream', {
            name,
            streamId: stream.id,
            audioTracks: stream.getAudioTracks().length,
            videoTracks: stream.getVideoTracks().length,
            audioTracksEnabled: stream.getAudioTracks().filter(t => t.enabled).length,
            isAudioMute,
            willBeMuted: isAudioMute,
            hasVideo,
            hasAudio
        });

        // Для видео используем video элемент
        if (hasVideo && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = isAudioMute;

            videoRef.current.play().catch((error) => {
                console.warn('⚠️ [VIDEO PLAYER] Video play failed', { name, error });
            });
        }

        // Для аудио используем audio элемент (особенно важно для аудио звонков)
        if (hasAudio && audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.muted = isAudioMute;

            // ВАЖНО: Для удаленного аудио нужно явно вызвать play()
            if (!isAudioMute) {
                audioRef.current.play().catch((error) => {
                    console.warn('⚠️ [VIDEO PLAYER] Audio play failed', { name, error });
                });
            }
        }

        // Логируем состояние после установки
        if (videoRef.current) {
            console.log('🎬 [VIDEO PLAYER] Video element state', {
                name,
                muted: videoRef.current.muted,
                paused: videoRef.current.paused,
                readyState: videoRef.current.readyState,
                hasVideo
            });
        }
        if (audioRef.current) {
            console.log('🎬 [VIDEO PLAYER] Audio element state', {
                name,
                muted: audioRef.current.muted,
                paused: audioRef.current.paused,
                readyState: audioRef.current.readyState,
                hasAudio
            });
        }
    }, [stream, isAudioMute, name, hasVideo, hasAudio]);

    return (
        <Card className={`relative overflow-hidden ${className}`}>
            {hasVideo && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isAudioMute}
                    className="w-full h-full object-cover"
                />
            )}
            {hasAudio && (
                <audio
                    ref={audioRef}
                    autoPlay
                    muted={isAudioMute}
                />
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {name}
            </div>
        </Card>
    );
};

