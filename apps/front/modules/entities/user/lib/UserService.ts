import { getUser, UserDto } from "@workspace/nest-api";

export class UserService {
    api = getUser();
    constructor() { }

    async getUser(id: string): Promise<UserDto> {
        return await this.api.userGetUser(id) as UserDto;
    }

    async getAllUsers(): Promise<UserDto[]> {
        return await this.api.userGetAllUsers() as UserDto[];
    }
}
