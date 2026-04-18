import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { ChatEncryptionMode, ChatType } from 'generated/prisma';

export class CreateChatDto {
    @ApiProperty({
        description: 'Type',
        example: 'PRIVATE',
        enum: ChatType,
        type: String,
    })
    @IsEnum(ChatType)
    type: ChatType;

    @ApiProperty({
        description:
            'Messenger E2EE mode (orthogonal to type). Cannot be changed after create. ' +
            'A second private chat with the same peer but a different mode is a separate chat row (separate chatId).',
        enum: ChatEncryptionMode,
        required: false,
        type: String,
    })
    @IsOptional()
    @IsEnum(ChatEncryptionMode)
    encryptionMode?: ChatEncryptionMode;
    @ApiProperty({ description: 'Name', example: 'Test', type: String })
    @IsOptional()
    @IsString()
    name?: string;
    @ApiProperty({ description: 'Description', example: 'Test', type: String })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({
        description: 'Avatar',
        example: 'https://example.com/avatar.jpg',
        type: [String],
    })
    @IsArray()
    @IsUUID('4', { each: true })
    memberIds: string[];
}
