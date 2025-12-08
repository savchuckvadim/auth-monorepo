import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
    constructor() { }

    async generateToken(userId: string) {
        return 'generateToken';
    }
}
