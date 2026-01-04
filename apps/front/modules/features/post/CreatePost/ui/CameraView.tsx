'use client';

import { RefObject } from 'react';
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
    return (
        <div className="relative min-w-full">
            <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-h-screen rounded-md"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {!isRecording ? (
                    <Button
                        type="button"
                        onClick={onStartRecording}
                        variant="default"
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

