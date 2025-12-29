import { IsPassword } from "@/core/decorators/dto/password.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsString } from "class-validator";
import { Token, User, user_roles } from "generated/prisma";
import { UserWithFollowStatusType } from "./user.type";




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
    constructor(user: UserWithFollowStatusType) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.activationLink = user.activationLink;
        this.role = user.role;
        this.isAcivated = user.isAcivated;
        this.isFollowing = user.isFollowing || false;
        this.isFollower = user.isFollower || false;
        this.isFriend = user.isFriend || false;
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

    @ApiProperty({ description: 'Role', example: 'user' })
    @IsEnum(user_roles)
    role: user_roles;

    @ApiProperty({ description: 'Is Activated', example: true })
    @IsBoolean({ message: 'IsActivated must be a boolean' })
    isAcivated: boolean;


    @ApiProperty({ description: 'Is Following', example: true, type: Boolean })
    @IsBoolean({ message: 'IsFollowing must be a boolean' })
    isFollowing: boolean;


    @ApiProperty({ description: 'Is Follower', example: true, type: Boolean })
    @IsBoolean({ message: 'IsFollower must be a boolean' })
    isFollower: boolean;

    @ApiProperty({ description: 'Is Friend', example: true, type: Boolean })
    @IsBoolean({ message: 'IsFriend must be a boolean' })
    isFriend: boolean;

}


