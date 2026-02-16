import { Injectable, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { FollowersRepository } from './followers.repository';
import { FollowDto, UserWithFollowStatusDto } from './dto/follow.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class FollowersService {
    constructor(
        private readonly repository: FollowersRepository,
        @Inject(forwardRef(() => NotificationsGateway))
        private readonly notificationsGateway: NotificationsGateway,
    ) { }

    async follow(currentUserId: string, followingId: string): Promise<FollowDto> {
        const follow = await this.repository.follow(currentUserId, followingId);

        // Отправляем уведомление о новом подписчике
        const follower = await this.repository.getUserBasic(currentUserId);
        if (follower) {
            this.notificationsGateway.notifyNewFollower(followingId, follower);
        }

        return new FollowDto(follow);
    }

    async unfollow(currentUserId: string, followingId: string): Promise<void> {
        await this.repository.unfollow(currentUserId, followingId);
    }

    async getFollowers(userId: string, currentUserId?: string): Promise<FollowDto[]> {
        const followers = await this.repository.getFollowers(userId);
        return followers.map(f => new FollowDto(f));
    }

    async getFollowing(userId: string, currentUserId?: string): Promise<FollowDto[]> {
        const following = await this.repository.getFollowing(userId);
        return following.map(f => new FollowDto(f));
    }

    async getFriends(userId: string): Promise<UserWithFollowStatusDto[]> {
        const friends = await this.repository.getFriends(userId);
        return friends.map(user => new UserWithFollowStatusDto({ ...user, isFollowing: true, isFollower: true }));
    }

    async getAllUsers(currentUserId: string): Promise<UserWithFollowStatusDto[]> {
        const users = await this.repository.getAllUsers(currentUserId);
        const userIds = users.map(u => u.id);
        const usersWithStatus = await this.repository.getUsersWithFollowStatus(currentUserId, userIds);
        return usersWithStatus.map(user => new UserWithFollowStatusDto(user));
    }

    async getUserById(userId: string, currentUserId: string): Promise<UserWithFollowStatusDto> {
        const usersWithStatus = await this.repository.getUsersWithFollowStatus(currentUserId, [userId]);
        if (usersWithStatus.length === 0) {
            throw new ForbiddenException('User not found');
        }
        return new UserWithFollowStatusDto(usersWithStatus[0]);
    }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        return this.repository.isFollowing(followerId, followingId);
    }
}

