import { Send } from 'lucide-react';
import { AppButton } from '@/modules/shared';

type ChatSendButtonProps = {
    isEditMode: boolean;
    disabled: boolean;
    onClick: () => void;
};

export function ChatSendButton({
    isEditMode,
    disabled,
    onClick,
}: ChatSendButtonProps) {
    return (
        <AppButton
            type="button"
            appSize="md"
            className="mb-0 h-10 w-10 shrink-0 p-0"
            disabled={disabled}
            onClick={onClick}
            aria-label={isEditMode ? 'Сохранить' : 'Отправить'}
        >
            <Send className="h-4 w-4" />
        </AppButton>
    );
}
