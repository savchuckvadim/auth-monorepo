'use client';

import { cn } from '@workspace/ui/lib/utils';

interface SystemMessageNoticeProps {
    content: string;
    createdAt: Date | string;
    className?: string;
}

/** Centered non-bubble row for `MessageType.SYSTEM` (chat policies, service text). */
export function SystemMessageNotice({
    content,
    createdAt,
    className,
}: SystemMessageNoticeProps) {
    const time =
        typeof createdAt === 'string'
            ? new Date(createdAt)
            : createdAt;

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-1 my-3 px-4 text-center',
                className,
            )}
        >
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                {content}
            </p>
            <p className="text-[10px] text-muted-foreground/80">
                {time.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    );
}
