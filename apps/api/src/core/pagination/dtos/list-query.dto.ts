import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * База query-параметров для списковых endpoint'ов с keyset-пагинацией и поиском.
 *
 * Наследники добавляют свои поля фильтров (`filter`, `sort`, …) — в базе
 * только действительно переиспользуемые параметры, чтобы не тянуть в orval
 * лишние поля в каждый метод.
 */
export class ListQueryDto {
    @ApiPropertyOptional({
        description:
            'Opaque курсор, полученный из `nextCursor` предыдущего ответа. Пусто/отсутствует — первая страница.',
        type: String,
    })
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiPropertyOptional({
        description: 'Размер страницы. Не более 50.',
        minimum: 1,
        maximum: 50,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number;

    @ApiPropertyOptional({
        description:
            'Подстрочный поиск по ключевым полям сущности (`contains`). Пустая строка — без поиска.',
        type: String,
    })
    @IsOptional()
    @IsString()
    search?: string;
}
