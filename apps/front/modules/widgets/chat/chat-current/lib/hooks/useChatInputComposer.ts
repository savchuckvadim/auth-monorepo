'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useIsMobile } from '@/modules/shared/lib/hooks/is-mobile.hook';

export const CHAT_INPUT_TEXTAREA_MIN_PX = 40;
export const CHAT_INPUT_TEXTAREA_MAX_PX = 120;

type UseChatInputComposerArgs = {
    messageText: string;
    onSendMessage: () => void;
    isPending: boolean;
};

export function useChatInputComposer({
    messageText,
    onSendMessage,
    isPending,
}: UseChatInputComposerArgs) {
    const isMobile = useIsMobile();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(
            Math.max(scrollHeight, CHAT_INPUT_TEXTAREA_MIN_PX),
            CHAT_INPUT_TEXTAREA_MAX_PX,
        );
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY =
            scrollHeight > CHAT_INPUT_TEXTAREA_MAX_PX ? 'auto' : 'hidden';
    }, [messageText]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${CHAT_INPUT_TEXTAREA_MIN_PX}px`;
        }
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (isMobile) return;
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (messageText.trim() && !isPending) {
                    onSendMessage();
                }
            }
        },
        [isMobile, isPending, messageText, onSendMessage],
    );

    return { textareaRef, handleKeyDown };
}
