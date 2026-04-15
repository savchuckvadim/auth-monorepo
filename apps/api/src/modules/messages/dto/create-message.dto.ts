import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { MessageType } from 'generated/prisma';

export class CreateMessageDto {
    @ApiProperty({
        description: 'Chat ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID('4')
    chatId: string;

    @ApiProperty({
        description: 'Content',
        example: 'Hello, how are you?',
        type: 'string',
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'Type',
        example: 'TEXT',
        type: 'string',
        enum: MessageType,
        required: false,
        default: MessageType.TEXT,
    })
    @IsEnum(MessageType)
    @IsOptional()
    type?: MessageType;

    @ApiProperty({
        description: 'File URL',
        example: 'https://example.com/file.jpg',
        nullable: true,
        required: false,
        type: 'string',
    })
    @IsOptional()
    @IsString()
    fileUrl?: string;

    @ApiProperty({
        description: 'File Name',
        example: 'file.jpg',
        nullable: true,
        required: false,
        type: 'string',
    })
    @IsOptional()
    @IsString()
    fileName?: string;

    @ApiProperty({
        description: 'File Size',
        example: 1000,
        nullable: true,
        required: false,
        type: 'number',
    })
    @IsOptional()
    fileSize?: number;

    @ApiProperty({
        description: 'Reply To ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true,
        required: false,
        type: 'string',
    })
    @IsOptional()
    @IsUUID('4')
    replyToId?: string;
}
