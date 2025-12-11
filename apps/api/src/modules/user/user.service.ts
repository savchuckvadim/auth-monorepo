import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./user.dto";
import { User } from "generated/prisma";
import { compare } from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private readonly repo: UserRepository,
    ) { }

    public async getUser(id: string) {
        return await this.repo.findById(id);
    }
    public async getUserByEmail(email: string): Promise<User> {
        return await this.repo.findByEmail(email);
    }

    public comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }

    public async getAllUsers() {
        return await this.repo.getAll();
    }

    public async createUser(user: CreateUserDto) {
        return await this.repo.create(user);
    }

    public async activateUser(activationLink: string) {
        return await this.repo.activate(activationLink);
    }
}
