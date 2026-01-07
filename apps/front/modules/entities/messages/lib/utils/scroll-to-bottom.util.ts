/**
 * Утилита для скролла к последнему сообщению
 * На мобильных скроллит только контейнер сообщений, а не всю страницу
 */
export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement | null>) => {
    if (!messagesEndRef.current) return;

    // Находим скроллируемый контейнер сообщений
    const scrollContainer = messagesEndRef.current.closest('.overflow-y-auto');

    if (scrollContainer) {
        // Скроллим внутри контейнера, а не всю страницу
        const container = scrollContainer as HTMLElement;

        // Используем scrollTo для скролла внутри контейнера
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    } else {
        // Fallback: если контейнер не найден, используем стандартный scrollIntoView
        // но с block: 'nearest' чтобы не скроллить если элемент уже виден
        messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }
};

