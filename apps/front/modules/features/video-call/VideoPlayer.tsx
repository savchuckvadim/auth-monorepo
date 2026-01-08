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
                hasVideo,
                videoWidth: videoRef.current.videoWidth,
                videoHeight: videoRef.current.videoHeight,
                streamActive: stream.active,
                streamVideoTracks: stream.getVideoTracks().length,
                streamVideoTracksActive: stream.getVideoTracks().filter(t => t.readyState === 'live').length
            });

            // Отслеживаем изменения readyState
            const checkReadyState = () => {
                if (videoRef.current) {
                    const currentReadyState = videoRef.current.readyState;
                    if (currentReadyState > 0) {
                        console.log('✅ [VIDEO PLAYER] Video readyState changed', {
                            name,
                            readyState: currentReadyState,
                            readyStateText: ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][currentReadyState],
                            videoWidth: videoRef.current.videoWidth,
                            videoHeight: videoRef.current.videoHeight
                        });
                    }
                }
            };

            // Проверяем readyState через небольшие интервалы
            const readyStateInterval = setInterval(() => {
                if (videoRef.current && videoRef.current.readyState > 0) {
                    clearInterval(readyStateInterval);
                    checkReadyState();
                }
            }, 100);

            // Очищаем интервал через 5 секунд
            setTimeout(() => clearInterval(readyStateInterval), 5000);

            // Также слушаем события
            videoRef.current.addEventListener('loadedmetadata', () => {
                console.log('📹 [VIDEO PLAYER] Video metadata loaded', { name });
            });
            videoRef.current.addEventListener('loadeddata', () => {
                console.log('📹 [VIDEO PLAYER] Video data loaded', { name });
            });
            videoRef.current.addEventListener('canplay', () => {
                console.log('▶️ [VIDEO PLAYER] Video can play', { name });
            });
        }
        if (audioRef.current) {
            console.log('🎬 [VIDEO PLAYER] Audio element state', {
                name,
                muted: audioRef.current.muted,
                paused: audioRef.current.paused,
                readyState: audioRef.current.readyState,
                hasAudio,
                streamActive: stream.active,
                streamAudioTracks: stream.getAudioTracks().length,
                streamAudioTracksActive: stream.getAudioTracks().filter(t => t.readyState === 'live').length
            });
        }
    }, [stream, isAudioMute, name, hasVideo, hasAudio]);

    // Определяем, нужно ли использовать Card (для маленького видео) или просто div (для большого)
    const useCard = !className.includes('rounded-none');
    const Container = useCard ? Card : 'div';

    return (
        <Container className={`relative overflow-hidden ${className}`}>
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
            {name && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                    {name}
                </div>
            )}
        </Container>
    );
};

