import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./user.dto";


@Injectable()
export class UserService {
    constructor(
        private readonly repo: UserRepository,
    ) { }

    public async getUser(id: string) {
        return await this.repo.findById(id);
    }

    public async getAllUsers() {
        return await this.repo.getAll();
    }

    public async createUser(user: CreateUserDto) {
        return await this.repo.create(user);
    }
}
