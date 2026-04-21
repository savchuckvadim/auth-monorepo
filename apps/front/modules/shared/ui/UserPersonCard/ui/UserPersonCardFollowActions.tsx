'use client';

import { AppButton } from '../../AppButton';

export type UserPersonCardFollowActionsProps = {
    following: boolean;
    onFollow: () => void;
    onUnfollow: () => void;
    isFollowLoading?: boolean;
    isUnfollowLoading?: boolean;
};

export function UserPersonCardFollowActions({
    following,
    onFollow,
    onUnfollow,
    isFollowLoading = false,
    isUnfollowLoading = false,
}: UserPersonCardFollowActionsProps) {
    return (
        <div className="mt-auto flex w-full flex-col">
            {following ? (
                <AppButton
                    type="button"
                    variant="secondary"
                    appSize="userCard"
                    className="font-medium text-muted-foreground rounded-md"
                    isLoading={isUnfollowLoading}
                    loadingLabel="…"
                    onClick={onUnfollow}
                >
                    Unfollow
                </AppButton>
            ) : (
                <AppButton
                    type="button"
                    variant="default"
                    appSize="userCard"
                    className="font-semibold rounded-md"
                    isLoading={isFollowLoading}
                    loadingLabel="…"
                    onClick={onFollow}
                >
                    Follow
                </AppButton>
            )}
        </div>
    );
}
