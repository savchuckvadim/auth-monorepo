import { getUser, UserDto } from "@workspace/nest-api";
const $api = getUser();

export class UserService {

    constructor() { }

    static async getUser(id: string): Promise<UserDto> {
        const user = await $api.userGetUser(id) as UserDto;
        console.log('🔍 [USER SERVICE] user', user);
        debugger;
        return user;
    }

    static async getAllUsers(): Promise<UserDto[]> {
        return await $api.userGetAllUsers() as UserDto[];
    }
}
