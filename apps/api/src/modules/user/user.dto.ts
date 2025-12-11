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
    @ApiProperty({ description: 'ID', example: '1' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Email', example: 'test@test.com' })
    @IsEmail()
    email: string;


    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Role', example: user_roles.user })
    @IsEnum(user_roles)
    role: user_roles;

    @ApiProperty({ description: 'Created At', example: new Date() })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Updated At', example: new Date() })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ description: 'Activation Link', example: 'test@test.com' })
    @IsString()
    activationLink?: string;

    @ApiProperty({ description: 'Refresh Token', example: 'ergwrg3g' })
    @IsString()
    refreshToken: string;

    @ApiProperty({ description: 'Access Token', example: '43twrereg' })
    @IsString()
    accessToken: string;
    constructor(user: User, accessToken: string, refreshToken: string) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.activationLink = user.activationLink;
    }
}
