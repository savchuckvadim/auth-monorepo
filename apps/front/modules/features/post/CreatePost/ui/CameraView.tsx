'use client';

import { RefObject, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { RotateCcw } from 'lucide-react';

interface CameraViewProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    isRecording: boolean;
    facingMode: 'user' | 'environment';
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSwitchCamera: () => void;
    onCancel: () => void;
}

export const CameraView = ({
    videoRef,
    isRecording,
    facingMode,
    onStartRecording,
    onStopRecording,
    onSwitchCamera,
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

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="relative min-w-full">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                className={`w-full rounded-md ${isMobile ? 'aspect-[4/5]' : 'max-h-screen'}`}
                style={{
                    transform: videoTransform,
                    transformOrigin: 'center center',
                    objectFit: 'cover',
                }}
            />
            {/* Кнопка переключения камеры - только на мобильных и когда не записываем */}
            {isMobile && !isRecording && (
                <Button
                    type="button"
                    onClick={onSwitchCamera}
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white border-white/30"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
            )}
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

