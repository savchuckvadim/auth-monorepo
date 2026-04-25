import type { Message } from '../../lib/types/messages.types';

export interface MessageItemProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
    /** ID текущего пользователя — нужен для CALL_EVENT direction. */
    currentUserId?: string;
    /** Повторить отправку после ошибки (temp id из outbox). */
    onRetryFailed?: (tempMessageId: string) => void;
}
