import { Injectable } from "@nestjs/common";
import { PostRepository } from "./post.repository";
import { CreatePostDto, UpdatePostDto, PostDto, PaginatedPostsDto, RepostDto, PostRepostUserDto } from "./post.dto";

@Injectable()
export class PostService {
    constructor(
        private readonly repo: PostRepository,
    ) { }

    public async createPost(userId: string, data: CreatePostDto): Promise<PostDto> {
        return new PostDto(await this.repo.create(userId, data));
    }

    public async getPostById(id: string, currentUserId?: string): Promise<PostDto> {
        return new PostDto(await this.repo.findById(id, currentUserId));
    }

    public async updatePost(id: string, userId: string, data: UpdatePostDto): Promise<PostDto> {
        return new PostDto(await this.repo.update(id, userId, data));
    }

    public async deletePost(id: string, userId: string): Promise<void> {
        return await this.repo.delete(id, userId);
    }

    public async getFeed(currentUserId: string, cursor?: string, limit?: number): Promise<PaginatedPostsDto> {
        const result = await this.repo.getFeed(currentUserId, cursor, limit);
        return {
            posts: result.posts.map(post => new PostDto(post)),
            nextCursor: result.nextCursor,
            hasNext: result.hasNext,
        };
    }

    public async getPostsByUserId(userId: string, currentUserId?: string, cursor?: string, limit?: number): Promise<PaginatedPostsDto> {
        const result = await this.repo.getByUserId(userId, currentUserId, cursor, limit);
        return {
            posts: result.posts.map(post => new PostDto(post)),
            nextCursor: result.nextCursor,
            hasNext: result.hasNext,
        };
    }

    public async getMyReposts(userId: string, cursor?: string, limit?: number): Promise<PaginatedPostsDto> {
        const result = await this.repo.getMyReposts(userId, cursor, limit);
        return {
            posts: result.posts.map(post => new PostDto(post)),
            nextCursor: result.nextCursor,
            hasNext: result.hasNext,
        };
    }

    public async likePost(postId: string, userId: string): Promise<void> {
        return await this.repo.likePost(postId, userId, true);
    }

    public async dislikePost(postId: string, userId: string): Promise<void> {
        return await this.repo.likePost(postId, userId, false);
    }

    public async unlikePost(postId: string, userId: string): Promise<void> {
        return await this.repo.unlikePost(postId, userId);
    }

    public async incrementViews(postId: string): Promise<void> {
        return await this.repo.incrementViews(postId);
    }

    public async repost(postId: string, userId: string, data?: RepostDto): Promise<PostDto> {
        const post = await this.repo.repost(postId, userId, data);
        return new PostDto(post);
    }

    public async getRepostUsers(postId: string): Promise<PostRepostUserDto[]> {
        const users = await this.repo.getRepostUsers(postId);
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            repostedAt: user.repostedAt,
        }));
    }
}

