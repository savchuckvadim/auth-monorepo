'use client';

import { RefObject, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';

interface CameraViewProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onCancel: () => void;
}

export const CameraView = ({
    videoRef,
    isRecording,
    onStartRecording,
    onStopRecording,
    onCancel,
}: CameraViewProps) => {
    const [videoTransform, setVideoTransform] = useState<string>('');

    useEffect(() => {
        // Определяем правильную ориентацию видео на основе метаданных
        const checkVideoOrientation = () => {
            if (!videoRef.current) return;

            const video = videoRef.current;

            // Ждем загрузки метаданных
            const handleLoadedMetadata = () => {
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                // Если видео вертикальное (высота больше ширины), поворачиваем
                // Это часто происходит на мобильных устройствах
                if (videoHeight > videoWidth) {
                    // Проверяем ориентацию экрана
                    const isPortrait = window.innerHeight > window.innerWidth;
                    if (isPortrait) {
                        // На портретной ориентации экрана вертикальное видео не нужно поворачивать
                        setVideoTransform('');
                    } else {
                        // На альбомной ориентации поворачиваем на 90 градусов
                        setVideoTransform('rotate(90deg)');
                    }
                } else {
                    setVideoTransform('');
                }
            };

            if (video.readyState >= 1) {
                // Метаданные уже загружены
                handleLoadedMetadata();
            } else {
                video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            }

            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        };

        checkVideoOrientation();
    }, [videoRef]);

    return (
        <div className="relative min-w-full">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                className="w-full max-h-screen rounded-md"
                style={{
                    transform: videoTransform,
                    transformOrigin: 'center center',
                    objectFit: 'cover',
                }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {!isRecording ? (
                    <Button
                        type="button"
                        onClick={onStartRecording}
                        variant="default"
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Начать запись
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={onStopRecording}
                        variant="destructive"
                    >
                        Остановить
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                >
                    Отмена
                </Button>
            </div>
        </div>
    );
};

