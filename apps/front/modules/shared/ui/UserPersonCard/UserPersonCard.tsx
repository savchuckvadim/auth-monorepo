'use client';

import { AppSurfaceCard } from '@/modules/shared/ui/AppSurfaceCard';
import { cn } from '@workspace/ui/lib/utils';
import type { UserWithFollowStatusDto } from '@workspace/nest-api';
import { UserPersonCardFollowActions } from './ui/UserPersonCardFollowActions';
import { UserPersonCardIdentity } from './ui/UserPersonCardIdentity';

export type UserPersonCardProps = {
    user: UserWithFollowStatusDto;
    onFollow: () => void;
    onUnfollow: () => void;
    isFollowLoading?: boolean;
    isUnfollowLoading?: boolean;
    /** Ссылка с имени на профиль */
    profileHref?: string;
    /** Присутствие (если не передать — индикатор не показываем) */
    isOnline?: boolean;
    className?: string;
};

/**
 * Карточка пользователя: крупный аватар по центру, имя под ним, Follow/Unfollow.
 */
export function UserPersonCard({
    user,
    onFollow,
    onUnfollow,
    isFollowLoading = false,
    isUnfollowLoading = false,
    profileHref,
    isOnline,
    className,
}: UserPersonCardProps) {
    return (
        <AppSurfaceCard
            variant="default"
            className={cn(
                'flex w-full flex-col rounded-none md:rounded-xl',
                'md:h-62 md:min-w-0 md:max-w-72 md:justify-self-center',
                'p-5',
                className,
            )}
        >
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
                <UserPersonCardIdentity
                    name={user.name}
                    profileHref={profileHref}
                    isOnline={isOnline}
                />

                <UserPersonCardFollowActions
                    following={user.isFollowing}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                    isFollowLoading={isFollowLoading}
                    isUnfollowLoading={isUnfollowLoading}
                />
            </div>
        </AppSurfaceCard>
    );
}
