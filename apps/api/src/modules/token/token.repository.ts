import { Token } from "generated/prisma";

export abstract class TokenRepository {
    abstract saveToken(userId: string, refreshTtoken: string): Promise<Token>;
    abstract findToken(userId: string): Promise<Token>;
}
