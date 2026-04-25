/**
 * Утилиты keyset-курсора.
 *
 * Курсор — это opaque base64url-строка `"<sortValue>|<id>"`. Пара
 * (sortValue, id) гарантирует уникальный порядок даже при одинаковых
 * значениях ключевого поля (например, два пользователя с одинаковым именем).
 *
 * Репозитории *не* должны парсить курсор вручную — только через `decodeCursor`
 * и `buildCompositeCursorWhere`, иначе легко рассинхронизировать формат.
 */

const CURSOR_SEPARATOR = '|';

export interface CompositeCursorParts {
    /** Значение ключевого поля сортировки, сериализованное строкой. Для дат — ISO-строка. */
    sortValue: string;
    /** Значение `id` записи, на которой «остановились». */
    id: string;
}

/** Сериализовать пару (sortValue, id) в opaque base64url-курсор. */
export function encodeCursor(parts: CompositeCursorParts): string {
    const raw = `${parts.sortValue}${CURSOR_SEPARATOR}${parts.id}`;
    return Buffer.from(raw, 'utf8').toString('base64url');
}

/**
 * Распарсить курсор. Возвращает `null`, если курсор битый / пустой — это
 * трактуется вызывающим кодом как «первая страница».
 */
export function decodeCursor(
    cursor: string | null | undefined,
): CompositeCursorParts | null {
    if (!cursor) {
        return null;
    }
    try {
        const raw = Buffer.from(cursor, 'base64url').toString('utf8');
        const separatorAt = raw.indexOf(CURSOR_SEPARATOR);
        if (separatorAt === -1) {
            return null;
        }
        const sortValue = raw.slice(0, separatorAt);
        const id = raw.slice(separatorAt + 1);
        if (!id) {
            return null;
        }
        return { sortValue, id };
    } catch {
        return null;
    }
}

export type SortOrder = 'asc' | 'desc';

export interface BuildCompositeCursorWhereOptions {
    /** Имя поля сортировки на сущности (`'name'`, `'createdAt'`, …). */
    sortField: string;
    /** Значение ключевого поля из курсора, приведённое к нужному типу Prisma. */
    sortValue: string | Date | number;
    /** id записи, на которой остановились. */
    id: string;
    /** Порядок сортировки списка. */
    order: SortOrder;
}

/**
 * Построить Prisma-`where`-фрагмент для keyset-перехода. Возвращаемый объект
 * нужно `spread`-нуть в итоговый `where`:
 *
 *     const cursorWhere = buildCompositeCursorWhere({
 *         sortField: 'name',
 *         sortValue: cursor.sortValue,
 *         id: cursor.id,
 *         order: 'asc',
 *     });
 *     const users = await prisma.user.findMany({
 *         where: { ...otherConditions, ...cursorWhere },
 *         orderBy: [{ name: 'asc' }, { id: 'asc' }],
 *         take: limit + 1,
 *     });
 *
 * Семантика: для `asc` — вернуть записи «после» курсора, т.е.
 * `(sortField, id) > (sortValue, id)` в лексикографическом порядке.
 * Для `desc` — наоборот, «до» курсора: `(sortField, id) < (sortValue, id)`.
 */
export function buildCompositeCursorWhere(
    opts: BuildCompositeCursorWhereOptions,
): { OR: Array<Record<string, unknown>> } {
    const strictCmp: 'gt' | 'lt' = opts.order === 'asc' ? 'gt' : 'lt';
    return {
        OR: [
            { [opts.sortField]: { [strictCmp]: opts.sortValue } },
            {
                AND: [
                    { [opts.sortField]: opts.sortValue },
                    { id: { [strictCmp]: opts.id } },
                ],
            },
        ],
    };
}

/**
 * Хелпер: взять на 1 запись больше `limit` и вычислить `{items, nextCursor, hasNext}`.
 * Полезен в репозиториях, чтобы не дублировать «take + 1» логику.
 *
 * Требует функцию `getSortValue`, извлекающую значение ключевого поля из записи
 * в строковом виде (для даты — `.toISOString()`).
 */
export function buildCursorPage<TItem extends { id: string }>(
    rows: TItem[],
    limit: number,
    getSortValue: (row: TItem) => string,
): { items: TItem[]; nextCursor: string | null; hasNext: boolean } {
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];
    const nextCursor =
        hasNext && last
            ? encodeCursor({ sortValue: getSortValue(last), id: last.id })
            : null;
    return { items, nextCursor, hasNext };
}
