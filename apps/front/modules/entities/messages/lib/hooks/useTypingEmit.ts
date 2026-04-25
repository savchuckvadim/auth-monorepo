'use client';

import { useCallback, useEffect, useRef } from 'react';
import { connectMessagesSocket } from '@/modules/shared/lib/socket/messages-socket';
import { MessagesWsClientEvent } from '../const/messages-ws-events';

const STOP_TYPING_DELAY_MS = 2500;

interface UseTypingEmitParams {
    chatId: string | null | undefined;
    userId: string | null | undefined;
}

/**
 * Отправляет `message:typing` на бэк при активной печати в инпуте.
 *
 * - При каждом `notifyTyping()` гарантируем, что активен флаг `isTyping=true`
 *   (но шлём повторный emit только если предыдущий уже погасили).
 * - Через `STOP_TYPING_DELAY_MS` простоя сами шлём `isTyping=false`.
 * - При размонтировании/смене чата тоже гасим.
 */
export function useTypingEmit({ chatId, userId }: UseTypingEmitParams) {
    const isActiveRef = useRef(false);
    const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sendTypingState = useCallback(
        (isTyping: boolean) => {
            if (!chatId || !userId) return;
            try {
                const socket = connectMessagesSocket(userId);
                socket.emit(MessagesWsClientEvent.MESSAGE_TYPING, {
                    chatId,
                    isTyping,
                });
            } catch {
                // namespace could be not yet initialised — это не критично
            }
        },
        [chatId, userId],
    );

    const stopTypingNow = useCallback(() => {
        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
            stopTimerRef.current = null;
        }
        if (isActiveRef.current) {
            isActiveRef.current = false;
            sendTypingState(false);
        }
    }, [sendTypingState]);

    const notifyTyping = useCallback(() => {
        if (!chatId || !userId) return;
        if (!isActiveRef.current) {
            isActiveRef.current = true;
            sendTypingState(true);
        }
        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
        }
        stopTimerRef.current = setTimeout(() => {
            stopTypingNow();
        }, STOP_TYPING_DELAY_MS);
    }, [chatId, userId, sendTypingState, stopTypingNow]);

    useEffect(() => {
        // При смене чата / анмаунте гасим принудительно
        return () => {
            stopTypingNow();
        };
    }, [chatId, stopTypingNow]);

    return { notifyTyping, stopTyping: stopTypingNow };
}
