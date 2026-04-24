import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * Одна активная refresh-сессия пользователя. Соответствует строке в таблице `tokens`
 * с точки зрения наблюдателя — без самого refresh-токена (его нельзя отдавать клиенту).
 */
export class SessionDto {
    @ApiProperty({
        description: 'ID сессии (строка `tokens.id`)',
        example: '3fbe2a6a-1234-4a3b-9c7e-1234567890ab',
    })
    @IsString()
    id: string;

    @ApiPropertyOptional({
        description:
            'Стабильный идентификатор устройства, отправленный клиентом в заголовке `x-device-id` при логине/refresh',
        example: 'android-30-0f7e8e1d-1d2a-4b6a-9d8f-aa11bb22cc33',
        nullable: true,
        type: String,
    })
    @IsOptional()
    @IsString()
    deviceId: string | null;

    @ApiPropertyOptional({
        description: 'User-Agent клиента на момент логина',
        example:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        nullable: true,
        type: String,
    })
    @IsOptional()
    @IsString()
    userAgent: string | null;

    @ApiPropertyOptional({
        description:
            'IP клиента на момент логина (парсится с учётом `trust proxy`)',
        example: '95.84.19.214',
        nullable: true,
        type: String,
    })
    @IsOptional()
    @IsString()
    ipAddress: string | null;

    @ApiProperty({
        description: 'Когда сессия была создана',
        example: '2026-04-24T10:15:00.000Z',
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    createdAt: string;

    @ApiProperty({
        description: 'Когда сессия обновлялась (например, при refresh)',
        example: '2026-04-24T11:02:30.000Z',
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    updatedAt: string;

    @ApiProperty({
        description:
            'Когда refresh-токен этой сессии истечёт (DB-level TTL, используется в чистке и при refresh)',
        example: '2026-05-24T10:15:00.000Z',
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    expiresAt: string;

    @ApiProperty({
        description:
            'Та ли это сессия, из которой сделан текущий запрос. Для web определяется по refreshToken в cookie, для mobile — по заголовку `x-device-id`',
        example: true,
    })
    @IsBoolean()
    isCurrent: boolean;
}

/**
 * Результат массовых операций над сессиями (`DELETE /sessions`, logout-all).
 */
export class SessionsBulkResultDto {
    @ApiProperty({
        description: 'Сколько сессий было удалено в ходе операции',
        example: 3,
    })
    revoked: number;
}
