'use client';

import { File as FileIcon, Download } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { MessageAttachment } from '../../lib/types/messages.types';

interface FileMessageAttachmentProps {
    attachment: MessageAttachment;
    tone: 'own' | 'incoming';
}

function formatSize(bytes?: number | null): string {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
}

/**
 * Кликабельный «чип» с иконкой файла и скачиванием. `download` — чтобы
 * браузер не открывал pdf/картинку в новой вкладке.
 */
export function FileMessageAttachment({
    attachment,
    tone,
}: FileMessageAttachmentProps) {
    if (!attachment.url) return null;
    const sizeLabel = formatSize(attachment.size);
    return (
        <a
            href={attachment.url}
            download={attachment.name ?? true}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'flex max-w-[320px] items-center gap-3 rounded-md border px-3 py-2 text-sm transition',
                tone === 'own'
                    ? 'border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15'
                    : 'border-border bg-background/60 text-foreground hover:bg-background',
            )}
        >
            <FileIcon className="h-5 w-5 shrink-0 opacity-80" />
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                    {attachment.name ?? 'Файл'}
                </p>
                {sizeLabel ? (
                    <p
                        className={cn(
                            'truncate text-[11px]',
                            tone === 'own'
                                ? 'opacity-70'
                                : 'text-muted-foreground',
                        )}
                    >
                        {sizeLabel}
                    </p>
                ) : null}
            </div>
            <Download className="h-4 w-4 shrink-0 opacity-70" />
        </a>
    );
}
