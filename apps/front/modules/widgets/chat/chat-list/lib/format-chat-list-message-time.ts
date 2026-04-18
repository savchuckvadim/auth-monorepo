/** Relative time label for chat list previews (messenger-style). */
export function formatChatListMessageTime(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.floor(
        (startOfToday.getTime() - startOfMsg.getTime()) /
            (24 * 60 * 60 * 1000),
    );

    if (diffDays === 0) {
        return d.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) {
        return d.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year:
            d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}
