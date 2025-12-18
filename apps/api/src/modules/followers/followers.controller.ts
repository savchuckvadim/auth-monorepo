import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    Query,
    ForbiddenException,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FollowDto, UserWithFollowStatusDto } from './dto/follow.dto';
import { UserDto } from '../user';
import { TokenPayloadDto } from '../token/token.dto';

@Controller('followers')
@UseGuards(AccessTokenGuard)
export class FollowersController {
    constructor(private readonly followersService: FollowersService) { }

    @ApiOperation({ summary: 'Follow a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Followed successfully', type: FollowDto })
    @Post(':userId')
    async follow(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        console.log(user);
        if (!user?.userId) {
            throw new ForbiddenException('User not authenticated');
        }
        return this.followersService.follow(user.userId, userId);
    }

    @ApiOperation({ summary: 'Unfollow a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Unfollowed successfully', type: FollowDto })
    @Delete(':userId')
    async unfollow(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        await this.followersService.unfollow(user.userId, userId);
        return { message: 'Unfollowed successfully' };
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users list', type: [UserWithFollowStatusDto] })
    @Get('users')
    async getAllUsers(@CurrentUser() user: TokenPayloadDto) {
        return this.followersService.getAllUsers(user.userId);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'User', type: UserWithFollowStatusDto })
    @Get('users/:userId')
    async getUserById(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.followersService.getUserById(userId, user.userId);
    }

    @ApiOperation({ summary: 'Get followers of a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Followers list', type: [FollowDto] })
    @Get(':userId/followers')
    async getFollowers(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.followersService.getFollowers(userId, user.userId);
    }

    @ApiOperation({ summary: 'Get following of a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Following list', type: [FollowDto] })
    @Get(':userId/following')
    async getFollowing(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.followersService.getFollowing(userId, user.userId);
    }

    @ApiOperation({ summary: 'Get friends of a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Friends list', type: [UserWithFollowStatusDto] })
    @Get(':userId/friends')
    async getFriends(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        return this.followersService.getFriends(userId);
    }

    @ApiOperation({ summary: 'Get followers of the current user' })
    @ApiResponse({ status: 200, description: 'Followers list', type: [FollowDto] })
    @Get('me/followers')
    async getMyFollowers(@CurrentUser() user: TokenPayloadDto) {
        return this.followersService.getFollowers(user.userId, user.userId);
    }

    @ApiOperation({ summary: 'Get following of the current user' })
    @ApiResponse({ status: 200, description: 'Following list', type: [FollowDto] })
    @Get('me/following')
    async getMyFollowing(@CurrentUser() user: TokenPayloadDto) {
        return this.followersService.getFollowing(user.userId, user.userId);
    }

    @ApiOperation({ summary: 'Get friends of the current user' })
    @ApiResponse({ status: 200, description: 'Friends list', type: [UserWithFollowStatusDto] })
    @Get('me/friends')
    async getMyFriends(@CurrentUser() user: TokenPayloadDto) {
        return this.followersService.getFriends(user.userId);
    }

    @ApiOperation({ summary: 'Check if the current user is following a user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Following status', type: Boolean })
    @Get('check/:userId')
    async checkFollowing(
        @Param('userId') userId: string,
        @CurrentUser() user: TokenPayloadDto,
    ) {
        const isFollowing = await this.followersService.isFollowing(user.userId, userId);
        return { isFollowing };
    }
}

