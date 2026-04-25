import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageAttachment, MessageAttachmentKind } from 'generated/prisma';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Публичная форма `MessageAttachment` для клиента. */
export class MessageAttachmentDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiPropertyOptional({
        description:
            'Может быть null для только что загруженных attachment’ов, ещё не привязанных к message.',
        type: String,
    })
    messageId?: string;

    @ApiProperty({
        enum: MessageAttachmentKind,
        enumName: 'MessageAttachmentKind',
    })
    kind: MessageAttachmentKind;

    @ApiPropertyOptional({ type: String })
    url?: string;

    @ApiPropertyOptional({ type: String })
    name?: string;

    @ApiPropertyOptional({ type: Number })
    size?: number;

    @ApiPropertyOptional({ type: String })
    mimeType?: string;

    @ApiPropertyOptional({ type: Number })
    durationMs?: number;

    @ApiPropertyOptional({ type: Number })
    width?: number;

    @ApiPropertyOptional({ type: Number })
    height?: number;

    @ApiPropertyOptional({ type: String })
    thumbnailUrl?: string;

    @ApiPropertyOptional({
        description:
            'Сервер не типизирует жёстко: воронка хранит waveform / snapshot / прочее.',
        type: Object,
    })
    metadata?: Record<string, unknown>;

    @ApiPropertyOptional({ type: String })
    postId?: string;

    @ApiProperty({ type: Date })
    createdAt: Date;

    constructor(raw: MessageAttachment) {
        this.id = raw.id;
        this.messageId = raw.messageId ?? undefined;
        this.kind = raw.kind;
        this.url = raw.url ?? undefined;
        this.name = raw.name ?? undefined;
        this.size = raw.size ?? undefined;
        this.mimeType = raw.mimeType ?? undefined;
        this.durationMs = raw.durationMs ?? undefined;
        this.width = raw.width ?? undefined;
        this.height = raw.height ?? undefined;
        this.thumbnailUrl = raw.thumbnailUrl ?? undefined;
        this.metadata = (raw.metadata ?? undefined) as
            | Record<string, unknown>
            | undefined;
        this.postId = raw.postId ?? undefined;
        this.createdAt = raw.createdAt;
    }
}

/**
 * Inline-описание нового attachment при `POST /messages`.
 * Клиент может передать либо `id` (для уже загруженных через upload),
 * либо полный дескриптор (для POST_SHARE / FORWARD_SNAPSHOT — они без файла).
 */
export class MessageAttachmentInputDto {
    @ApiPropertyOptional({
        description:
            'ID заранее загруженного attachment’а (через `POST /messages/attachments/upload`).',
        type: String,
    })
    @IsOptional()
    @IsUUID('4')
    id?: string;

    @ApiPropertyOptional({
        enum: MessageAttachmentKind,
        enumName: 'MessageAttachmentKind',
    })
    @IsOptional()
    @IsEnum(MessageAttachmentKind)
    kind?: MessageAttachmentKind;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsUUID('4')
    postId?: string;

    @ApiPropertyOptional({
        description:
            'Для FORWARD_SNAPSHOT — снапшот исходника. Сервер дополнительно валидирует shape.',
        type: Object,
    })
    @IsOptional()
    metadata?: Record<string, unknown>;

    @ValidateIf((o: MessageAttachmentInputDto) => !o.id)
    @IsString()
    @MaxLength(500)
    @IsOptional()
    url?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    size?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    mimeType?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    durationMs?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    width?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    height?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    thumbnailUrl?: string;
}

/** Для `@ApiBody` на аплоаде — тип ответа (один attachment). */
export class MessageAttachmentUploadResponseDto {
    @ApiProperty({ type: () => MessageAttachmentDto })
    @ValidateNested()
    @Type(() => MessageAttachmentDto)
    attachment: MessageAttachmentDto;
}
