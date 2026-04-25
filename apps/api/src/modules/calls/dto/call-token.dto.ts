import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CallTokenDto {
    @ApiProperty({ description: 'Token', example: 'token123' })
    @IsString()
    @IsNotEmpty()
    token: string;
}
