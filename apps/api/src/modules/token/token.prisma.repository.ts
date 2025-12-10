import { Token } from "generated/prisma";
import { TokenRepository } from "./token.repository";
import { PrismaService } from "@/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenPrismaRepository implements TokenRepository {
    constructor(private readonly prisma: PrismaService) { }


    async saveToken(userId: string, refreshToken: string): Promise<Token> {
        const tokenData = await this.prisma.token.findFirst({
            where: {
                userId,
            },
        });
        if (tokenData) {
            return await this.prisma.token.update({
                where: { id: tokenData.id },
                data: { refreshToken },
            });
        }
        return await this.prisma.token.create({
            data: {
                userId,
                refreshToken,
            },
        });
    }

}
