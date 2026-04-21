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
    const isCallHistoryEvent = /звонок|недозвонились|пропущенный/i.test(content);

    return (
        <div
            className={cn(
                'my-2 flex w-full justify-center px-3 text-center',
                className,
            )}
        >
            <p
                className={cn(
                    'max-w-[min(100%,28rem)] text-xs leading-snug text-muted-foreground',
                    isCallHistoryEvent && 'rounded-full bg-muted px-3 py-1',
                )}
            >
                {isCallHistoryEvent ? `Звонок: ${content}` : content}
            </p>
        </div>
    );
}
