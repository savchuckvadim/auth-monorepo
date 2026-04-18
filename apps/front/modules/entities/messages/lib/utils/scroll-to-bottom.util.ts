/**
 * Скролл к последнему сообщению. По умолчанию `behavior: 'auto'` — без анимации «вжух»
 * при открытии чата; для живого донабора можно передать `'smooth'`.
 */
export const scrollToBottom = (
    messagesEndRef: React.RefObject<HTMLDivElement | null>,
    behavior: ScrollBehavior = 'auto',
) => {
    if (!messagesEndRef.current) return;

    const scrollContainer = messagesEndRef.current.closest('.overflow-y-auto');

    if (scrollContainer) {
        const container = scrollContainer as HTMLElement;
        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    } else {
        messagesEndRef.current.scrollIntoView({
            behavior,
            block: 'nearest',
            inline: 'nearest',
        });
    }
};

