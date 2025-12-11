import { IsPassword } from "@/core/decorators/dto/password.decorator";
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
