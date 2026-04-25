'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { MessageAttachment } from '../../lib/types/messages.types';

interface VoiceMessagePlayerProps {
    attachment: MessageAttachment;
    tone: 'own' | 'incoming';
}

function formatDuration(ms: number): string {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Получаем peak-массив из metadata.waveform (если бэк его положил). */
function getWaveform(attachment: MessageAttachment): number[] {
    const meta = attachment.metadata;
    if (!meta || typeof meta !== 'object') return [];
    const wf = (meta as { waveform?: unknown }).waveform;
    if (!Array.isArray(wf)) return [];
    return wf
        .map((v) => (typeof v === 'number' ? v : Number(v)))
        .filter((v) => Number.isFinite(v))
        .map((v) => Math.max(0, Math.min(1, v)));
}

const BAR_COUNT = 32;

function reducePeaks(peaks: number[], targetBars: number): number[] {
    if (peaks.length === 0) return new Array(targetBars).fill(0);
    if (peaks.length <= targetBars) {
        // растянуть: повторить значения
        const result: number[] = [];
        const ratio = peaks.length / targetBars;
        for (let i = 0; i < targetBars; i++) {
            const idx = Math.floor(i * ratio);
            result.push(peaks[idx] ?? 0);
        }
        return result;
    }
    const chunkSize = Math.ceil(peaks.length / targetBars);
    const result: number[] = [];
    for (let i = 0; i < targetBars; i++) {
        let max = 0;
        const start = i * chunkSize;
        for (let j = 0; j < chunkSize; j++) {
            const v = peaks[start + j];
            if (v && v > max) max = v;
        }
        result.push(max);
    }
    return result;
}

/**
 * Минималистичный голосовой плеер: кнопка play/pause, 32-баровая waveform
 * (рисуем div’ами, без canvas — меньше кода, ок для 32 полосок), таймер
 * `текущее / общее`.
 */
export function VoiceMessagePlayer({
    attachment,
    tone,
}: VoiceMessagePlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMs, setCurrentMs] = useState(0);

    const durationMs = attachment.durationMs ?? 0;
    const peaks = useMemo(
        () => reducePeaks(getWaveform(attachment), BAR_COUNT),
        [attachment],
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTime = () => setCurrentMs(audio.currentTime * 1000);
        const onEnd = () => {
            setIsPlaying(false);
            setCurrentMs(0);
        };
        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('ended', onEnd);
        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('ended', onEnd);
        };
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            void audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    if (!attachment.url) return null;

    const progress =
        durationMs > 0 ? Math.min(1, currentMs / durationMs) : 0;

    return (
        <div
            className={cn(
                'flex min-w-[200px] max-w-[320px] items-center gap-3 rounded-md px-3 py-2',
                tone === 'own'
                    ? 'bg-primary-foreground/10'
                    : 'bg-background/60',
            )}
        >
            <button
                type="button"
                onClick={toggle}
                className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition',
                    tone === 'own'
                        ? 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'
                        : 'bg-primary text-primary-foreground hover:opacity-90',
                )}
                aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
                {isPlaying ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4 translate-x-[1px]" />
                )}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex h-6 items-center gap-[2px]">
                    {peaks.map((p, i) => {
                        const active = i / peaks.length <= progress;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    'w-[3px] rounded-sm transition-[background]',
                                    tone === 'own'
                                        ? active
                                            ? 'bg-primary-foreground'
                                            : 'bg-primary-foreground/40'
                                        : active
                                          ? 'bg-primary'
                                          : 'bg-muted-foreground/40',
                                )}
                                style={{
                                    height: `${Math.max(10, Math.round(p * 100))}%`,
                                }}
                            />
                        );
                    })}
                </div>
                <p
                    className={cn(
                        'text-[11px]',
                        tone === 'own'
                            ? 'opacity-80'
                            : 'text-muted-foreground',
                    )}
                >
                    {formatDuration(currentMs)} /{' '}
                    {formatDuration(durationMs)}
                </p>
            </div>
            <audio ref={audioRef} src={attachment.url} preload="metadata" />
        </div>
    );
}
