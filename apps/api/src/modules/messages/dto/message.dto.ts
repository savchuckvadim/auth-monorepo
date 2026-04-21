import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '@/modules/user';
import { Message, MessageType } from 'generated/prisma';

/** ORM row + includes used when building MessageDto (recursive replyTo). */
export type MessageDtoSource = Message & {
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    fromDevice?: { clientDeviceId: string } | null;
    replyTo?: MessageDtoSource;
    readBy?: string[];
};

export class MessageDto {
    @ApiProperty({ description: 'ID', example: '1', type: String })
    id: string;
    @ApiProperty({ description: 'Chat ID', example: '1', type: String })
    chatId: string;
    @ApiProperty({ description: 'Sender ID', example: '1', type: String })
    senderId: string;
    @ApiProperty({
        description: 'Content',
        example: 'Hello, how are you?',
        type: String,
    })
    content: string;
    @ApiProperty({
        description: 'Message kind',
        enum: MessageType,
        example: MessageType.TEXT,
        type: String,
    })
    type: MessageType;
    @ApiPropertyOptional({
        description: 'File URL',
        example: 'https://example.com/file.jpg',
        type: String,
    })
    fileUrl?: string;
    @ApiPropertyOptional({
        description: 'File Name',
        example: 'file.jpg',
        type: String,
    })
    fileName?: string;
    @ApiPropertyOptional({
        description: 'File Size',
        example: 1000,
        type: Number,
    })
    fileSize?: number;
    @ApiPropertyOptional({
        description: 'Reply To ID',
        example: '1',
        type: String,
    })
    replyToId?: string;
    @ApiPropertyOptional({
        description: 'Edited At',
        example: '2021-01-01',
        type: Date,
    })
    editedAt?: Date;
    @ApiPropertyOptional({
        description: 'Deleted At',
        example: '2021-01-01',
        type: Date,
    })
    deletedAt?: Date;
    @ApiProperty({
        description: 'Created At',
        example: '2021-01-01',
        type: Date,
    })
    createdAt: Date;
    @ApiProperty({
        description: 'Updated At',
        example: '2021-01-01',
        type: Date,
    })
    updatedAt: Date;
    @ApiPropertyOptional({
        description: 'Sender',
        example: { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
        type: () => UserDto,
    })
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    @ApiPropertyOptional({ type: () => MessageDto })
    replyTo?: MessageDto;
    @ApiPropertyOptional({ type: [String] })
    readBy?: string[];
    @ApiPropertyOptional({
        description: 'Is Encrypted',
        example: true,
        type: Boolean,
    })
    isEncrypted?: boolean;
    @ApiPropertyOptional({
        description: 'To Device ID',
        example: '1',
        type: String,
    })
    toDeviceId?: string;
    @ApiPropertyOptional({
        description: 'Signal Message Type',
        example: 'WHISPER',
        type: String,
    })
    signalMessageType?: string;
    @ApiPropertyOptional({
        description: 'Registration ID',
        example: 1,
        type: Number,
    })
    registrationId?: number;
    @ApiPropertyOptional({
        description: 'Sender Device ID',
        example: '1',
        type: String,
    })
    senderDeviceId?: string;
    /** Present when message was loaded with fromDevice; needed for E2EE session addressing. */
    @ApiPropertyOptional({
        description: 'Sender Client Device ID',
        example: '1',
        type: String,
    })
    senderClientDeviceId?: string;

    constructor(message: MessageDtoSource) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.senderId = message.senderId;
        this.content = message.content;
        this.type = message.type;
        this.fileUrl = message.fileUrl || undefined;
        this.fileName = message.fileName || undefined;
        this.fileSize = message.fileSize || undefined;
        this.replyToId = message.replyToId || undefined;
        this.editedAt = message.editedAt || undefined;
        this.deletedAt = message.deletedAt || undefined;
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;
        this.sender = message.sender;
        this.replyTo = message.replyTo
            ? new MessageDto(message.replyTo)
            : undefined;
        this.readBy = message.readBy || [];
        this.isEncrypted = message.isEncrypted;
        this.toDeviceId = message.toDeviceId || undefined;
        this.signalMessageType = message.signalMessageType || undefined;
        this.registrationId = message.registrationId ?? undefined;
        this.senderDeviceId = message.senderDeviceId || undefined;
        this.senderClientDeviceId =
            message.fromDevice?.clientDeviceId || undefined;
    }
}
