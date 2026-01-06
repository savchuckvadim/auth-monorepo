import { formatRelativeDate } from "@/modules/shared";

/**
 * Форматирует дату поста в относительный формат
 * @deprecated Используйте formatRelativeDate из @/modules/shared напрямую
 */
export const getPostDate = (dateString: string | Date): string => {
    return formatRelativeDate(dateString);
}
