import { PrismaService } from '@/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from 'generated/prisma';
import { UpdateProfileDto } from './profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfilePrismaRepository implements ProfileRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async findByUserId(userId: string): Promise<
        Profile & {
            followersCount: number;
            followingCount: number;
            postsCount: number;
        }
    > {
        let profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    include: {
                        followers: true,
                        following: true,
                        posts: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
        });

        if (!profile) {
            await this.prisma.profile.create({
                data: {
                    userId,
                },
            });

            profile = await this.prisma.profile.findUnique({
                where: { userId },
                include: {
                    user: {
                        include: {
                            followers: true,
                            following: true,
                            posts: {
                                where: {
                                    deletedAt: null,
                                },
                            },
                        },
                    },
                },
            });
        }

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return {
            ...profile,
            followersCount: profile.user.followers.length,
            followingCount: profile.user.following.length,
            postsCount: profile.user.posts.length,
        };
    }

    public async findById(id: string): Promise<
        Profile & {
            followersCount: number;
            followingCount: number;
            postsCount: number;
        }
    > {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        followers: true,
                        following: true,
                        posts: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return {
            ...profile,
            followersCount: profile.user.followers.length,
            followingCount: profile.user.following.length,
            postsCount: profile.user.posts.length,
        };
    }

    public async create(userId: string): Promise<Profile> {
        return await this.prisma.profile.create({
            data: {
                userId,
            },
        });
    }

    public async update(
        userId: string,
        data: UpdateProfileDto,
    ): Promise<Profile> {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return await this.prisma.profile.update({
            where: { userId },
            data: {
                ...data,
            },
        });
    }
}
