import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    IsString,
    IsEnum,
    IsOptional,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { MessageType } from 'generated/prisma';

export class CreateMessageDto {
    @ApiProperty({
        description: 'Chat ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4')
    chatId: string;

    @ApiProperty({
        description: 'Content',
        example: 'Hello, how are you?',
        type: String,
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'Type',
        example: 'TEXT',
        enum: MessageType,
        type: String,
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
        type: String,
    })
    @IsOptional()
    @IsString()
    fileUrl?: string;

    @ApiProperty({
        description: 'File Name',
        example: 'file.jpg',
        nullable: true,
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    fileName?: string;

    @ApiProperty({
        description: 'File Size',
        example: 1000,
        nullable: true,
        required: false,
        type: Number,
    })
    @IsOptional()
    fileSize?: number;

    @ApiProperty({
        description: 'Reply To ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true,
        required: false,
        type: String,
    })
    @IsOptional()
    @IsUUID('4')
    replyToId?: string;

    @ApiProperty({
        description:
            'Signal E2EE: true when content is ciphertext (required for chats with encryptionMode=SIGNAL)',
        required: false,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    isEncrypted?: boolean;

    @ApiProperty({
        description:
            'Target device row id (server Device.id) for multi-device fan-out',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsUUID('4')
    toDeviceId?: string;

    @ApiProperty({
        description:
            'Your device row id (Device.id) so recipients can open the correct Signal session',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsUUID('4')
    senderDeviceId?: string;

    @ApiProperty({
        description: 'Libsignal message type label (e.g. WHISPER, PREKEY)',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    signalMessageType?: string;

    @ApiProperty({
        description: 'Signal registration id (metadata only)',
        required: false,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    registrationId?: number;
}
