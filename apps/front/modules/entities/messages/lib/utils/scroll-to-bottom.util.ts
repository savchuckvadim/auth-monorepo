/**
 * Скролл к последнему сообщению. По умолчанию `behavior: 'auto'` — без анимации «вжух»
 * при открытии чата; для живого донабора можно передать `'smooth'`.
 */
export const scrollToBottom = (
    messagesEndRef: React.RefObject<HTMLDivElement | null>,
    behavior: ScrollBehavior = 'auto',
) => {
    if (!messagesEndRef.current) return;

    const scrollContainer =
        (messagesEndRef.current.closest(
            '[data-messages-scroll-root]',
        ) as HTMLElement | null) ??
        (messagesEndRef.current.closest('.overflow-y-auto') as HTMLElement | null);

    if (scrollContainer) {
        scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
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

/**
 * После вставки DOM (картинки, шрифты) высота контейнера может измениться — один rAF не всегда хватает.
 */
export const scrollToBottomDeferred = (
    messagesEndRef: React.RefObject<HTMLDivElement | null>,
    behavior: ScrollBehavior = 'auto',
) => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToBottom(messagesEndRef, behavior);
            queueMicrotask(() => scrollToBottom(messagesEndRef, behavior));
        });
    });
};
