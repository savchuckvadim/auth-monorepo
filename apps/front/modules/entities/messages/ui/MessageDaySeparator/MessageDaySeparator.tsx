'use client';

import {
    formatChatDayRelativeLine,
    formatChatDaySeparatorLabel,
} from '../../lib/utils/message-day-label.util';

type MessageDaySeparatorProps = {
    date: string | Date;
};

export function MessageDaySeparator({ date }: MessageDaySeparatorProps) {
    const main = formatChatDaySeparatorLabel(date);
    const relative = formatChatDayRelativeLine(date);

    return (
        <div
            className="my-3 flex w-full flex-col items-center gap-0.5 px-2"
            role="separator"
            aria-label={main}
        >
            <span className="rounded-full bg-muted/80 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                {main}
            </span>
            {relative ? (
                <span className="text-[10px] text-muted-foreground/70">
                    {relative}
                </span>
            ) : null}
        </div>
    );
}
