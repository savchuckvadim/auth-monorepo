import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('User Admin')
@Controller('admin/user')
export class UserAdminController {
    constructor(
        private readonly service: UserService,
    ) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users list', type: [UserDto] })
    @Get()
    async getAllUsers(): Promise<UserDto[]> {
        return await this.service.getAllUsers();
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'User', type: UserDto })
    @ApiParam({ name: 'id', description: 'User id', example: '1' })
    @Get(':id')
    async getUser(@Param('id') id: string): Promise<UserDto> {
        return await this.service.getUser(id);
    }

    @ApiOperation({ summary: 'Delete user by id' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiParam({ name: 'id', description: 'User id', example: '1' })
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        return await this.service.deleteUser(id);
    }
}
