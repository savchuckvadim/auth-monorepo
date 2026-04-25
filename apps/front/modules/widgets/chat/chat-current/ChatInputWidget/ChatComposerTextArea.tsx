import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import { MAX_CHAT_MESSAGE_LENGTH } from '@/modules/entities/messages';
import {
    CHAT_INPUT_TEXTAREA_MAX_PX,
    CHAT_INPUT_TEXTAREA_MIN_PX,
} from '../lib/hooks';

type ChatComposerTextAreaProps = {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    value: string;
    isEditMode: boolean;
    onChange: (value: string) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function ChatComposerTextArea({
    textareaRef,
    value,
    isEditMode,
    onChange,
    onKeyDown,
}: ChatComposerTextAreaProps) {
    return (
        <Textarea
            ref={textareaRef}
            placeholder={
                isEditMode
                    ? 'Отредактируйте сообщение…'
                    : 'Введите сообщение...'
            }
            value={value}
            maxLength={MAX_CHAT_MESSAGE_LENGTH}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className={cn(
                'min-w-0 flex-1 resize-none break-words py-2 leading-5 [overflow-wrap:anywhere]',
            )}
            style={{
                minHeight: CHAT_INPUT_TEXTAREA_MIN_PX,
                maxHeight: CHAT_INPUT_TEXTAREA_MAX_PX,
            }}
            rows={1}
        />
    );
}
