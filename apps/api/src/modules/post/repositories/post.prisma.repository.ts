import { PrismaService } from "@/core";
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Post } from "generated/prisma";
import { CreatePostDto, UpdatePostDto, RepostDto } from "../dto/post.dto";
import { PostRepository, PostWithStats } from "./post.repository";

@Injectable()
export class PostPrismaRepository implements PostRepository {
    constructor(private readonly prisma: PrismaService) { }

    private async enrichPost(post: any, currentUserId?: string): Promise<PostWithStats> {
        // Параллельно получаем все необходимые данные
        const [likesCount, dislikesCount, repostsCount, userLike, originalPost] = await Promise.all([
            this.prisma.postLike.count({
                where: { postId: post.id, isLike: true },
            }),
            this.prisma.postLike.count({
                where: { postId: post.id, isLike: false },
            }),
            this.prisma.post.count({
                where: { originalPostId: post.id, deletedAt: null },
            }),
            currentUserId
                ? this.prisma.postLike.findUnique({
                    where: {
                        postId_userId: {
                            postId: post.id,
                            userId: currentUserId,
                        },
                    },
                }).catch(() => null)
                : Promise.resolve(null),
            post.originalPostId
                ? this.prisma.post.findUnique({
                    where: { id: post.originalPostId },
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                }).catch(() => null)
                : Promise.resolve(null),
        ]);

        return {
            ...post,
            likesCount,
            dislikesCount,
            repostsCount,
            userLike: userLike ? { isLike: userLike.isLike } : null,
            originalPost: originalPost as any,
            author: post.user ? {
                id: post.user.id,
                name: post.user.name,
                email: post.user.email,
                profile: post.user.profile,
            } : undefined,
        };
    }

    public async create(userId: string, data: CreatePostDto): Promise<PostWithStats> {
        const post = await this.prisma.post.create({
            data: {
                ...data,
                userId,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return this.enrichPost(post, userId);
    }

    public async findById(id: string, currentUserId?: string): Promise<PostWithStats> {
        const post = await this.prisma.post.findUnique({
            where: { id, deletedAt: null },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return this.enrichPost(post, currentUserId);
    }

    public async update(id: string, userId: string, data: UpdatePostDto): Promise<PostWithStats> {
        const post = await this.prisma.post.findUnique({
            where: { id, deletedAt: null },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        const updatedPost = await this.prisma.post.update({
            where: { id },
            data: {
                ...data,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return this.enrichPost(updatedPost, userId);
    }

    public async delete(id: string, userId: string): Promise<void> {
        const post = await this.prisma.post.findUnique({
            where: { id, deletedAt: null },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        await this.prisma.post.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    public async getFeed(currentUserId: string, cursor?: string, limit: number = 20): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }> {
        const take = limit + 1; // Берем на 1 больше, чтобы проверить есть ли следующая страница

        const where: any = {
            deletedAt: null,
            OR: [
                { userId: currentUserId },
                {
                    user: {
                        followers: {
                            some: {
                                followerId: currentUserId,
                            },
                        },
                    },
                },
            ],
        };

        if (cursor) {
            where.createdAt = {
                lt: new Date(cursor),
            };
        }

        const posts = await this.prisma.post.findMany({
            where,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const hasNext = posts.length > limit;
        const postsToReturn = hasNext ? posts.slice(0, limit) : posts;

        const enrichedPosts = await Promise.all(
            postsToReturn.map(post => this.enrichPost(post, currentUserId))
        );

        const nextCursor = hasNext && enrichedPosts.length > 0
            ? enrichedPosts[enrichedPosts.length - 1].createdAt.toISOString()
            : undefined;

        return {
            posts: enrichedPosts,
            nextCursor,
            hasNext,
        };
    }

    public async getByUserId(userId: string, currentUserId?: string, cursor?: string, limit: number = 20): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }> {
        const take = limit + 1;

        const where: any = {
            userId,
            deletedAt: null,
        };

        if (cursor) {
            where.createdAt = {
                lt: new Date(cursor),
            };
        }

        const posts = await this.prisma.post.findMany({
            where,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const hasNext = posts.length > limit;
        const postsToReturn = hasNext ? posts.slice(0, limit) : posts;

        const enrichedPosts = await Promise.all(
            postsToReturn.map(post => this.enrichPost(post, currentUserId))
        );

        const nextCursor = hasNext && enrichedPosts.length > 0
            ? enrichedPosts[enrichedPosts.length - 1].createdAt.toISOString()
            : undefined;

        return {
            posts: enrichedPosts,
            nextCursor,
            hasNext,
        };
    }

    public async getMyReposts(userId: string, cursor?: string, limit: number = 20): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }> {
        const take = limit + 1;

        const where: any = {
            userId,
            originalPostId: { not: null },
            deletedAt: null,
        };

        if (cursor) {
            where.createdAt = {
                lt: new Date(cursor),
            };
        }

        const posts = await this.prisma.post.findMany({
            where,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const hasNext = posts.length > limit;
        const postsToReturn = hasNext ? posts.slice(0, limit) : posts;

        const enrichedPosts = await Promise.all(
            postsToReturn.map(post => this.enrichPost(post, userId))
        );

        const nextCursor = hasNext && enrichedPosts.length > 0
            ? enrichedPosts[enrichedPosts.length - 1].createdAt.toISOString()
            : undefined;

        return {
            posts: enrichedPosts,
            nextCursor,
            hasNext,
        };
    }

    public async likePost(postId: string, userId: string, isLike: boolean): Promise<void> {
        const post = await this.prisma.post.findUnique({
            where: { id: postId, deletedAt: null },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        await this.prisma.postLike.upsert({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
            update: {
                isLike,
            },
            create: {
                postId,
                userId,
                isLike,
            },
        });
    }

    public async unlikePost(postId: string, userId: string): Promise<void> {
        await this.prisma.postLike.deleteMany({
            where: {
                postId,
                userId,
            },
        });
    }

    public async incrementViews(postId: string): Promise<void> {
        await this.prisma.post.update({
            where: { id: postId },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
    }

    public async repost(postId: string, userId: string, data?: RepostDto): Promise<PostWithStats> {
        const originalPost = await this.prisma.post.findUnique({
            where: { id: postId, deletedAt: null },
        });

        if (!originalPost) {
            throw new NotFoundException('Original post not found');
        }

        // Проверяем, не репостил ли уже пользователь этот пост
        const existingRepost = await this.prisma.post.findFirst({
            where: {
                userId,
                originalPostId: postId,
                deletedAt: null,
            },
        });

        if (existingRepost) {
            throw new ForbiddenException('You have already reposted this post');
        }

        const repost = await this.prisma.post.create({
            data: {
                userId,
                originalPostId: postId,
                text: data?.text,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return this.enrichPost(repost, userId);
    }

    public async getRepostUsers(postId: string): Promise<Array<{ id: string; name: string; email: string; avatar?: string; repostedAt: Date }>> {
        const reposts = await this.prisma.post.findMany({
            where: {
                originalPostId: postId,
                deletedAt: null,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return reposts.map(repost => ({
            id: repost.user.id,
            name: repost.user.name,
            email: repost.user.email,
            avatar: repost.user.profile?.avatar || undefined,
            repostedAt: repost.createdAt,
        }));
    }
}

