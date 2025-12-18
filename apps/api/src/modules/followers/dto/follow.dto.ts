import { User } from 'generated/prisma';

export class FollowDto {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
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

    constructor(follow: any) {
        this.id = follow.id;
        this.followerId = follow.followerId;
        this.followingId = follow.followingId;
        this.createdAt = follow.createdAt;
        this.follower = follow.follower;
        this.following = follow.following;
    }
}

type UserBasic = {
    id: string;
    name: string;
    email: string;
};

export class UserWithFollowStatusDto {
    id: string;
    name: string;
    email: string;
    isFollowing: boolean;
    isFollower: boolean;
    isFriend: boolean; // взаимная подписка

    constructor(user: UserBasic & { isFollowing?: boolean; isFollower?: boolean }) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.isFollowing = user.isFollowing || false;
        this.isFollower = user.isFollower || false;
        this.isFriend = (user.isFollowing && user.isFollower) || false;
    }
}

