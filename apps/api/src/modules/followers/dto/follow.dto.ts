import { ApiProperty } from '@nestjs/swagger';

type UserBasic = {
    id: string;
    name: string;
    email: string;
};

export class UserBasicDto implements UserBasic {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    id: string;
    @ApiProperty({ description: 'Name', example: 'John Doe', type: String })
    name: string;
    @ApiProperty({
        description: 'Email',
        example: 'john.doe@example.com',
        type: String,
    })
    email: string;
}

export class FollowDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    id: string;
    @ApiProperty({ description: 'Follower ID', example: '1', type: String })
    followerId: string;
    @ApiProperty({ description: 'Following ID', example: '1', type: String })
    followingId: string;
    @ApiProperty({
        description: 'Created At',
        example: '2021-01-01',
        type: Date,
    })
    createdAt: Date;
    @ApiProperty({
        description: 'Follower',
        example: { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
        type: UserBasicDto,
    })
    follower?: UserBasicDto;
    @ApiProperty({
        description: 'Following',
        example: { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
        type: UserBasicDto,
    })
    following?: UserBasicDto;

    constructor(follow: any) {
        this.id = follow.id;
        this.followerId = follow.followerId;
        this.followingId = follow.followingId;
        this.createdAt = follow.createdAt;
        this.follower = follow.follower;
        this.following = follow.following;
    }
}

export class UserWithFollowStatusDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    id: string;
    @ApiProperty({ description: 'Name', example: 'John Doe', type: String })
    name: string;
    @ApiProperty({
        description: 'Email',
        example: 'john.doe@example.com',
        type: String,
    })
    email: string;
    @ApiProperty({ description: 'Is Following', example: true, type: Boolean })
    isFollowing: boolean;
    @ApiProperty({ description: 'Is Follower', example: true, type: Boolean })
    isFollower: boolean;
    @ApiProperty({ description: 'Is Friend', example: true, type: Boolean })
    isFriend: boolean; // взаимная подписка

    constructor(
        user: UserBasic & { isFollowing?: boolean; isFollower?: boolean },
    ) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.isFollowing = user.isFollowing || false;
        this.isFollower = user.isFollower || false;
        this.isFriend = (user.isFollowing && user.isFollower) || false;
    }
}
