import { IsPassword } from '@/core/decorators/dto/password.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Запрос на начало reset-флоу. Ответ всегда 200 {success: true} независимо от
 * того, существует ли пользователь с таким email — чтобы не раскрывать
 * наличие учётной записи (user enumeration защита).
 */
export class ForgotPasswordDto {
    @ApiProperty({
        description:
            'Email пользователя, которому нужно выслать ссылку для сброса пароля',
        example: 'user@example.com',
        format: 'email',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

/**
 * Завершение reset-флоу. Токен одноразовый — после успешного ответа он
 * помечается `consumedAt` и больше не пройдёт проверку. Все активные
 * refresh-сессии пользователя ревокаются.
 */
export class ResetPasswordDto {
    @ApiProperty({
        description:
            'Одноразовый токен из письма (base64url). Сервер сравнивает SHA-256 хеш с тем, что лежит в БД',
        example: 'Q0zX1hYjA5nRtUgpJqK2mFb8v3sRrW4Zc9aLnB6oPxE',
        minLength: 32,
        maxLength: 128,
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'Новый пароль (длина 8–32 символа)',
        example: 'NewStrongPass123!',
        minLength: 8,
        maxLength: 32,
    })
    @IsPassword()
    password: string;
}

/**
 * Смена пароля авторизованным пользователем. Требует подтверждения текущего пароля.
 * Все сессии пользователя кроме текущей ревокаются (зависит от реализации контроллера).
 */
export class ChangePasswordDto {
    @ApiProperty({
        description: 'Текущий пароль пользователя (для подтверждения личности)',
        example: 'OldPassword123!',
        minLength: 8,
        maxLength: 32,
    })
    @IsPassword()
    oldPassword: string;

    @ApiProperty({
        description: 'Новый пароль (длина 8–32 символа)',
        example: 'NewStrongPass456!',
        minLength: 8,
        maxLength: 32,
    })
    @IsPassword()
    newPassword: string;
}

/**
 * Мобильная версия смены пароля. От web отличается тем, что клиент сам хранит
 * refreshToken в SecureStore и может передать его, чтобы эта сессия пережила ревок.
 */
export class ChangePasswordMobileDto {
    @ApiProperty({
        description: 'Текущий пароль пользователя',
        example: 'OldPassword123!',
        minLength: 8,
        maxLength: 32,
    })
    @IsPassword()
    oldPassword: string;

    @ApiProperty({
        description: 'Новый пароль (длина 8–32 символа)',
        example: 'NewStrongPass456!',
        minLength: 8,
        maxLength: 32,
    })
    @IsPassword()
    newPassword: string;

    @ApiProperty({
        description:
            'Текущий refreshToken из SecureStore. Если передан — эта сессия останется жить после смены пароля, остальные будут ревокнуты. Если не передан — ревокнутся ВСЕ сессии.',
        example: 'eyJhbGciOi...',
        required: false,
        nullable: true,
        type: String,
    })
    @IsOptional()
    @IsString()
    refreshToken?: string | null;
}

/**
 * Единый success-ответ для password-flow эндпоинтов. Используется как для
 * `forgot-password` (который намеренно отвечает одинаково при любом email),
 * так и для `reset-password` / `change-password`.
 */
export class PasswordActionResultDto {
    @ApiProperty({
        description: 'Операция выполнена успешно',
        example: true,
    })
    success: boolean;
}
