'use client';

import {
    File as FileIcon,
    Film,
    Image as ImageIcon,
    Loader2,
    X,
    AlertCircle,
    Mic,
    PlayCircle,
} from 'lucide-react';
import type { ComposerAttachmentDraft } from '../lib/context';

interface AttachmentDraftsPreviewProps {
    drafts: ComposerAttachmentDraft[];
    onRemove: (localId: string) => void;
}

/**
 * Горизонтальная лента превью над полем ввода. Для IMAGE/VIDEO показываем
 * thumbnail через `object URL`, для файлов — иконку + имя. Пока идёт upload —
 * спиннер, при ошибке — иконка и красная рамка (повтор делается через
 * удалить→добавить снова; явный retry оставим на iter10).
 */
export function AttachmentDraftsPreview({
    drafts,
    onRemove,
}: AttachmentDraftsPreviewProps) {
    if (drafts.length === 0) return null;
    return (
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {drafts.map((d) => (
                <DraftChip
                    key={d.localId}
                    draft={d}
                    onRemove={() => onRemove(d.localId)}
                />
            ))}
        </div>
    );
}

function DraftChip({
    draft,
    onRemove,
}: {
    draft: ComposerAttachmentDraft;
    onRemove: () => void;
}) {
    const isImage = draft.kind === 'IMAGE' && draft.previewUrl;
    const isVideo = draft.kind === 'VIDEO' && draft.previewUrl;
    const isVoice = draft.kind === 'VOICE' || draft.kind === 'AUDIO';
    const isCircle = draft.kind === 'CIRCLE';
    const errored = Boolean(draft.error);

    return (
        <div
            className={
                'relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted' +
                (errored ? ' border-destructive' : ' border-border')
            }
            title={draft.file.name}
        >
            {isImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={draft.previewUrl}
                    alt={draft.file.name}
                    className="h-full w-full object-cover"
                />
            ) : isVideo ? (
                <video
                    src={draft.previewUrl}
                    className="h-full w-full object-cover"
                    muted
                />
            ) : isCircle ? (
                <div className="relative flex h-full w-full items-center justify-center bg-black">
                    {draft.previewUrl ? (
                        <video
                            src={draft.previewUrl}
                            className="h-full w-full object-cover"
                            muted
                        />
                    ) : null}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                        <PlayCircle className="h-6 w-6 text-white/90" />
                    </div>
                    <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                        circle
                    </div>
                </div>
            ) : isVoice ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Mic className="h-4 w-4" />
                    </div>
                    <div className="flex h-3 items-end gap-[1px]">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                className="w-[2px] rounded bg-primary/70"
                                style={{
                                    height: `${6 + ((i * 7) % 8)}px`,
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-[9px] leading-none text-muted-foreground">
                        voice
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-1 px-1 text-center">
                    {draft.kind === 'VIDEO' ? (
                        <Film className="h-6 w-6 text-muted-foreground" />
                    ) : draft.kind === 'IMAGE' ? (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    ) : (
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                    <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground [overflow-wrap:anywhere]">
                        {draft.file.name}
                    </p>
                </div>
            )}

            {draft.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
            ) : null}
            {errored && !draft.uploading ? (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-destructive/40"
                    title={draft.error}
                >
                    <AlertCircle className="h-5 w-5 text-destructive-foreground" />
                </div>
            ) : null}

            <button
                type="button"
                onClick={onRemove}
                className="absolute right-0 top-0 rounded-bl-md bg-black/60 p-0.5 text-white hover:bg-black/80"
                aria-label="Удалить вложение"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
