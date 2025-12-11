import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";

import { AccessTokenGuard } from "@/core/guards/access-token.guard";
import { UserDto } from "./user.dto";


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
    async getAllUsers() {
        return await this.service.getAllUsers();
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'User', type: UserDto })
    @ApiParam({ name: 'id', description: 'User id', example: '1' })
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.service.getUser(id);
    }


}
