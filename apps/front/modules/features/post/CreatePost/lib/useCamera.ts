'use client';
import { useRef, useState } from 'react';

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const startCamera = async (initialFacingMode?: 'user' | 'environment'): Promise<void> => {
        try {
            console.log('🎥 Starting camera...');

            // Определяем, какая камера нужна
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const currentFacingMode = initialFacingMode || (isMobile ? 'environment' : 'user');
            setFacingMode(currentFacingMode);

            // Для мобильных используем более квадратный формат (4:5 как в Instagram)
            // Для десктопа - стандартный 16:9
            const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const videoConstraints = isMobileDevice
                ? {
                    facingMode: currentFacingMode,
                    width: { ideal: 1080 },
                    height: { ideal: 1350 }, // 4:5 формат (1080x1350)
                    aspectRatio: { ideal: 0.8 } // 4/5 = 0.8
                }
                : {
                    facingMode: currentFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                };

            const stream = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
                audio: true
            });
            console.log('✅ Camera stream obtained:', stream);
            mediaStreamRef.current = stream;
            setIsCameraActive(true);
            console.log('✅ isCameraActive set to true');

            // Небольшая задержка для установки srcObject
            await new Promise(resolve => setTimeout(resolve, 100));

            if (videoRef.current) {
                // Важно для iOS - предотвращает полноэкранный режим
                videoRef.current.setAttribute('playsinline', 'true');
                videoRef.current.setAttribute('webkit-playsinline', 'true');
                videoRef.current.setAttribute('x5-playsinline', 'true');

                videoRef.current.srcObject = stream;

                // Ждем загрузки метаданных для правильной ориентации
                await new Promise<void>((resolve) => {
                    if (videoRef.current) {
                        const handleLoadedMetadata = () => {
                            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
                            resolve();
                        };
                        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
                    } else {
                        resolve();
                    }
                });

                await videoRef.current.play().catch(error => {
                    console.error('Error playing video:', error);
                });
                console.log('✅ Video element playing');
            } else {
                console.warn('⚠️ videoRef.current is null');
            }
        } catch (error) {
            console.error('❌ Error accessing camera:', error);
            alert('Не удалось получить доступ к камере');
            setIsCameraActive(false);
            throw error;
        }
    };

    const switchCamera = async (): Promise<void> => {
        if (!isCameraActive) return;

        console.log('🔄 Switching camera...');
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';

        // Останавливаем текущий stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            mediaStreamRef.current = null;
        }

        // Запускаем новую камеру
        await startCamera(newFacingMode);
    };

    const stopCamera = (): void => {
        console.log('🛑 Stopping camera...');
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('🛑 Track stopped:', track.kind);
            });
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
        setIsRecording(false);
        console.log('✅ Camera stopped, isCameraActive set to false');
    };

    const startRecording = (onStop: (blob: Blob) => void): void => {
        if (!mediaStreamRef.current) {
            console.warn('Cannot start recording: no media stream');
            return;
        }

        // Если уже записываем, не начинаем новую запись
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.warn('Recording already in progress');
            return;
        }

        // Определяем поддерживаемый MIME type (iOS требует mp4)
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        let mimeType = 'video/webm;codecs=vp8,opus';

        if (isIOS) {
            // iOS поддерживает только mp4
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else if (MediaRecorder.isTypeSupported('video/quicktime')) {
                mimeType = 'video/quicktime';
            }
        }

        const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
            mimeType
        });
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blobType = isIOS ? 'video/mp4' : 'video/webm';
            const blob = new Blob(chunks, { type: blobType });
            setIsRecording(false);

            // Проверяем длительность
            const video = document.createElement('video');
            video.src = URL.createObjectURL(blob);
            video.onloadedmetadata = () => {
                const duration = video.duration;
                if (duration > 20) {
                    alert('Видео должно быть не более 20 секунд');
                    URL.revokeObjectURL(video.src);
                    return;
                }
                URL.revokeObjectURL(video.src);
                onStop(blob);
            };
        };

        mediaRecorder.onerror = (e) => {
            console.error('MediaRecorder error:', e);
            setIsRecording(false);
        };

        try {
            mediaRecorder.start();
            setIsRecording(true);

            // Автоматически останавливаем через 20 секунд
            recordingTimerRef.current = setTimeout(() => {
                stopRecording();
            }, 20000);
        } catch (error) {
            console.error('Failed to start recording:', error);
            setIsRecording(false);
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorderRef.current) {
            // Проверяем состояние записи
            if (mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
        }
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    };

    const cleanup = (): void => {
        stopCamera();
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current);
        }
    };

    return {
        videoRef,
        mediaStreamRef,
        isCameraActive,
        isRecording,
        facingMode,
        startCamera,
        stopCamera,
        switchCamera,
        startRecording,
        stopRecording,
        cleanup,
    };
};

