import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenDto {
    @ApiProperty({ description: 'Room name', example: 'room1' })
    @IsString()
    @IsNotEmpty()
    roomName: string;

    @ApiProperty({ description: 'User id', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
