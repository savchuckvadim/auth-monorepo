import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokensDto {
    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    @ApiProperty({ description: 'Access Token', example: '43twrereg' })
    @IsString()
    accessToken: string;

    @ApiProperty({ description: 'Refresh Token', example: 'ergwrg3g' })
    @IsString()
    refreshToken: string;
}


export class TokenPayloadDto {
    @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    userId: string;
}
