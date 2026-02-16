import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenRepository } from "./token.repository";
import { TokenPayloadDto, TokensDto } from "./token.dto";
import { EnumAuthErrorCode, EnumAuthSecrets } from "./token.type";
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
        return this.jwtService.sign(payload, {
            secret: this.configService.get(
                EnumAuthSecrets.ACCESS_TOKEN
            ),
            expiresIn: '15m'
        }
        );
    }
    private generateRefreshToken(payload: TokenPayloadDto) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get(
                EnumAuthSecrets.REFRESH_TOKEN
            ),
            expiresIn: '30d'
        }
        );

    }

    public async saveToken(userId: string, refreshToken: string) {
        return await this.tokenRepository.saveToken(userId, refreshToken);
    }

    public async findToken(userId: string) {
        return await this.tokenRepository.findToken(userId);
    }

    public async findTokenByRefreshToken(refreshToken: string) {
        return await this.tokenRepository.findTokenByRefreshToken(refreshToken);
    }

    public async removeToken(refreshToken: string) {
        return await this.tokenRepository.removeToken(refreshToken);
    }

    public async validateAccessToken(accessToken: string): Promise<TokenPayloadDto | null> {

        const secret = this.configService.get(EnumAuthSecrets.ACCESS_TOKEN);
        return await this.verifyToken(accessToken, secret, 'ACCESS');

    }

    public async validateRefreshToken(refreshToken: string): Promise<TokenPayloadDto | null> {
        const secret = this.configService.get(EnumAuthSecrets.REFRESH_TOKEN);
        return await this.verifyToken(refreshToken, secret, 'REFRESH');

    }
    private async verifyToken(token: string, secret: string, type: 'ACCESS' | 'REFRESH'): Promise<TokenPayloadDto> {
        try {
            return await this.jwtService.verifyAsync<TokenPayloadDto>(token, { secret });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException(
                    type === 'ACCESS'
                        ? EnumAuthErrorCode.ACCESS_TOKEN_EXPIRED
                        : EnumAuthErrorCode.REFRESH_TOKEN_EXPIRED
                );
            }

            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException(
                    type === 'ACCESS'
                        ? EnumAuthErrorCode.ACCESS_TOKEN_INVALID
                        : EnumAuthErrorCode.REFRESH_TOKEN_INVALID
                );
            }

            throw new UnauthorizedException(
                type === 'ACCESS'
                    ? EnumAuthErrorCode.ACCESS_TOKEN_ERROR
                    : EnumAuthErrorCode.REFRESH_TOKEN_ERROR
            );
        }
    }
}
