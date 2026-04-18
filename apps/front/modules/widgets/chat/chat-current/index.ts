export { CurrentChatWidget, type CurrentChatWidgetProps } from './CurrentChatWidget';
export { ChatInputWidget } from './ChatInputWidget';
export {
    useCurrentChatSession,
    useChatInputComposer,
    CHAT_INPUT_TEXTAREA_MIN_PX,
    CHAT_INPUT_TEXTAREA_MAX_PX,
} from './lib/hooks';
export { CurrentChatHeader, type CurrentChatHeaderProps } from './components/CurrentChatHeader';
export {
    CurrentChatMessages,
    type CurrentChatMessagesProps,
} from './components/CurrentChatMessages';
/** @deprecated Имя {@link CurrentChatMessages} */
export { CurrentChatMessages as CurrentDialogMessages } from './components/CurrentChatMessages';
export { NoChatSelectedPlaceholder } from './components/NoChatSelectedPlaceholder';
/** @deprecated Используйте {@link CurrentChatWidget} — то же окно переписки. */
export { CurrentChatWidget as ChatMessagesWidget } from './CurrentChatWidget';
export type { CurrentChatWidgetProps as ChatMessagesWidgetProps } from './CurrentChatWidget';
