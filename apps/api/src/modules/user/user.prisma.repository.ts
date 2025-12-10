import { PrismaService } from "@/core";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User, user_roles } from "generated/prisma";
import { CreateUserDto } from "./user.dto";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";



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
        const candidate = await this.prisma.user.findUnique({ where: { email: user.email } });
        if (candidate) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await hash(user.password, 10);
        const activationLink = randomUUID();
        const newUser = await this.prisma.user.create({
            data: {
                ...user,
                role: user_roles.user,
                password: hashedPassword,
                activationLink: activationLink,
            }
        });

        if (!newUser) {
            throw new NotFoundException('User not created');
        }
        return newUser;
    }
}
