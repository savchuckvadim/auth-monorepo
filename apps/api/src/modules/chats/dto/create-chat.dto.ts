import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { ChatType } from 'generated/prisma';

export class CreateChatDto {
    @ApiProperty({ description: 'Type', example: 'PRIVATE' })
    @IsEnum(ChatType)
    type: ChatType;
    @ApiProperty({ description: 'Name', example: 'Test' })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty({ description: 'Description', example: 'Test' })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({ description: 'Avatar', example: 'https://example.com/avatar.jpg' })
    @IsArray()
    @IsUUID('4', { each: true })
    memberIds: string[];
}

