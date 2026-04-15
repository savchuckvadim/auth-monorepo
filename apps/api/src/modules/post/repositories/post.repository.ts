import { CreatePostDto, UpdatePostDto, RepostDto } from '../dto/post.dto';
import { FullPost } from '../type/post.type';

export abstract class PostRepository {
    abstract create(userId: string, data: CreatePostDto): Promise<FullPost>;
    abstract findById(id: string, currentUserId?: string): Promise<FullPost>;
    abstract update(
        id: string,
        userId: string,
        data: UpdatePostDto,
    ): Promise<FullPost>;
    abstract delete(id: string, userId: string): Promise<void>;
    abstract getFeed(
        currentUserId: string,
        cursor?: string,
        limit?: number,
    ): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }>;
    abstract getByUserId(
        userId: string,
        currentUserId?: string,
        cursor?: string,
        limit?: number,
    ): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }>;
    abstract getMyReposts(
        userId: string,
        cursor?: string,
        limit?: number,
    ): Promise<{ posts: FullPost[]; nextCursor?: string; hasNext: boolean }>;
    abstract likePost(
        postId: string,
        userId: string,
        isLike: boolean,
    ): Promise<void>;
    abstract unlikePost(postId: string, userId: string): Promise<void>;
    abstract incrementViews(postId: string): Promise<void>;
    abstract repost(
        postId: string,
        userId: string,
        data?: RepostDto,
    ): Promise<FullPost>;
    abstract getRepostUsers(postId: string): Promise<
        Array<{
            id: string;
            name: string;
            email: string;
            avatar?: string;
            repostedAt: Date;
        }>
    >;
}
