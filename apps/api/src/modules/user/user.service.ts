import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto, UserDto } from "./user.dto";
import { User } from "generated/prisma";
import { compare } from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private readonly repo: UserRepository,
    ) { }

    public async getUser(id: string): Promise<UserDto> {
        return new UserDto(await this.repo.findById(id));
    }
    public async getUserByEmail(email: string): Promise<User> {
        return await this.repo.findByEmail(email);
    }

    public comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }

    public async getAllUsers(): Promise<UserDto[]> {
        return (await this.repo.getAll()).map(user => new UserDto(user));
    }

    public async createUser(user: CreateUserDto): Promise<UserDto> {
        return new UserDto(await this.repo.create(user));
    }

    public async activateUser(activationLink: string) {
        return new UserDto(await this.repo.activate(activationLink));
    }

    public async deleteUser(id: string): Promise<void> {
        return await this.repo.delete(id);
    }


}
