import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MaxLength, IsNumber } from "class-validator";
import { Profile } from "generated/prisma";

export class UpdateProfileDto {
    @ApiProperty({ description: 'Name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: 'Name must not exceed 255 characters' })
    name?: string;

    @ApiProperty({ description: 'About', example: 'About me text', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1000, { message: 'About must not exceed 1000 characters' })
    about?: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Avatar URL must not exceed 500 characters' })
    avatar?: string;

    @ApiProperty({ description: 'Hero image URL', example: 'https://example.com/hero.jpg', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Hero URL must not exceed 500 characters' })
    hero?: string;
}

export class ProfileDto implements Partial<Profile> {
    constructor(profile: Profile & { followersCount?: number; followingCount?: number; postsCount?: number }) {
        this.id = profile.id;
        this.userId = profile.userId;
        this.name = profile.name || undefined;
        this.about = profile.about || undefined;
        this.avatar = profile.avatar || undefined;
        this.hero = profile.hero || undefined;
        this.createdAt = profile.createdAt;
        this.updatedAt = profile.updatedAt;
        this.followersCount = profile.followersCount || 0;
        this.followingCount = profile.followingCount || 0;
        this.postsCount = profile.postsCount || 0;
    }

    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'User ID', example: '1' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'About', example: 'About me text', required: false })
    @IsOptional()
    @IsString()
    about?: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: 'Hero image URL', example: 'https://example.com/hero.jpg', required: false })
    @IsOptional()
    @IsString()
    hero?: string;

    @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Followers count', example: 100 })
    @IsNumber()
    followersCount: number;

    @ApiProperty({ description: 'Following count', example: 50 })
    @IsNumber()
    followingCount: number;

    @ApiProperty({ description: 'Posts count', example: 25 })
    @IsNumber()
    postsCount: number;
}

