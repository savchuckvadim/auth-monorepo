import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor() { }


    //TODO: Guard: it is protected route
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return 'getUser';
    }
}
