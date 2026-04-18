import type { UserWithFollowStatusDto } from '@workspace/nest-api';
import { UserPersonCard } from '@/modules/shared';
import { useFollow, useUnfollow } from '../../followers';
import { usePresence } from '@/modules/entities';

export const UserCard = ({ user }: { user: UserWithFollowStatusDto }) => {
    const { mutate: follow, isPending: isFollowLoading } = useFollow();
    const { mutate: unfollow, isPending: isUnfollowLoading } = useUnfollow();
    const { getIsUserOnline } = usePresence();

    return (
        <UserPersonCard
            user={user}
            profileHref={`/network/people/${user.id}`}
            isOnline={getIsUserOnline(user.id)}
            onFollow={() => follow(user.id)}
            onUnfollow={() => unfollow(user.id)}
            isFollowLoading={isFollowLoading}
            isUnfollowLoading={isUnfollowLoading}
        />
    );
};
