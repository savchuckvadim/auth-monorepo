'use client';

import { useEffect, useState } from 'react';
import { connectMessagesSocket } from '@/modules/shared/lib/socket/messages-socket';
import { MessagesWsServerEvent } from '../const/messages-ws-events';

export interface TypingUser {
    userId: string;
    lastSeenAt: number;
}

interface UseTypingListenerParams {
    chatId: string | null | undefined;
    /** Собственный `userId` — исключается из результата. */
    currentUserId: string | null | undefined;
}

const TYPING_TIMEOUT_MS = 4000;

/**
 * Подписывается на `user:typing` для указанного чата. Возвращает массив
 * активно печатающих пользователей (без текущего).
 *
 * Мы чистим список по таймауту, если от пользователя давно не приходил
 * `isTyping=true` — на случай, если `false` потерялся.
 */
export function useTypingListener({ chatId, currentUserId }: UseTypingListenerParams) {
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    useEffect(() => {
        if (!chatId || !currentUserId) {
            setTypingUsers([]);
            return;
        }

        const socket = connectMessagesSocket(currentUserId);

        const addTypingUser = (userId: string) => {
            setTypingUsers((prev) => {
                const now = Date.now();
                const filtered = prev.filter((u) => u.userId !== userId);
                return [...filtered, { userId, lastSeenAt: now }];
            });
        };

        const removeTypingUser = (userId: string) => {
            setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        };

        const onTyping = (payload: {
            userId: string;
            chatId: string;
            isTyping: boolean;
        }) => {
            if (payload.chatId !== chatId) return;
            if (payload.userId === currentUserId) return;
            if (payload.isTyping) addTypingUser(payload.userId);
            else removeTypingUser(payload.userId);
        };

        socket.on(MessagesWsServerEvent.USER_TYPING, onTyping);

        // GC на случай если `isTyping=false` потерялся.
        const sweepInterval = setInterval(() => {
            setTypingUsers((prev) => {
                const now = Date.now();
                return prev.filter((u) => now - u.lastSeenAt < TYPING_TIMEOUT_MS);
            });
        }, 1000);

        return () => {
            socket.off(MessagesWsServerEvent.USER_TYPING, onTyping);
            clearInterval(sweepInterval);
        };
    }, [chatId, currentUserId]);

    return typingUsers;
}
