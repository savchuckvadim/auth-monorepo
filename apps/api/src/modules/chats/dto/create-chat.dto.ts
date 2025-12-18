import { IsEnum, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { ChatType } from 'generated/prisma';

export class CreateChatDto {
    @IsEnum(ChatType)
    type: ChatType;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    memberIds: string[];
}

