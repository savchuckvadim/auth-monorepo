'use client';

import { Textarea } from '@workspace/ui/components/textarea';
import { Send } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { MAX_CHAT_MESSAGE_LENGTH } from '@/modules/entities/messages';
import { AppButton } from '@/modules/shared';
import {
    CHAT_INPUT_TEXTAREA_MAX_PX,
    CHAT_INPUT_TEXTAREA_MIN_PX,
    useChatInputComposer,
} from '../lib/hooks';

type ChatInputWidgetProps = {
    messageText: string;
    onMessageTextChange: (text: string) => void;
    onSendMessage: () => void;
    isPending: boolean;
};

export function ChatInputWidget({
    messageText,
    onMessageTextChange,
    onSendMessage,
    isPending,
}: ChatInputWidgetProps) {
    const { textareaRef, handleKeyDown } = useChatInputComposer({
        messageText,
        onSendMessage,
        isPending,
    });

    return (
        <div className="flex-shrink-0 border-t bg-card p-4">
            <div className="flex items-end gap-2">
                <Textarea
                    ref={textareaRef}
                    placeholder="Введите сообщение..."
                    value={messageText}
                    maxLength={MAX_CHAT_MESSAGE_LENGTH}
                    onChange={(e) => {
                        const v = e.target.value;
                        onMessageTextChange(
                            v.length > MAX_CHAT_MESSAGE_LENGTH
                                ? v.slice(0, MAX_CHAT_MESSAGE_LENGTH)
                                : v,
                        );
                    }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'min-w-0 flex-1 resize-none break-words py-2 leading-5 [overflow-wrap:anywhere]',
                    )}
                    style={{
                        minHeight: CHAT_INPUT_TEXTAREA_MIN_PX,
                        maxHeight: CHAT_INPUT_TEXTAREA_MAX_PX,
                    }}
                    rows={1}
                />
                <AppButton
                    type="button"
                    appSize="md"
                    className="mb-0 h-10 w-10 shrink-0 p-0"
                    disabled={!messageText.trim() || isPending}
                    onClick={onSendMessage}
                    aria-label="Отправить"
                >
                    <Send className="h-4 w-4" />
                </AppButton>
            </div>
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {messageText.length}/{MAX_CHAT_MESSAGE_LENGTH}
            </p>
        </div>
    );
}
