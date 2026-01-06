import { Profile, User } from "generated/prisma";

export type UserWithFollowStatusType = User & {
    isFollowing?: boolean;
    isFollower?: boolean;
    isFriend?: boolean;
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
    avatarUrl?: string;
}


export type UserWithProfileType = User & {
    profile?: Profile | null;
}
