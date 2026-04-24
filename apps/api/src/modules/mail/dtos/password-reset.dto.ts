import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

/**
 * Внутренняя DTO для джобы отправки письма со сбросом пароля.
 * Не экспортируется как контроллерный DTO — клиентам это видеть не надо,
 * но `ApiProperty` проставлены на случай, если кто-то решит посмотреть
 * контракт джобы через swagger-инспектор.
 */
export class SendMailPasswordResetDto {
    @ApiProperty({
        description: 'Email получателя',
        example: 'user@example.com',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Имя пользователя (для приветствия в письме)',
        example: 'Alice',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Полная ссылка для сброса пароля (с токеном в query)',
        example: 'https://example.com/auth/reset-password?token=abc123',
    })
    @IsString()
    @IsNotEmpty()
    resetLink: string;

    @ApiProperty({
        description:
            'Сколько минут живёт ссылка — подставляется в текст письма',
        example: 30,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    expiresInMinutes: number;
}
