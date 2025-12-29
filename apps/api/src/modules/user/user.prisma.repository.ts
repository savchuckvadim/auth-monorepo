import { PrismaService } from "@/core";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User, user_roles } from "generated/prisma";
import { CreateUserDto } from "./user.dto";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { UserRepository } from "./user.repository";
import { UserWithFollowStatusType } from "./user.type";



@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll(currentUserId: string): Promise<UserWithFollowStatusType[]> {
        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    not: currentUserId,
                }
            },
            include: {
                followers: true,
                following: true,
            }
        });
        return users.map((user) => {

            const isFollowing = user.following.some(follower => follower.followerId === currentUserId);
            const isFollower = user.followers.some(following => following.followingId === currentUserId);
            const isFriend = isFollowing && isFollower;

            return {
                ...user,
                isFollowing,
                isFollower,
                isFriend,
            };
        });
    }

    public async getByIds(ids: string[]): Promise<User[]> {
        return this.prisma.user.findMany({ where: { id: { in: ids } } });
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


    public async activate(activationLink: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { activationLink } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.update(
            {
                ...user,
                isAcivated: true
            }
        );
    }

    public async update(user: User): Promise<User> {
        return await this.prisma.user.update({ where: { id: user.id }, data: user });
    }

    public async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}
