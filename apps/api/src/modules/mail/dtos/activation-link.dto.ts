import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendMailActivationLinkDto {
    @ApiProperty({ description: 'Email', example: 'test@example.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Activation Link', example: 'https://example.com/activation-link' })
    @IsString()
    @IsNotEmpty()
    activationLink: string;
}
