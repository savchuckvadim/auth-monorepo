import { PrismaService } from "@/core";
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Post, Prisma } from "generated/prisma";
import { CreatePostDto, UpdatePostDto, RepostDto } from "../dto/post.dto";
import { PostRepository, } from "./post.repository";
import { FullPost } from "../type/post.type";

@Injectable()
export class PostPrismaRepository implements PostRepository {
    constructor(private readonly prisma: PrismaService) { }

    private async enrichPost(post: any, currentUserId?: string): Promise<FullPost> {
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
                        author: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                }).catch(() => null)
                : Promise.resolve(null),
        ]);

        // Определяем автора поста

        const author = {
            id: post.author.id,
            name: post.author.name,
            email: post.author.email,
            avatar: post.author.profile?.avatar || null,
        };


        return {
            ...post,
            likesCount,
            dislikesCount,
            repostsCount,
            userLike: userLike ? { isLike: userLike.isLike } : null,
            originalPost: originalPost as any,
            author,
        };
    }

    public async create(authorId: string, data: CreatePostDto): Promise<FullPost> {
        // wallUserId - на чьей стене (если не указано - на своей)
        const wallUserId = data.wallUserId || authorId;

        // Удаляем wallUserId из data, так как это не поле в БД
        const { wallUserId: _, ...postData } = data;

        const post = await this.prisma.post.create({
            data: {
                ...postData,
                userId: wallUserId,  // Владелец стены
                authorId: authorId,  // Автор поста
            },
            include: {
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return this.enrichPost(post, authorId);
    }

    public async findById(id: string, currentUserId?: string): Promise<FullPost> {
        const post = await this.prisma.post.findUnique({
            where: { id, deletedAt: null },
            include: {
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

    public async update(id: string, userId: string, data: UpdatePostDto): Promise<FullPost> {
        const post = await this.prisma.post.findUnique({
            where: { id, deletedAt: null },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Проверяем, что текущий пользователь - автор поста
        const authorId = post.authorId || post.userId; // Обратная совместимость
        if (authorId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        const updatedPost = await this.prisma.post.update({
            where: { id },
            data: {
                ...data,
            },
            include: {
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

        // Проверяем, что текущий пользователь - автор или владелец стены
        const authorId = post.authorId || post.userId; // Обратная совместимость
        const isAuthor = authorId === userId;
        const isWallOwner = post.userId === userId;

        if (!isAuthor && !isWallOwner) {
            throw new ForbiddenException('You can only delete your own posts or posts on your wall');
        }

        await this.prisma.post.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    public async getFeed(currentUserId: string, cursor?: string, limit: number = 20): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }> {
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
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

    public async getByUserId(userId: string, currentUserId?: string, cursor?: string, limit: number = 20): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }> {
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
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

    public async getMyReposts(userId: string, cursor?: string, limit: number = 20): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }> {
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
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

        try {
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
        } catch (error) {
            // Обработка race condition: если запись уже существует (P2002 - unique constraint violation),
            // просто обновляем её
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                await this.prisma.postLike.update({
                    where: {
                        postId_userId: {
                            postId,
                            userId,
                        },
                    },
                    data: {
                        isLike,
                    },
                });
            } else {
                throw error;
            }
        }
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

    public async repost(postId: string, userId: string, data?: RepostDto): Promise<FullPost> {
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
                authorId: userId,  // При репосте автор = владелец стены
                originalPostId: postId,
                text: data?.text,
            },
            include: {
                user: {  // Владелец стены
                    include: {
                        profile: true,
                    },
                },
                author: {  // Автор поста
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

