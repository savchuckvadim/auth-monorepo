import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsString,
} from 'class-validator';

/**
 * Форвард нескольких сообщений в несколько чатов. Для каждой пары
 * (messageId × targetChatId) бэк создаёт новое сообщение-контейнер с
 * одним `MessageAttachment` kind=FORWARD_SNAPSHOT — снапшотом исходника.
 *
 * Ограничения: запрещено пересылать сообщения из SIGNAL-чатов (plaintext
 * в снапшоте — это утечка), а также в/из SIGNAL-целей — политика на уровне
 * сервиса.
 */
export class ForwardMessagesDto {
    @ApiProperty({ type: [String], description: 'IDs сообщений-источников' })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    messageIds: string[];

    @ApiProperty({ type: [String], description: 'IDs целевых чатов' })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    targetChatIds: string[];
}
