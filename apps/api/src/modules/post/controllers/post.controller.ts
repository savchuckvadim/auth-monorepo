import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Patch,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto, PostDto, PaginatedPostsDto, RepostDto, PostRepostUserDto } from '../dto/post.dto';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '../../token';
import { S3Service } from '@/core/s3';

@Controller('posts')
@UseGuards(AccessTokenGuard)
@ApiTags('Posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly s3Service: S3Service,
    ) { }

    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created', type: PostDto })
    @Post()
    async createPost(
        @CurrentUser() user: TokenPayloadDto,
        @Body() createPostDto: CreatePostDto,
    ): Promise<PostDto> {
        return this.postService.createPost(user.userId, createPostDto);
    }

    @ApiOperation({ summary: 'Get post feed (scroll pagination)' })
    @ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination (ISO date string)', example: '2024-01-01T00:00:00.000Z' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return', example: 20 })
    @ApiResponse({ status: 200, description: 'Posts feed', type: PaginatedPostsDto })
    @Get('feed')
    async getFeed(
        @CurrentUser() user: TokenPayloadDto,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ): Promise<PaginatedPostsDto> {
        return this.postService.getFeed(
            user.userId,
            cursor,
            limit ? parseInt(limit) : undefined,
        );
    }

    @ApiOperation({ summary: 'Get posts by user ID (scroll pagination)' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination (ISO date string)', example: '2024-01-01T00:00:00.000Z' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return', example: 20 })
    @ApiResponse({ status: 200, description: 'User posts', type: PaginatedPostsDto })
    @Get('user/:userId')
    async getPostsByUserId(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ): Promise<PaginatedPostsDto> {
        return this.postService.getPostsByUserId(
            userId,
            user.userId,
            cursor,
            limit ? parseInt(limit) : undefined,
        );
    }

    @ApiOperation({ summary: 'Get my reposts (scroll pagination)' })
    @ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination (ISO date string)', example: '2024-01-01T00:00:00.000Z' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return', example: 20 })
    @ApiResponse({ status: 200, description: 'My reposts', type: PaginatedPostsDto })
    @Get('reposts/me')
    async getMyReposts(
        @CurrentUser() user: TokenPayloadDto,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ): Promise<PaginatedPostsDto> {
        return this.postService.getMyReposts(
            user.userId,
            cursor,
            limit ? parseInt(limit) : undefined,
        );
    }

    @ApiOperation({ summary: 'Get post by ID' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Post', type: PostDto })
    @Get(':id')
    async getPostById(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<PostDto> {
        const post = await this.postService.getPostById(id, user.userId);
        // Инкрементируем просмотры при получении поста
        await this.postService.incrementViews(id);
        return post;
    }

    @ApiOperation({ summary: 'Update a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Post updated', type: PostDto })
    @Put(':id')
    async updatePost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostDto> {
        return this.postService.updatePost(id, user.userId, updatePostDto);
    }

    @ApiOperation({ summary: 'Delete a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Post deleted' })
    @Delete(':id')
    async deletePost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<{ message: string }> {
        await this.postService.deletePost(id, user.userId);
        return { message: 'Post deleted successfully' };
    }

    @ApiOperation({ summary: 'Like a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Post liked' })
    @Post(':id/like')
    async likePost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<{ message: string }> {
        await this.postService.likePost(id, user.userId);
        return { message: 'Post liked' };
    }

    @ApiOperation({ summary: 'Dislike a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Post disliked' })
    @Post(':id/dislike')
    async dislikePost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<{ message: string }> {
        await this.postService.dislikePost(id, user.userId);
        return { message: 'Post disliked' };
    }

    @ApiOperation({ summary: 'Remove like/dislike from a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Like removed' })
    @Delete(':id/like')
    async unlikePost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
    ): Promise<{ message: string }> {
        await this.postService.unlikePost(id, user.userId);
        return { message: 'Like removed' };
    }

    @ApiOperation({ summary: 'Repost a post' })
    @ApiParam({ name: 'id', description: 'Post ID to repost', example: '1' })
    @ApiResponse({ status: 201, description: 'Post reposted', type: PostDto })
    @Post(':id/repost')
    async repost(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayloadDto,
        @Body() repostDto?: RepostDto,
    ): Promise<PostDto> {
        return this.postService.repost(id, user.userId, repostDto);
    }

    @ApiOperation({ summary: 'Get users who reposted a post' })
    @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Users who reposted', type: [PostRepostUserDto] })
    @Get(':id/reposts')
    async getRepostUsers(
        @Param('id') id: string,
    ): Promise<PostRepostUserDto[]> {
        return this.postService.getRepostUsers(id);
    }

    @ApiOperation({ summary: 'Upload media file for post (image or video)' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Media uploaded', schema: { type: 'object', properties: { url: { type: 'string' } } } })
    @Post('media')
    @UseInterceptors(FileInterceptor('file'))
    async uploadMedia(
        @CurrentUser() user: TokenPayloadDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ url: string }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Проверяем тип файла (только изображения и видео)
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            throw new BadRequestException('File must be an image or video');
        }

        // Проверяем размер видео (максимум 20 секунд - это нужно проверять на фронтенде)
        // Здесь проверяем только размер файла (например, максимум 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds maximum allowed size');
        }

        const { url } = await this.s3Service.uploadPostMedia(file, user.userId);
        return { url };
    }
}

