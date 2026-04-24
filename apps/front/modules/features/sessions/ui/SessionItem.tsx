'use client';

import {
    Clock,
    Laptop,
    LogOut,
    MapPin,
    Monitor,
    Smartphone,
    Sparkles,
} from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import type { SessionDto } from '@workspace/nest-api';
import { AppButton } from '@/modules/shared';

import {
    buildSessionDisplay,
    formatExactDateTime,
    formatRelative,
    isRecentlyCreated,
    type SessionPlatform,
} from '../lib/utils/session-meta.util';

type SessionItemProps = {
    session: SessionDto;
    onRevoke: (sessionId: string) => void;
    isRevoking: boolean;
};

function pickDeviceIcon(platform: SessionPlatform) {
    if (platform === 'ios' || platform === 'android') return Smartphone;
    if (platform === 'desktop') return Monitor;
    return Laptop;
}

export function SessionItem({ session, onRevoke, isRevoking }: SessionItemProps) {
    const display = buildSessionDisplay(session);
    const DeviceIcon = pickDeviceIcon(display.platform);
    const isNew = isRecentlyCreated(session.createdAt);

    return (
        <li
            className={cn(
                'flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between',
                session.isCurrent && 'border-primary/50 ring-1 ring-primary/30',
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <DeviceIcon className="h-5 w-5 text-muted-foreground" aria-hidden />
                </div>

                <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                            {display.deviceLabel} · {display.browserLabel}
                        </p>
                        {session.isCurrent ? (
                            <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                                Текущая сессия
                            </span>
                        ) : null}
                        {isNew && !session.isCurrent ? (
                            <span
                                className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-500"
                                title="Сессия создана меньше 30 минут назад"
                            >
                                <Sparkles className="h-3 w-3" aria-hidden />
                                Только что
                            </span>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            <span title={formatExactDateTime(session.updatedAt)}>
                                Активность: {formatRelative(session.updatedAt)}
                            </span>
                        </span>
                        {display.shortIp ? (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" aria-hidden />
                                <span>{display.shortIp}</span>
                            </span>
                        ) : null}
                    </div>

                    {session.deviceId ? (
                        <p className="truncate text-[11px] text-muted-foreground/70">
                            device-id: {session.deviceId}
                        </p>
                    ) : null}
                </div>
            </div>

            <AppButton
                appSize="sm"
                variant={session.isCurrent ? 'destructive' : 'outline'}
                onClick={() => onRevoke(session.id)}
                isLoading={isRevoking}
                loadingLabel="Выход..."
                leadIcon={<LogOut />}
            >
                {session.isCurrent ? 'Выйти отсюда' : 'Завершить'}
            </AppButton>
        </li>
    );
}
