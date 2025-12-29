import { User } from "generated/prisma";
import { CreateUserDto } from "./user.dto";
import { UserWithFollowStatusType } from "./user.type";

export abstract class UserRepository {
    abstract getAll(currentUserId: string): Promise<UserWithFollowStatusType[]>;
    abstract getByIds(ids: string[]): Promise<User[]>;
    abstract findByEmail(email: string): Promise<User>;
    abstract findById(id: string): Promise<User>;
    abstract create(user: CreateUserDto): Promise<User>;
    abstract activate(activationLink: string): Promise<User>;
    abstract update(user: User): Promise<User>;
    abstract delete(id: string): Promise<void>;
}
