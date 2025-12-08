import { PrismaService } from "@/core";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "generated/prisma";
import { CreateUserDto } from "./user.dto";



@Injectable()
export class UserPrismaRepository implements UserPrismaRepository {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    public async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    public async findById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    public async create(user: CreateUserDto): Promise<User> {
        const newUser = await this.prisma.user.create({ data: user });
        if (!newUser) {
            throw new NotFoundException('User not created');
        }
        return newUser;
    }
}
