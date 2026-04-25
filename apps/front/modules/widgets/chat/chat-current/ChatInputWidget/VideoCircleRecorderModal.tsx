'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Circle, StopCircle, X } from 'lucide-react';
import { useCamera } from '@/modules/features/post/CreatePost/lib/useCamera';
import {
    MessageAttachmentKind,
    useUploadMessageAttachment,
} from '@/modules/entities/messages';
import type { ComposerAttachmentDraft } from '../lib/context';

interface VideoCircleRecorderModalProps {
    open: boolean;
    onClose: () => void;
    onUploaded: (draft: ComposerAttachmentDraft) => void;
    onDraftUpdate: (
        localId: string,
        patch: Partial<ComposerAttachmentDraft>,
    ) => void;
}

const MAX_DURATION_MS = 60 * 1000;

function formatTimer(ms: number): string {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Полноэкранный оверлей для записи «кружочка». Переиспользуем общий
 * `useCamera`, а круглую форму даёт CSS `clip-path: circle(50%)`.
 * На iOS useCamera уже переключает MIME в mp4 — здесь это работает бесплатно.
 */
export function VideoCircleRecorderModal({
    open,
    onClose,
    onUploaded,
    onDraftUpdate,
}: VideoCircleRecorderModalProps) {
    const {
        videoRef,
        isCameraActive,
        isRecording,
        startCamera,
        stopCamera,
        startRecording,
        stopRecording,
    } = useCamera();
    const uploadMutation = useUploadMessageAttachment();
    const [elapsedMs, setElapsedMs] = useState(0);
    const tickRef = useRef<number | null>(null);
    const autoStopRef = useRef<number | null>(null);
    const startedAtRef = useRef<number>(0);

    useEffect(() => {
        if (!open) return;
        void startCamera('user');
        return () => {
            stopCamera();
            if (tickRef.current) window.clearInterval(tickRef.current);
            if (autoStopRef.current) window.clearTimeout(autoStopRef.current);
            tickRef.current = null;
            autoStopRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleStart = () => {
        if (!isCameraActive || isRecording) return;
        startedAtRef.current = Date.now();
        setElapsedMs(0);
        tickRef.current = window.setInterval(() => {
            setElapsedMs(Date.now() - startedAtRef.current);
        }, 100);
        autoStopRef.current = window.setTimeout(() => {
            stopRecording();
        }, MAX_DURATION_MS);

        startRecording((blob) => {
            if (tickRef.current) window.clearInterval(tickRef.current);
            if (autoStopRef.current) window.clearTimeout(autoStopRef.current);
            tickRef.current = null;
            autoStopRef.current = null;
            const durationMs = Date.now() - startedAtRef.current;
            const mime = blob.type || 'video/webm';
            const ext = mime.includes('mp4') ? 'mp4' : 'webm';
            const file = new File(
                [blob],
                `circle-${Date.now()}.${ext}`,
                { type: mime },
            );
            const localId = `circle-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`;
            onUploaded({
                localId,
                kind: 'CIRCLE',
                file,
                previewUrl: URL.createObjectURL(file),
                uploading: true,
            });
            uploadMutation
                .mutateAsync({
                    file,
                    kind: MessageAttachmentKind.CIRCLE,
                    durationMs,
                })
                .then((attachment) => {
                    onDraftUpdate(localId, {
                        uploading: false,
                        uploadedId: attachment.id,
                    });
                })
                .catch((error: unknown) => {
                    onDraftUpdate(localId, {
                        uploading: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Ошибка загрузки',
                    });
                });
            onClose();
        });
    };

    const handleStop = () => {
        if (!isRecording) return;
        stopRecording();
    };

    if (!open || typeof document === 'undefined') return null;

    const progressPct = Math.min(100, (elapsedMs / MAX_DURATION_MS) * 100);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90">
            <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                aria-label="Закрыть"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center gap-6">
                <div
                    className="relative h-[70vmin] w-[70vmin] overflow-hidden rounded-full bg-black"
                    style={{ clipPath: 'circle(50% at 50% 50%)' }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                    />
                    {isRecording ? (
                        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-mono text-white">
                            {formatTimer(elapsedMs)}
                        </div>
                    ) : null}
                </div>

                {isRecording ? (
                    <div className="w-[70vmin] max-w-[480px]">
                        <div className="h-1 rounded-full bg-white/20">
                            <div
                                className="h-1 rounded-full bg-destructive transition-[width]"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                ) : null}

                <div className="flex items-center gap-6">
                    {!isRecording ? (
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!isCameraActive}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
                            aria-label="Начать запись"
                        >
                            <Circle className="h-8 w-8 fill-current" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleStop}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-destructive shadow-lg transition hover:scale-105"
                            aria-label="Остановить запись"
                        >
                            <StopCircle className="h-10 w-10" />
                        </button>
                    )}
                </div>
                <p className="text-sm text-white/80">
                    До 60 секунд · круглое видео
                </p>
            </div>
        </div>,
        document.body,
    );
}
