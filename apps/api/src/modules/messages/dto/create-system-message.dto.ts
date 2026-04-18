import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSystemMessageDto {
    @ApiProperty({ description: 'Chat ID', example: 'uuid' })
    @IsString()
    chatId: string;

    @ApiProperty({
        description: 'System line shown in the thread (policy, service notice)',
        example: 'Пользователь включил удаление сообщений через 5 минут',
    })
    @IsString()
    @MinLength(1)
    content: string;
}
