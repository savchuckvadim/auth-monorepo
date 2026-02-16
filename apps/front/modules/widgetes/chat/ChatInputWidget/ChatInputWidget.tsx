'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Send } from 'lucide-react';
import { useIsMobile } from '@/modules/shared/lib/hooks/is-mobile.hook';
import { cn } from '@workspace/ui/lib/utils';

interface ChatInputWidgetProps {
    messageText: string;
    onMessageTextChange: (text: string) => void;
    onSendMessage: () => void;
    isPending: boolean;
}

const MIN_TEXTAREA_HEIGHT = 40; // Минимальная высота (одна строка)
const MAX_TEXTAREA_HEIGHT = 120; // Максимальная высота (примерно 3-4 строки)

export const ChatInputWidget = ({
    messageText,
    onMessageTextChange,
    onSendMessage,
    isPending,
}: ChatInputWidgetProps) => {
    const isMobile = useIsMobile();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Авто-расширение textarea при вводе текста
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Сбрасываем высоту для корректного расчета scrollHeight
        textarea.style.height = 'auto';

        // Вычисляем новую высоту
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(
            Math.max(scrollHeight, MIN_TEXTAREA_HEIGHT),
            MAX_TEXTAREA_HEIGHT
        );

        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
    }, [messageText]);

    // Устанавливаем начальную высоту при монтировании
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isMobile) {
            // На мобильных: Enter всегда создает новую строку
            // Отправка только через кнопку
            return;
        }

        // На десктопе: Enter отправляет, Shift+Enter создает новую строку
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.trim() && !isPending) {
                onSendMessage();
            }
        }
    };

    return (
        <div className="border-t p-4 bg-card flex-shrink-0">
            <div className="flex gap-2 items-end">
                <Textarea
                    ref={textareaRef}
                    placeholder="Введите сообщение..."
                    value={messageText}
                    onChange={(e) => onMessageTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "flex-1 resize-none",
                        "min-h-[40px] max-h-[120px]",
                        "leading-5 py-2"
                    )}
                    rows={1}
                />
                <Button
                    onClick={onSendMessage}
                    disabled={!messageText.trim() || isPending}
                    className="flex-shrink-0 h-[40px] mb-0"
                    size="icon"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

