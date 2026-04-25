import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MessageAttachmentKind } from 'generated/prisma';
import { UPLOADABLE_MESSAGE_ATTACHMENT_KINDS } from '../type/message-attachment-upload.type';

export class UploadMessageAttachmentFormDto {
    @ApiProperty({
        enum: UPLOADABLE_MESSAGE_ATTACHMENT_KINDS,
        enumName: 'UploadableMessageAttachmentKind',
    })
    @IsEnum(MessageAttachmentKind)
    kind: MessageAttachmentKind;

    /** Длительность в мс — для VOICE/AUDIO/VIDEO/CIRCLE. */
    @ApiPropertyOptional({ type: Number, maximum: 10 * 60 * 1000, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(10 * 60 * 1000)
    durationMs?: number;

    /** Peaks waveform'а 0..1, JSON-строкой в form-data. */
    @ApiPropertyOptional({
        type: String,
        description: 'JSON-массив пиков 0..1',
    })
    @IsOptional()
    @IsString()
    waveform?: string;

    @ApiPropertyOptional({ type: Number, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    width?: number;

    @ApiPropertyOptional({ type: Number, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    height?: number;
}
