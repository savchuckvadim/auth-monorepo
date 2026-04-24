import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { SaveTokenInput, TokenRepository } from './token.repository';
import { TokenPayloadDto, TokensDto } from './token.dto';
import {
    AUTH_DEFAULT_TTL,
    EnumAuthErrorCode,
    EnumAuthSecrets,
    EnumAuthTtlEnv,
} from './token.type';
import { parseDurationToMs } from '@/lib/utils/duration.util';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenRepository: TokenRepository,
    ) {}

    public generateTokens(payload: TokenPayloadDto): TokensDto {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    private generateAccessToken(payload: TokenPayloadDto) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get(EnumAuthSecrets.ACCESS_TOKEN),
            expiresIn: Math.floor(this.getAccessTtlMs() / 1000),
        });
    }

    private generateRefreshToken(payload: TokenPayloadDto) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get(EnumAuthSecrets.REFRESH_TOKEN),
            expiresIn: Math.floor(this.getRefreshTtlMs() / 1000),
        });
    }

    public getAccessTtl(): string {
        return (
            this.configService.get<string>(EnumAuthTtlEnv.ACCESS) ??
            AUTH_DEFAULT_TTL.ACCESS
        );
    }

    public getRefreshTtl(): string {
        return (
            this.configService.get<string>(EnumAuthTtlEnv.REFRESH) ??
            AUTH_DEFAULT_TTL.REFRESH
        );
    }

    public getAccessTtlMs(): number {
        return parseDurationToMs(
            this.getAccessTtl(),
            parseDurationToMs(AUTH_DEFAULT_TTL.ACCESS),
        );
    }

    public getRefreshTtlMs(): number {
        return parseDurationToMs(
            this.getRefreshTtl(),
            parseDurationToMs(AUTH_DEFAULT_TTL.REFRESH),
        );
    }

    public getRefreshExpiresAt(from: Date = new Date()): Date {
        return new Date(from.getTime() + this.getRefreshTtlMs());
    }

    public async saveToken(input: SaveTokenInput) {
        return await this.tokenRepository.saveToken(input);
    }

    public async findTokenByRefreshToken(refreshToken: string) {
        return await this.tokenRepository.findTokenByRefreshToken(refreshToken);
    }

    public async findTokensByUserId(userId: string) {
        return await this.tokenRepository.findTokensByUserId(userId);
    }

    public async removeToken(refreshToken: string) {
        return await this.tokenRepository.removeToken(refreshToken);
    }

    public async claimRefreshToken(refreshToken: string) {
        return await this.tokenRepository.claimRefreshToken(refreshToken);
    }

    public async removeAllUserTokens(userId: string) {
        return await this.tokenRepository.removeAllUserTokens(userId);
    }

    public async removeTokenByIdForUser(id: string, userId: string) {
        return await this.tokenRepository.removeTokenByIdForUser(id, userId);
    }

    public async removeAllUserTokensExceptRefreshToken(
        userId: string,
        exceptRefreshToken: string | null | undefined,
    ) {
        return await this.tokenRepository.removeAllUserTokensExceptRefreshToken(
            userId,
            exceptRefreshToken,
        );
    }

    public async removeExpiredTokens(batchSize?: number) {
        return await this.tokenRepository.removeExpiredTokens(batchSize);
    }

    public async validateAccessToken(
        accessToken: string,
    ): Promise<TokenPayloadDto | null> {
        const secret = this.configService.getOrThrow<string>(
            EnumAuthSecrets.ACCESS_TOKEN,
        );
        return await this.verifyToken(accessToken, secret, 'ACCESS');
    }

    public async validateRefreshToken(
        refreshToken: string,
    ): Promise<TokenPayloadDto | null> {
        const secret = this.configService.getOrThrow<string>(
            EnumAuthSecrets.REFRESH_TOKEN,
        );
        return await this.verifyToken(refreshToken, secret, 'REFRESH');
    }

    private async verifyToken(
        token: string,
        secret: string,
        type: 'ACCESS' | 'REFRESH',
    ): Promise<TokenPayloadDto> {
        try {
            return await this.jwtService.verifyAsync<TokenPayloadDto>(token, {
                secret,
            });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException(
                    type === 'ACCESS'
                        ? EnumAuthErrorCode.ACCESS_TOKEN_EXPIRED
                        : EnumAuthErrorCode.REFRESH_TOKEN_EXPIRED,
                );
            }

            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException(
                    type === 'ACCESS'
                        ? EnumAuthErrorCode.ACCESS_TOKEN_INVALID
                        : EnumAuthErrorCode.REFRESH_TOKEN_INVALID,
                );
            }

            throw new UnauthorizedException(
                type === 'ACCESS'
                    ? EnumAuthErrorCode.ACCESS_TOKEN_ERROR
                    : EnumAuthErrorCode.REFRESH_TOKEN_ERROR,
            );
        }
    }
}
