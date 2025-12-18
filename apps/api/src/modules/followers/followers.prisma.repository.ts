import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core';
import { FollowersRepository } from './followers.repository';
import { Follow, User } from 'generated/prisma';

type UserBasic = {
    id: string;
    name: string;
    email: string;
};

@Injectable()
export class FollowersPrismaRepository implements FollowersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async follow(followerId: string, followingId: string): Promise<Follow & { following?: UserBasic }> {
        if (!followerId || !followingId) {
            throw new BadRequestException('followerId and followingId are required');
        }

        if (followerId === followingId) {
            throw new BadRequestException('Cannot follow yourself');
        }

        // Проверяем, существует ли пользователь, на которого подписываемся
        const followingUser = await this.prisma.user.findUnique({
            where: { id: followingId },
        });

        if (!followingUser) {
            throw new NotFoundException('User not found');
        }

        // Проверяем, не подписан ли уже
        const existingFollow = await this.prisma.follow.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        if (existingFollow) {
            throw new BadRequestException('Already following this user');
        }

        const result = await this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return result as Follow & { following?: UserBasic };
    }

    async unfollow(followerId: string, followingId: string): Promise<void> {
        if (!followerId || !followingId) {
            throw new BadRequestException('followerId and followingId are required');
        }

        const follow = await this.prisma.follow.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        if (!follow) {
            throw new NotFoundException('Follow relationship not found');
        }

        await this.prisma.follow.delete({
            where: {
                id: follow.id,
            },
        });
    }

    async getFollowers(userId: string): Promise<(Follow & { follower?: UserBasic })[]> {
        const result = await this.prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return result as (Follow & { follower?: UserBasic })[];
    }

    async getFollowing(userId: string): Promise<(Follow & { following?: UserBasic })[]> {
        const result = await this.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return result as (Follow & { following?: UserBasic })[];
    }

    async getFriends(userId: string): Promise<UserBasic[]> {
        // Друзья = взаимные подписки
        const following = await this.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });

        const followingIds = following.map(f => f.followingId);

        if (followingIds.length === 0) {
            return [];
        }

        // Находим тех, кто тоже подписан на текущего пользователя
        const mutualFollows = await this.prisma.follow.findMany({
            where: {
                followerId: {
                    in: followingIds,
                },
                followingId: userId,
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                        isAcivated: true,
                        role: true,
                    },
                },
            },
        });

        return mutualFollows.map(f => ({
            id: f.follower.id,
            name: f.follower.name,
            email: f.follower.email,
        }));
    }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        if (!followerId || !followingId) {
            return false;
        }

        const follow = await this.prisma.follow.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        return follow !== null;
    }

    async getAllUsers(currentUserId: string): Promise<UserBasic[]> {
        return this.prisma.user.findMany({
            where: {
                id: {
                    not: currentUserId, // Исключаем текущего пользователя
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                isAcivated: true,
                role: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async getUsersWithFollowStatus(
        currentUserId: string,
        userIds: string[],
    ): Promise<(UserBasic & { isFollowing?: boolean; isFollower?: boolean })[]> {
        if (userIds.length === 0) {
            return [];
        }

        // Получаем всех пользователей
        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                isAcivated: true,
                activationLink: true,
                role: true,
                password: true,
            },
        });

        // Получаем подписки текущего пользователя
        const following = await this.prisma.follow.findMany({
            where: {
                followerId: currentUserId,
                followingId: {
                    in: userIds,
                },
            },
            select: {
                followingId: true,
            },
        });

        const followingIds = new Set(following.map(f => f.followingId));

        // Получаем подписчиков текущего пользователя
        const followers = await this.prisma.follow.findMany({
            where: {
                followingId: currentUserId,
                followerId: {
                    in: userIds,
                },
            },
            select: {
                followerId: true,
            },
        });

        const followerIds = new Set(followers.map(f => f.followerId));

        // Добавляем статусы подписки
        return users.map(user => ({
            ...user,
            isFollowing: followingIds.has(user.id),
            isFollower: followerIds.has(user.id),
        }));
    }

    async getUserBasic(userId: string): Promise<UserBasic | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return user;
    }
}

