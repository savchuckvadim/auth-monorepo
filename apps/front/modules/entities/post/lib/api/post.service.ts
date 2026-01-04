import { CreatePostDto, getPosts, PaginatedPostsDto, PostDto } from "@workspace/nest-api";
import { customAxios } from "@workspace/nest-api/src/lib/back-api";

class PostService {
    private api: ReturnType<typeof getPosts>;
    public constructor() {
        this.api = getPosts();
    }

    public async getPostById(id: string): Promise<PostDto> {
        return await this.api.postGetPostById(id) as PostDto;
    }
    public async getPostsByUserId(userId: string): Promise<PostDto[]> {
        const paginatedResult = await this.api.postGetPostsByUserId(userId) as PaginatedPostsDto;
        return paginatedResult.posts;
    }
    public async getPostsFeed(): Promise<PostDto[]> {
        const paginatedResult = await this.api.postGetFeed() as PaginatedPostsDto;
        return paginatedResult.posts;
    }
    public async getMyReposts(): Promise<PostDto[]> {
        const paginatedResult = await this.api.postGetMyReposts() as PaginatedPostsDto;
        return paginatedResult.posts;
    }
    public async createPost(post: CreatePostDto): Promise<PostDto> {
        return await this.api.postCreatePost(post) as PostDto;
    }

    public async uploadPostMedia(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return await customAxios<{ url: string }>({
            url: '/api/posts/media',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        }) as { url: string };
    }
    public async deletePost(id: string): Promise<void> {
        return await this.api.postDeletePost(id);
    }
}


export const postService = new PostService();
