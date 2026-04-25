import { Pencil, Reply, X } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

type ChatComposerNoticeBarProps = {
    tone: 'reply' | 'edit';
    title: string;
    text: string;
    onClear: () => void;
};

export function ChatComposerNoticeBar({
    tone,
    title,
    text,
    onClear,
}: ChatComposerNoticeBarProps) {
    const isEdit = tone === 'edit';
    const Icon = isEdit ? Pencil : Reply;

    return (
        <div
            className={cn(
                'mb-2 flex items-start gap-2 rounded-md border-l-2 px-3 py-2',
                isEdit
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-primary bg-muted/60',
            )}
        >
            <Icon
                className={cn(
                    'mt-0.5 h-3.5 w-3.5 shrink-0',
                    isEdit
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-primary',
                )}
            />
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        'truncate text-xs font-medium',
                        isEdit
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-primary',
                    )}
                >
                    {title}
                </p>
                <p className="line-clamp-1 break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {text}
                </p>
            </div>
            <button
                type="button"
                aria-label={isEdit ? 'Отменить редактирование' : 'Отменить ответ'}
                onClick={onClear}
                className="ml-auto rounded p-1 text-muted-foreground transition hover:bg-background hover:text-foreground"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
