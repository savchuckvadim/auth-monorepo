'use client';

import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { getPathToPerson } from '@/modules/processes/routing';
import { cn } from '@workspace/ui/lib/utils';
import { getNetworkChatsListPath } from '@/modules/entities/chats/lib/routes/network-chat.routes';

type ChatHeaderLeadingProps = {
    chatName: string;
    otherUserId: string;
    isOnline: boolean;
    isGroup: boolean;
    groupMemberCount: number;
};

export function ChatHeaderLeading({
    chatName,
    otherUserId,
    isOnline,
    isGroup,
    groupMemberCount,
}: ChatHeaderLeadingProps) {
    return (
        <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
            <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
                <Link
                    href={getNetworkChatsListPath()}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                    href={getPathToPerson(otherUserId)}
                    className="min-w-0 flex-1"
                >
                    <h3 className="flex min-w-0 items-center gap-2 font-semibold leading-tight">
                        <span className="truncate">{chatName}</span>
                        <span
                            className="inline-flex shrink-0 items-center gap-1.5"
                            aria-label={isOnline ? 'В сети' : 'Не в сети'}
                        >
                            <span
                                className={cn(
                                    'h-2 w-2 rounded-full',
                                    isOnline
                                        ? 'bg-green-500'
                                        : 'bg-muted-foreground/80',
                                )}
                            />
                            <span
                                className={cn(
                                    'hidden text-xs md:inline',
                                    isOnline ? 'text-green-600' : 'text-muted-foreground',
                                )}
                            >
                                {isOnline ? 'online' : 'offline'}
                            </span>
                        </span>
                    </h3>
                </Link>
            </div>
            {isGroup ? (
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground md:text-sm">
                    <Users className="h-3 w-3 shrink-0 opacity-70" />
                    <span className="tabular-nums">{groupMemberCount}</span>
                    <span className="hidden sm:inline">участников</span>
                </p>
            ) : null}
        </div>
    );
}
