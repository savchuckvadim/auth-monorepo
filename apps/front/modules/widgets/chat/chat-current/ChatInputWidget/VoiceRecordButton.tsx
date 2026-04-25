'use client';

import { useRef, useState } from 'react';
import { Mic, StopCircle, Trash2 } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import {
    useUploadMessageAttachment,
    useVoiceRecorder,
    MessageAttachmentKind,
} from '@/modules/entities/messages';
import type { ComposerAttachmentDraft } from '../lib/context';

interface VoiceRecordButtonProps {
    onUploaded: (draft: ComposerAttachmentDraft) => void;
    onError: (message: string) => void;
    onDraftUpdate: (
        localId: string,
        patch: Partial<ComposerAttachmentDraft>,
    ) => void;
    disabled?: boolean;
}

function formatTimer(ms: number): string {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Hold-to-record: press → запись, release → отправить. Во время записи
 * показываем бегущий таймер прямо на кнопке. На pointerleave не отменяем
 * (нужен swipe-to-cancel UX, но он выходит за рамки iter8 — оставили
 * отдельную кнопку «корзина» в оверлее для отмены).
 */
export function VoiceRecordButton({
    onUploaded,
    onError,
    onDraftUpdate,
    disabled,
}: VoiceRecordButtonProps) {
    const {
        isRecording,
        isSupported,
        elapsedMs,
        start,
        stop,
        maxDurationMs,
    } = useVoiceRecorder();
    const uploadMutation = useUploadMessageAttachment();
    const activeDraftIdRef = useRef<string | null>(null);
    const [canceling, setCanceling] = useState(false);

    if (!isSupported) {
        return null;
    }

    const handleStart = async () => {
        if (disabled || isRecording) return;
        setCanceling(false);
        await start();
    };

    const handleStop = async (commit: boolean) => {
        const result = await stop(commit);
        if (!result) return;
        // Анти-слип: совсем короткие (<300ms) трактуем как случайный клик.
        if (result.durationMs < 300) {
            onError('Слишком короткая запись');
            return;
        }
        const localId = `voice-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;
        activeDraftIdRef.current = localId;
        const file = new File(
            [result.blob],
            `voice-${Date.now()}.${result.extension}`,
            { type: result.mimeType },
        );
        onUploaded({
            localId,
            kind: 'VOICE',
            file,
            uploading: true,
        });
        uploadMutation
            .mutateAsync({
                file,
                kind: MessageAttachmentKind.VOICE,
                durationMs: result.durationMs,
                waveform: result.waveform,
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
    };

    const handleCancel = async () => {
        setCanceling(true);
        await stop(false);
    };

    const progressPct =
        maxDurationMs > 0
            ? Math.min(100, (elapsedMs / maxDurationMs) * 100)
            : 0;

    return (
        <div className="relative">
            {isRecording ? (
                <div className="flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5">
                    <span
                        className="inline-block h-2 w-2 animate-pulse rounded-full bg-destructive"
                        aria-hidden
                    />
                    <span className="text-xs font-mono text-destructive">
                        {formatTimer(elapsedMs)}
                    </span>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                        aria-label="Отменить запись"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStop(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
                        aria-label="Остановить и отправить"
                    >
                        <StopCircle className="h-4 w-4" />
                    </button>
                    <div
                        className="pointer-events-none absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-destructive/30"
                        aria-hidden
                    >
                        <div
                            className="h-full rounded-full bg-destructive"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={disabled || canceling}
                    onClick={handleStart}
                    className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition',
                        'text-muted-foreground hover:bg-muted hover:text-foreground',
                        (disabled || canceling) && 'opacity-50',
                    )}
                    aria-label="Записать голосовое"
                >
                    <Mic className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
