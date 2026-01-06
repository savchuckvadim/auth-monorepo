'use client';
import { useRef, useState } from 'react';

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const startCamera = async (): Promise<void> => {
        try {
            console.log('🎥 Starting camera...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: true
            });
            console.log('✅ Camera stream obtained:', stream);
            mediaStreamRef.current = stream;
            setIsCameraActive(true);
            console.log('✅ isCameraActive set to true');

            // Небольшая задержка для установки srcObject
            await new Promise(resolve => setTimeout(resolve, 100));

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
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

        const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
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
        startCamera,
        stopCamera,
        startRecording,
        stopRecording,
        cleanup,
    };
};

