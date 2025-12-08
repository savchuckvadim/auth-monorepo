import { User } from "generated/prisma";
import { CreateUserDto } from "./user.dto";

export abstract class UserRepository {
    abstract getAll(): Promise<User[]>;
    abstract findByEmail(email: string): Promise<User>;
    abstract findById(id: string): Promise<User>;
    abstract create(user: CreateUserDto): Promise<User>;
    abstract update(user: User): Promise<User>;
    abstract delete(id: string): Promise<void>;
}
