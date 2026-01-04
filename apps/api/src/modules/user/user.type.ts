import { User } from "generated/prisma";

export type UserWithFollowStatusType = User & {
    isFollowing?: boolean;
    isFollower?: boolean;
    isFriend?: boolean;
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
    avatarUrl?: string;
}
