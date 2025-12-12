import { IsPassword } from "@/core/decorators/dto/password.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsString } from "class-validator";
import { Token, User, user_roles } from "generated/prisma";




export class CreateUserDto {
    @ApiProperty({ description: 'Email', example: 'test@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password', example: 'test123456!' })
    @IsPassword()
    password: string;

    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsString()
    name: string;


}



export class UserDto implements Partial<User> {
    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.activationLink = user.activationLink;
    }

    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Email', example: 'test@test.com' })
    @IsEmail()
    email: string;


    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Activation Link', example: 'https://example.com/activate' })
    @IsString()
    activationLink: string;

}


