import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from "./token.repository";
import { TokenPayloadDto, TokensDto } from "./token.dto";
import { UserDto } from "../user";
@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenRepository: TokenRepository,
    ) { }

    public generateTokens(payload: TokenPayloadDto): TokensDto {
        const result: TokensDto = {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
        return result;
    }

    private generateAccessToken(payload: TokenPayloadDto) {
        return this.jwtService.sign(payload, { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' });
    }
    private generateRefreshToken(payload: TokenPayloadDto) {
        return this.jwtService.sign(payload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '30d' });

    }

    public async saveToken(userId: string, refreshToken: string) {
        return await this.tokenRepository.saveToken(userId, refreshToken);
    }

    public async findToken(userId: string) {
        return await this.tokenRepository.findToken(userId);
    }

    public async removeToken(refreshToken: string) {
        return await this.tokenRepository.removeToken(refreshToken);
    }

    public async validateAccessToken(accessToken: string): Promise<TokenPayloadDto | null> {
        const userData = await this.jwtService.verify(accessToken, { secret: this.configService.get('JWT_ACCESS_SECRET') });
        return userData || null;
    }

    public async validateRefreshToken(refreshToken: string): Promise<TokenPayloadDto | null> {
        const userData = await this.jwtService.verify(refreshToken, { secret: this.configService.get('JWT_REFRESH_SECRET') });
        console.log('userData in validateRefreshToken', userData);
        return userData || null;
    }
}
