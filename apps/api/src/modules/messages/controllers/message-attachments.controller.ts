import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';
import { S3Service } from '@/core/s3';
import { MessagesRepository } from '../repositories/messages.repository';
import { MessageAttachmentDto, UploadMessageAttachmentFormDto } from '../dto';
import {
    isUploadableMessageAttachmentKind,
    MAX_BYTES_BY_MESSAGE_ATTACHMENT_KIND,
    UPLOADABLE_MESSAGE_ATTACHMENT_KINDS,
} from '../type/message-attachment-upload.type';

@Controller('messages/attachments')
@UseGuards(AccessTokenGuard)
@ApiTags('Messages')
export class MessageAttachmentsController {
    constructor(
        private readonly s3Service: S3Service,
        private readonly messagesRepository: MessagesRepository,
    ) {}

    @ApiOperation({
        summary:
            'Upload a message attachment (orphan until attached to a message)',
        description:
            'Возвращает `MessageAttachmentDto`. Клиент передаст `attachment.id` в `CreateMessageDto.attachmentIds` при отправке сообщения. Orphan-ы старше 1 часа подчищаются кроном.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'kind'],
            properties: {
                file: { type: 'string', format: 'binary' },
                kind: {
                    type: 'string',
                    enum: UPLOADABLE_MESSAGE_ATTACHMENT_KINDS as unknown as string[],
                },
                durationMs: { type: 'integer' },
                waveform: {
                    type: 'string',
                    description: 'JSON-массив пиков 0..1',
                },
                width: { type: 'integer' },
                height: { type: 'integer' },
            },
        },
    })
    @ApiOkResponse({ type: MessageAttachmentDto })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @CurrentUser() user: TokenPayloadDto,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UploadMessageAttachmentFormDto,
    ): Promise<MessageAttachmentDto> {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const kind = body.kind;
        if (!isUploadableMessageAttachmentKind(kind)) {
            throw new BadRequestException(
                `Kind ${kind} is not uploadable (POST_SHARE/FORWARD_SNAPSHOT go inline)`,
            );
        }

        const limit = MAX_BYTES_BY_MESSAGE_ATTACHMENT_KIND[kind];
        if (file.size > limit) {
            throw new BadRequestException(
                `File too large: ${file.size} bytes > ${limit} limit for ${kind}`,
            );
        }

        const { url } = await this.s3Service.uploadMessageMedia(
            file,
            user.userId,
            kind,
        );

        let waveformParsed: number[] | undefined;
        if (body.waveform) {
            try {
                const parsed: unknown = JSON.parse(body.waveform);
                if (Array.isArray(parsed)) {
                    waveformParsed = parsed
                        .map(v => (typeof v === 'number' ? v : Number(v)))
                        .filter(v => Number.isFinite(v))
                        .map(v => Math.max(0, Math.min(1, v)));
                }
            } catch {
                throw new BadRequestException('waveform must be JSON array');
            }
        }

        const metadata =
            waveformParsed && waveformParsed.length > 0
                ? { waveform: waveformParsed }
                : undefined;

        const attachment =
            await this.messagesRepository.createDetachedAttachment({
                uploaderId: user.userId,
                kind,
                url,
                name: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                durationMs: body.durationMs,
                width: body.width,
                height: body.height,
                metadata,
            });

        return new MessageAttachmentDto(attachment);
    }
}
