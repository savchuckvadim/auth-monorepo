export interface UserWithFollowStatus {
    id: string;
    name: string;
    email: string;
    isFollowing: boolean;
    isFollower: boolean;
    isFriend: boolean;
}

export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    follower?: {
        id: string;
        name: string;
        email: string;
    };
    following?: {
        id: string;
        name: string;
        email: string;
    };
}

