import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from "./token.repository";
@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenRepository: TokenRepository,
    ) { }

    public generateTokens(payload: any) {
        const result = {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
        return result;
    }

    private generateAccessToken(payload: any) {
        return this.jwtService.sign(payload, { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' });
    }
    private generateRefreshToken(payload: any) {
        return this.jwtService.sign(payload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '30d' });

    }

    public async saveToken(userId: string, refreshToken: string) {
        return await this.tokenRepository.saveToken(userId, refreshToken);
    }
}
