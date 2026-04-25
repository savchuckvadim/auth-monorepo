import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * База для «страничных» DTO с keyset-пагинацией.
 *
 * Конкретные списки наследуются и добавляют поле `items` со своим типом, например:
 *
 *     export class PaginatedUsersDto extends CursorPageMetaDto {
 *         @ApiProperty({ type: [UserDto] })
 *         items: UserDto[];
 *     }
 *
 * Абстрактный паттерн выбран намеренно, чтобы orval-генератор увидел конкретные
 * типы `items` в каждой сущности (generic-обёртки в NestJS/Swagger требуют
 * обвязок через `ApiExtraModels` и хуже читаются на клиенте).
 */
export abstract class CursorPageMetaDto {
    @ApiProperty({
        description:
            'Opaque base64url-курсор для следующей страницы. `null`, если страниц больше нет.',
        type: String,
        nullable: true,
        required: false,
        example: 'Sm9objp1c2VyLWlkLTEyMw',
    })
    @IsOptional()
    @IsString()
    nextCursor: string | null;

    @ApiProperty({
        description:
            'Есть ли следующая страница. Если `true` — для следующего запроса используйте `nextCursor`.',
        example: true,
    })
    @IsBoolean()
    hasNext: boolean;
}
