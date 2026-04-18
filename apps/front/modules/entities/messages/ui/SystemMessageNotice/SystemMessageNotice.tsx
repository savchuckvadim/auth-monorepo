'use client';

import { cn } from '@workspace/ui/lib/utils';

interface SystemMessageNoticeProps {
    content: string;
    className?: string;
}

/** Системное сообщение: только текст по центру, без «карточки» и времени. */
export function SystemMessageNotice({
    content,
    className,
}: SystemMessageNoticeProps) {
    return (
        <div
            className={cn(
                'my-2 flex w-full justify-center px-3 text-center',
                className,
            )}
        >
            <p className="max-w-[min(100%,28rem)] text-xs leading-snug text-muted-foreground">
                {content}
            </p>
        </div>
    );
}
