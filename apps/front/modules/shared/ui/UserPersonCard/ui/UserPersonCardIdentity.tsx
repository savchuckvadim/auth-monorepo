'use client';

import { Avatar } from '@/modules/shared/ui/Avatar';
import { TruncatedNameWithTooltip } from './TruncatedNameWithTooltip';

export type UserPersonCardIdentityProps = {
    name: string;
    profileHref?: string;
    isOnline?: boolean;
};

export function UserPersonCardIdentity({
    name,
    profileHref,
    isOnline,
}: UserPersonCardIdentityProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-1.5">
            <Avatar
                name={name}
                size="userCard"
                isOnline={isOnline}
                className="shrink-0"
            />
            <div className="w-full min-w-0 max-w-full px-1">
                <TruncatedNameWithTooltip name={name} href={profileHref} />
            </div>
        </div>
    );
}
