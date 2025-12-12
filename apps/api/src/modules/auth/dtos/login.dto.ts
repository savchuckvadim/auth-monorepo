import { IsPassword } from "@/core/decorators/dto/password.decorator";
import { TokensDto } from "@/modules/token/token.dto";
import { UserDto } from "@/modules/user";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'Email', example: 'test@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password', example: 'test123456!' })
    @IsPassword()
    password: string;

}



export class AuthenticatedUserDto {
    @ApiProperty({ description: 'User', type: UserDto })
    user: UserDto;
    @ApiProperty({ description: 'Tokens', type: TokensDto })
    tokens: TokensDto;


}
