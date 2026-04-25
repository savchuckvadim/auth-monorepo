import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

/** Must stay in sync with web/mobile `MAX_CHAT_MESSAGE_LENGTH`. */
const MAX_MESSAGE_CONTENT_LENGTH = 16_000;

export class UpdateMessageDto {
    @ApiProperty({
        description: 'New message content (plaintext or ciphertext for E2EE)',
        example: 'Edited message body',
        type: String,
        minLength: 1,
        maxLength: MAX_MESSAGE_CONTENT_LENGTH,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(MAX_MESSAGE_CONTENT_LENGTH)
    content: string;
}
