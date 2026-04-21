export function clampHoursMinutes(hours: number, minutes: number): { h: number; m: number } {
    return {
        h: Math.max(0, Math.min(168, hours)),
        m: Math.max(0, Math.min(59, minutes)),
    };
}

export function durationToMs(h: number, m: number): number {
    return h * 3600_000 + m * 60_000;
}

export function durationToSeconds(h: number, m: number): number {
    return h * 3600 + m * 60;
}

export function canApplyChatDeletionMs(ms: number): boolean {
    return ms >= 60_000;
}

export function canApplyDisappearingSeconds(totalSec: number): boolean {
    return totalSec >= 30;
}
