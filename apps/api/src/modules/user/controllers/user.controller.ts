import { Controller, ForbiddenException, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";

import { AccessTokenGuard } from "@/core/guards/access-token.guard";
import { UserDto } from "../dto/user.dto";
import { CurrentUser } from "@/core/decorators/auth/current-user.decorator";
import { TokenPayloadDto } from "../../token";


@UseGuards(AccessTokenGuard) // защита всех эндпоинтов этого контроллера
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly service: UserService,
    ) { }


    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users list', type: [UserDto] })
    @Get()
    async getAllUsers(@CurrentUser() user: TokenPayloadDto) {
        if (!user?.userId) {
            throw new ForbiddenException('User not authenticated');
        }
        return await this.service.getAllUsers(user.userId);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'User', type: UserDto })
    @ApiParam({ name: 'id', description: 'User id', example: '1' })
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.service.getUser(id);
    }


}
