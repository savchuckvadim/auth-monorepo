'use client';

import { Hourglass, Lock, MessageSquare, Timer } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

type ChatHeaderPrivateRibbonProps = {
    isSignal: boolean;
    hasScheduledChatDeletion: boolean;
    hasDisappearingMessages: boolean;
    disappearingSec: number;
};

export function ChatHeaderPrivateRibbon({
    isSignal,
    hasScheduledChatDeletion,
    hasDisappearingMessages,
    disappearingSec,
}: ChatHeaderPrivateRibbonProps) {
    const disappearingMinutes = Math.max(1, Math.round(disappearingSec / 60));

    return (
        <div className="flex flex-wrap items-center gap-1.5 text-xs md:gap-2">
            <span
                className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 md:px-2',
                    isSignal
                        ? 'border-amber-500/60 text-amber-700 dark:text-amber-400'
                        : 'border-border text-muted-foreground',
                )}
                title={
                    isSignal
                        ? 'Защищённый чат (E2EE)'
                        : 'Обычный чат'
                }
            >
                {isSignal ? (
                    <>
                        <Lock className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="hidden md:inline">Защищённый</span>
                    </>
                ) : (
                    <>
                        <MessageSquare className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="hidden md:inline">Обычный</span>
                    </>
                )}
            </span>
            {isSignal && (hasScheduledChatDeletion || hasDisappearingMessages) ? (
                <span className="inline-flex flex-wrap items-center gap-1 md:gap-1.5">
                    {hasScheduledChatDeletion ? (
                        <span
                            className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-1 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200 md:px-1.5"
                            title="Запланировано удаление чата"
                        >
                            <Timer className="h-3 w-3 shrink-0" />
                            <span className="hidden sm:inline">чат</span>
                        </span>
                    ) : null}
                    {hasDisappearingMessages ? (
                        <span
                            className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-1 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200 md:px-1.5"
                            title="Исчезающие сообщения"
                        >
                            <Hourglass className="h-3 w-3 shrink-0" />
                            <span className="tabular-nums">{disappearingMinutes}</span>
                            <span className="hidden sm:inline">мин</span>
                        </span>
                    ) : null}
                </span>
            ) : null}
        </div>
    );
}
