'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceRecorderResult {
    blob: Blob;
    durationMs: number;
    waveform: number[];
    mimeType: string;
    extension: string;
}

export interface VoiceRecorderState {
    isRecording: boolean;
    isSupported: boolean;
    elapsedMs: number;
    error: string | null;
}

const MAX_DURATION_MS = 60 * 1000;
/** ~40 пиков на 1 секунду, капаем позже под кол-во сэмплов в UI. */
const WAVEFORM_TICK_MS = 50;

/** Выбирает первый поддерживаемый контейнер/codec — Safari умеет только mp4. */
function pickMimeType(): { mimeType: string; extension: string } {
    if (typeof MediaRecorder === 'undefined') {
        return { mimeType: '', extension: 'webm' };
    }
    const candidates: Array<[string, string]> = [
        ['audio/webm;codecs=opus', 'webm'],
        ['audio/ogg;codecs=opus', 'ogg'],
        ['audio/webm', 'webm'],
        ['audio/mp4', 'mp4'],
    ];
    for (const [type, ext] of candidates) {
        if (MediaRecorder.isTypeSupported(type)) {
            return { mimeType: type, extension: ext };
        }
    }
    return { mimeType: '', extension: 'webm' };
}

/**
 * MediaRecorder-обёртка для голосовых. Снимает амплитуды через AnalyserNode
 * для дешёвой waveform (RMS на окно) без сторонних либ. Автостоп на
 * 60 секундах, все ресурсы чистятся в cleanup’е.
 */
export function useVoiceRecorder() {
    const [state, setState] = useState<VoiceRecorderState>({
        isRecording: false,
        isSupported: false,
        elapsedMs: 0,
        error: null,
    });

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const waveformRef = useRef<number[]>([]);
    const startedAtRef = useRef<number>(0);
    const waveIntervalRef = useRef<number | null>(null);
    const elapsedIntervalRef = useRef<number | null>(null);
    const autoStopTimeoutRef = useRef<number | null>(null);
    const resolveRef = useRef<((r: VoiceRecorderResult | null) => void) | null>(
        null,
    );
    const mimeRef = useRef<{ mimeType: string; extension: string }>({
        mimeType: '',
        extension: 'webm',
    });

    useEffect(() => {
        const supported =
            typeof window !== 'undefined' &&
            typeof navigator !== 'undefined' &&
            Boolean(navigator.mediaDevices?.getUserMedia) &&
            typeof MediaRecorder !== 'undefined';
        setState((s) => ({ ...s, isSupported: supported }));
    }, []);

    const cleanup = useCallback(() => {
        if (waveIntervalRef.current !== null) {
            window.clearInterval(waveIntervalRef.current);
            waveIntervalRef.current = null;
        }
        if (elapsedIntervalRef.current !== null) {
            window.clearInterval(elapsedIntervalRef.current);
            elapsedIntervalRef.current = null;
        }
        if (autoStopTimeoutRef.current !== null) {
            window.clearTimeout(autoStopTimeoutRef.current);
            autoStopTimeoutRef.current = null;
        }
        recorderRef.current = null;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {
                /* ignore */
            });
            audioContextRef.current = null;
        }
        analyserRef.current = null;
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const start = useCallback(async () => {
        if (state.isRecording) return;
        setState((s) => ({ ...s, error: null }));
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            streamRef.current = stream;

            const picked = pickMimeType();
            mimeRef.current = picked;
            const recorder = new MediaRecorder(
                stream,
                picked.mimeType ? { mimeType: picked.mimeType } : undefined,
            );
            recorderRef.current = recorder;
            chunksRef.current = [];
            waveformRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            // Analyser — для waveform.
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext?: typeof AudioContext })
                    .webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                audioContextRef.current = ctx;
                const source = ctx.createMediaStreamSource(stream);
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 512;
                source.connect(analyser);
                analyserRef.current = analyser;

                const buffer = new Uint8Array(analyser.fftSize);
                waveIntervalRef.current = window.setInterval(() => {
                    const a = analyserRef.current;
                    if (!a) return;
                    a.getByteTimeDomainData(buffer);
                    // RMS по окну → [0..1]. Нормируем к 0..1.
                    let sum = 0;
                    for (const sample of buffer) {
                        const v = (sample - 128) / 128;
                        sum += v * v;
                    }
                    const rms = Math.sqrt(sum / buffer.length);
                    waveformRef.current.push(Math.min(1, rms));
                }, WAVEFORM_TICK_MS);
            }

            startedAtRef.current = Date.now();
            elapsedIntervalRef.current = window.setInterval(() => {
                setState((s) => ({
                    ...s,
                    elapsedMs: Date.now() - startedAtRef.current,
                }));
            }, 100);

            autoStopTimeoutRef.current = window.setTimeout(() => {
                // stop() подбирается наружу через Promise в stop()
                stop(true).catch(() => {
                    /* ignore */
                });
            }, MAX_DURATION_MS);

            recorder.start();
            setState((s) => ({
                ...s,
                isRecording: true,
                elapsedMs: 0,
            }));
        } catch (error) {
            cleanup();
            setState((s) => ({
                ...s,
                isRecording: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось получить доступ к микрофону',
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isRecording, cleanup]);

    const stop = useCallback(
        (commit: boolean): Promise<VoiceRecorderResult | null> => {
            return new Promise((resolve) => {
                const rec = recorderRef.current;
                if (!rec || !state.isRecording) {
                    resolve(null);
                    return;
                }

                resolveRef.current = resolve;
                const picked = mimeRef.current;
                rec.onstop = () => {
                    const durationMs =
                        Date.now() - startedAtRef.current;
                    const waveform = waveformRef.current.slice();
                    if (commit && chunksRef.current.length > 0) {
                        const blob = new Blob(chunksRef.current, {
                            type: picked.mimeType || 'audio/webm',
                        });
                        resolveRef.current?.({
                            blob,
                            durationMs,
                            waveform,
                            mimeType: picked.mimeType || 'audio/webm',
                            extension: picked.extension,
                        });
                    } else {
                        resolveRef.current?.(null);
                    }
                    resolveRef.current = null;
                    cleanup();
                    setState((s) => ({
                        ...s,
                        isRecording: false,
                        elapsedMs: 0,
                    }));
                };
                try {
                    rec.stop();
                } catch {
                    resolveRef.current?.(null);
                    resolveRef.current = null;
                    cleanup();
                    setState((s) => ({
                        ...s,
                        isRecording: false,
                        elapsedMs: 0,
                    }));
                }
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.isRecording, cleanup],
    );

    return {
        ...state,
        maxDurationMs: MAX_DURATION_MS,
        start,
        stop,
    };
}
