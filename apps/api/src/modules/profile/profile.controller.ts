import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { AccessTokenGuard } from "@/core/guards/access-token.guard";
import { ProfileDto, UpdateProfileDto } from "./profile.dto";
import { CurrentUser } from "@/core/decorators/auth/current-user.decorator";
import { TokenPayloadDto } from "../token";
import { S3Service } from "@/core/s3";

@UseGuards(AccessTokenGuard)
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly service: ProfileService,
        private readonly s3Service: S3Service,
    ) { }

    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
    @Get('me')
    async getMyProfile(@CurrentUser() user: TokenPayloadDto) {
        return await this.service.getProfileByUserId(user.userId);
    }

    @ApiOperation({ summary: 'Get profile by user ID' })
    @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
    @ApiParam({ name: 'userId', description: 'User ID', example: '1' })
    @Get('user/:userId')
    async getProfileByUserId(@Param('userId') userId: string) {
        return await this.service.getProfileByUserId(userId);
    }

    @ApiOperation({ summary: 'Get profile by profile ID' })
    @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
    @ApiParam({ name: 'id', description: 'Profile ID', example: '1' })
    @Get(':id')
    async getProfileById(@Param('id') id: string) {
        return await this.service.getProfileById(id);
    }

    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'Updated profile', type: ProfileDto })
    @Patch('me')
    async updateMyProfile(
        @CurrentUser() user: TokenPayloadDto,
        @Body() updateDto: UpdateProfileDto,
    ) {
        return await this.service.updateProfile(user.userId, updateDto);
    }

    @ApiOperation({ summary: 'Upload avatar image' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Avatar uploaded', type: ProfileDto })
    @Post('me/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @CurrentUser() user: TokenPayloadDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const { url } = await this.s3Service.uploadAvatar(file, user.userId);
        return await this.service.updateProfile(user.userId, { avatar: url });
    }

    @ApiOperation({ summary: 'Upload hero image' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Hero image uploaded', type: ProfileDto })
    @Post('me/hero')
    @UseInterceptors(FileInterceptor('file'))
    async uploadHero(
        @CurrentUser() user: TokenPayloadDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const { url } = await this.s3Service.uploadHero(file, user.userId);
        return await this.service.updateProfile(user.userId, { hero: url });
    }
}

