import { Injectable, ForbiddenException } from "@nestjs/common";
import { PostRepository } from "../repositories/post.repository";
import { CreatePostDto, UpdatePostDto, PostDto, PaginatedPostsDto, RepostDto, PostRepostUserDto } from "../dto/post.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PostCreatedEvent, PostDeletedEvent, PostLikedEvent, PostUpdatedEvent } from "../events/post.events";
import { PostEvent } from "../type/post-event.type";
import { FollowersService } from "../../followers/followers.service";
import { S3Service } from "@/core/s3";

@Injectable()
export class PostService {
    constructor(
        private readonly repo: PostRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly followersService: FollowersService,
        private readonly s3Service: S3Service,
    ) { }

    public async createPost(authorId: string, data: CreatePostDto): Promise<PostDto> {
        // Проверка подписки, если пост на чужой стене
        const wallUserId = data.wallUserId || authorId;

        if (wallUserId !== authorId) {
            // Проверяем, что автор подписан на владельца стены
            const isFollowing = await this.followersService.isFollowing(authorId, wallUserId);
            if (!isFollowing) {
                throw new ForbiddenException('You can only post on walls of users you follow');
            }
        }

        const post = new PostDto(await this.repo.create(authorId, data));
        this.eventEmitter.emit(PostEvent.CREATED, new PostCreatedEvent(post));
        return post;
    }

    public async getPostById(id: string, currentUserId?: string): Promise<PostDto> {
        return new PostDto(await this.repo.findById(id, currentUserId));
    }

    public async updatePost(id: string, userId: string, data: UpdatePostDto): Promise<PostDto> {
        // Проверка выполняется в Repository
        const post = new PostDto(await this.repo.update(id, userId, data));
        this.eventEmitter.emit(PostEvent.UPDATED, new PostUpdatedEvent(post));
        return post;
    }

    public async deletePost(id: string, userId: string): Promise<void> {
        // Получаем пост перед удалением, чтобы удалить медиа из S3
        const post = await this.repo.findById(id, userId);

        // Удаляем медиа файлы из S3
        const mediaUrls: string[] = [];
        if (post.image) mediaUrls.push(post.image);
        if (post.audio) mediaUrls.push(post.audio);
        if (post.video) mediaUrls.push(post.video);

        if (mediaUrls.length > 0) {
            await this.s3Service.deleteFiles(mediaUrls);
        }

        // Удаляем пост из БД
        await this.repo.delete(id, userId);
        this.eventEmitter.emit(PostEvent.DELETED, new PostDeletedEvent(id));
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
        await this.repo.likePost(postId, userId, true);
        this.eventEmitter.emit(PostEvent.LIKED, new PostLikedEvent(postId, userId, true));
    }

    public async dislikePost(postId: string, userId: string): Promise<void> {
        await this.repo.likePost(postId, userId, false);
        this.eventEmitter.emit(PostEvent.LIKED, new PostLikedEvent(postId, userId, false));
    }

    public async unlikePost(postId: string, userId: string): Promise<void> {
        await this.repo.unlikePost(postId, userId);
        this.eventEmitter.emit(PostEvent.LIKED, new PostLikedEvent(postId, userId, false));
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

