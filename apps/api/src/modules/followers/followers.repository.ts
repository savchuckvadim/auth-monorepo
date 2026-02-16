import { Follow, User } from 'generated/prisma';

type UserBasic = {
    id: string;
    name: string;
    email: string;
};

export abstract class FollowersRepository {
    abstract follow(followerId: string, followingId: string): Promise<Follow & { following?: UserBasic }>;
    abstract unfollow(followerId: string, followingId: string): Promise<void>;
    abstract getFollowers(userId: string): Promise<(Follow & { follower?: UserBasic })[]>;
    abstract getFollowing(userId: string): Promise<(Follow & { following?: UserBasic })[]>;
    abstract getFriends(userId: string): Promise<UserBasic[]>;
    abstract isFollowing(followerId: string, followingId: string): Promise<boolean>;
    abstract getAllUsers(currentUserId: string): Promise<UserBasic[]>;
    abstract getUsersWithFollowStatus(currentUserId: string, userIds: string[]): Promise<(UserBasic & { isFollowing?: boolean; isFollower?: boolean })[]>;
    abstract getUserBasic(userId: string): Promise<UserBasic | null>;
}

