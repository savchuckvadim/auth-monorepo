export const getPostDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Разница в секундах
    const diffSeconds = Math.floor(diff / 1000);

    // Если меньше минуты - "now"
    if (diffSeconds < 60) {
        return 'now';
    }

    // Разница в минутах
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes === 1) {
        return '1 minute ago';
    }
    if (diffMinutes === 5) {
        return '5 minutes ago';
    }
    if (diffMinutes === 30) {
        return '30 minutes ago';
    }
    if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    }

    // Разница в часах
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) {
        return '1 hour ago';
    }
    if (diffHours === 6) {
        return '6 hours ago';
    }
    if (diffHours < 24) {
        return `${diffHours} hours ago`;
    }

    // Разница в днях
    const diffDays = Math.floor(diffHours / 24);

    // Разница в месяцах (приблизительно, 30 дней = 1 месяц)
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) {
        return '1 month ago';
    }
    if (diffMonths === 3) {
        return '3 months ago';
    }
    if (diffMonths === 6) {
        return 'half year ago';
    }
    if (diffMonths < 12) {
        return `${diffMonths} months ago`;
    }

    // Разница в годах
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) {
        return '1 year ago';
    }

    return `${diffYears} years ago`;
}
