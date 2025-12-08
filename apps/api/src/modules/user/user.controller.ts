import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { user_roles } from "generated/prisma";
import { CreateUserDto } from "./user.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly service: UserService,
    ) { }


    @Get()
    async getAllUsers() {
        return await this.service.getAllUsers();
    }

    //TODO: Guard: it is protected route
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.service.getUser(id);
    }

    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: CreateUserDto, description: 'Create user' })
    @Post('create')
    async testCreateUser(@Body() createUserDto: CreateUserDto) {
        return await this.service.createUser({
            name: 'Test',
            email: 'test@test.com',
            password: 'test',
            role: user_roles.user,


        });
    }
}
