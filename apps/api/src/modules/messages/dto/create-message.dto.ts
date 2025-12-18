import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { MessageType } from 'generated/prisma';

export class CreateMessageDto {
    @IsUUID('4')
    chatId: string;

    @IsString()
    content: string;

    @IsEnum(MessageType)
    @IsOptional()
    type?: MessageType;

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsString()
    fileName?: string;

    @IsOptional()
    fileSize?: number;

    @IsOptional()
    @IsUUID('4')
    replyToId?: string;
}

