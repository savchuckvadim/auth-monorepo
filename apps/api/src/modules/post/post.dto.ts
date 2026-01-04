import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MaxLength, IsNumber, IsBoolean, IsEnum } from "class-validator";
import { Post, PostLike } from "generated/prisma";

export class CreatePostDto {
    @ApiProperty({ description: 'Text content', example: 'My post text', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Text must not exceed 2000 characters' })
    text?: string;

    @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
    image?: string;

    @ApiProperty({ description: 'Audio URL', example: 'https://example.com/audio.mp3', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Audio URL must not exceed 500 characters' })
    audio?: string;

    @ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Video URL must not exceed 500 characters' })
    video?: string;

    @ApiProperty({ description: 'Link URL', example: 'https://example.com', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Link URL must not exceed 500 characters' })
    link?: string;
}

export class UpdatePostDto {
    @ApiProperty({ description: 'Text content', example: 'Updated post text', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Text must not exceed 2000 characters' })
    text?: string;

    @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
    image?: string;

    @ApiProperty({ description: 'Audio URL', example: 'https://example.com/audio.mp3', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Audio URL must not exceed 500 characters' })
    audio?: string;

    @ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Video URL must not exceed 500 characters' })
    video?: string;

    @ApiProperty({ description: 'Link URL', example: 'https://example.com', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Link URL must not exceed 500 characters' })
    link?: string;
}

export class RepostDto {
    @ApiProperty({ description: 'Text comment for repost', example: 'Great post!', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Text must not exceed 2000 characters' })
    text?: string;
}

export class PostDto implements Partial<Post> {
    constructor(
        post: Post & {
            likesCount?: number;
            dislikesCount?: number;
            repostsCount?: number;
            userLike?: { isLike: boolean } | null;
            originalPost?: Post | null;
            author?: { id: string; name: string; email: string; profile?: { avatar?: string } | null };
        }
    ) {
        this.id = post.id;
        this.userId = post.userId;
        this.text = post.text || undefined;
        this.image = post.image || undefined;
        this.audio = post.audio || undefined;
        this.video = post.video || undefined;
        this.link = post.link || undefined;
        this.views = post.views;
        this.originalPostId = post.originalPostId || undefined;
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.deletedAt = post.deletedAt || undefined;
        this.likesCount = post.likesCount || 0;
        this.dislikesCount = post.dislikesCount || 0;
        this.repostsCount = post.repostsCount || 0;
        this.isLiked = post.userLike?.isLike === true;
        this.isDisliked = post.userLike?.isLike === false;
        this.originalPost = post.originalPost ? new PostDto(post.originalPost as any) : null;
        this.author = post.author ? {
            id: post.author.id,
            name: post.author.name,
            email: post.author.email,
            avatar: post.author.profile?.avatar || null,
        } : null;
    }

    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'User ID', example: '1' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Text content', example: 'My post text', required: false })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ description: 'Audio URL', example: 'https://example.com/audio.mp3', required: false })
    @IsOptional()
    @IsString()
    audio?: string;

    @ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4', required: false })
    @IsOptional()
    @IsString()
    video?: string;

    @ApiProperty({ description: 'Link URL', example: 'https://example.com', required: false })
    @IsOptional()
    @IsString()
    link?: string;

    @ApiProperty({ description: 'Views count', example: 100 })
    @IsNumber()
    views: number;

    @ApiProperty({ description: 'Original post ID for reposts', example: '1', required: false })
    @IsOptional()
    @IsString()
    originalPostId?: string;

    @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Deleted at', example: '2024-01-01T00:00:00.000Z', required: false })
    @IsOptional()
    deletedAt?: Date;

    @ApiProperty({ description: 'Likes count', example: 10 })
    @IsNumber()
    likesCount: number;

    @ApiProperty({ description: 'Dislikes count', example: 2 })
    @IsNumber()
    dislikesCount: number;

    @ApiProperty({ description: 'Reposts count', example: 5 })
    @IsNumber()
    repostsCount: number;

    @ApiProperty({ description: 'Is liked by current user', example: true })
    @IsBoolean()
    isLiked: boolean;

    @ApiProperty({ description: 'Is disliked by current user', example: false })
    @IsBoolean()
    isDisliked: boolean;

    @ApiProperty({ description: 'Original post if this is a repost', type: () => PostDto, required: false })
    @IsOptional()
    originalPost?: PostDto | null;

    @ApiProperty({ description: 'Author information', required: false })
    @IsOptional()
    author?: {
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
    } | null;
}

export class PaginatedPostsDto {
    @ApiProperty({ description: 'Posts list', type: [PostDto] })
    posts: PostDto[];

    @ApiProperty({
        description: 'Cursor for next page (ISO date string). Use this value in the cursor query parameter for the next page.',
        example: '2024-01-01T00:00:00.000Z',
        required: false
    })
    @IsOptional()
    @IsString()
    nextCursor?: string;

    @ApiProperty({
        description: 'Indicates if there are more posts available. If true, use nextCursor to fetch the next page.',
        example: true
    })
    @IsBoolean()
    hasNext: boolean;
}

export class PostRepostUserDto {
    @ApiProperty({ description: 'User ID', example: '1' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    @IsString()
    email: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: 'Repost date', example: '2024-01-01T00:00:00.000Z' })
    repostedAt: Date;
}

