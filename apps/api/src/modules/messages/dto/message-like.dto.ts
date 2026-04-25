import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/modules/user';

/**
 * Ответ на `POST /messages/:id/like`. Всегда содержит финальное состояние:
 * клиент может подтвердить оптимистичное обновление и скорректировать счётчик.
 */
export class ToggleMessageLikeResponseDto {
    @ApiProperty({
        description: 'ID сообщения',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    messageId: string;

    @ApiProperty({
        description:
            'ID чата, которому принадлежит сообщение (для WS-раутинга).',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    chatId: string;

    @ApiProperty({
        description: 'Текущее количество лайков (денормализованный счётчик).',
        example: 3,
        type: Number,
    })
    likesCount: number;

    @ApiProperty({
        description:
            'Лайкнул ли текущий пользователь это сообщение после операции.',
        example: true,
        type: Boolean,
    })
    isLiked: boolean;
}

/** Запись о лайке сообщения (пользователь + момент). */
export class MessageLikeDto {
    @ApiProperty({ description: 'ID лайка', type: String })
    id: string;

    @ApiProperty({ description: 'ID сообщения', type: String })
    messageId: string;

    @ApiProperty({ description: 'Когда поставлен лайк', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Пользователь', type: () => UserDto })
    user: Pick<UserDto, 'id' | 'name' | 'email'>;
}
