import { Post } from "generated/prisma";
import { CreatePostDto, UpdatePostDto, RepostDto } from "./post.dto";

export type PostWithStats = Post & {
    likesCount: number;
    dislikesCount: number;
    repostsCount: number;
    userLike?: { isLike: boolean } | null;
    originalPost?: Post | null;
    author?: { id: string; name: string; email: string; profile?: { avatar?: string } | null };
};

export abstract class PostRepository {
    abstract create(userId: string, data: CreatePostDto): Promise<PostWithStats>;
    abstract findById(id: string, currentUserId?: string): Promise<PostWithStats>;
    abstract update(id: string, userId: string, data: UpdatePostDto): Promise<PostWithStats>;
    abstract delete(id: string, userId: string): Promise<void>;
    abstract getFeed(currentUserId: string, cursor?: string, limit?: number): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }>;
    abstract getByUserId(userId: string, currentUserId?: string, cursor?: string, limit?: number): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }>;
    abstract getMyReposts(userId: string, cursor?: string, limit?: number): Promise<{ posts: PostWithStats[]; nextCursor?: string; hasNext: boolean }>;
    abstract likePost(postId: string, userId: string, isLike: boolean): Promise<void>;
    abstract unlikePost(postId: string, userId: string): Promise<void>;
    abstract incrementViews(postId: string): Promise<void>;
    abstract repost(postId: string, userId: string, data?: RepostDto): Promise<PostWithStats>;
    abstract getRepostUsers(postId: string): Promise<Array<{ id: string; name: string; email: string; avatar?: string; repostedAt: Date }>>;
}

