'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { Chat, useChatById, useUserChats } from '@/modules/entities/chats';
import { MessageDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';

import { useChatMessages, useMarkChatAsRead } from '@/modules/entities/messages';
import { useChatSocket, useSendMessage } from '@/modules/entities/chats';

import { ChatInputWidget, ChatMessagesWidget } from '@/modules/widgets/chat';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { scrollToBottomDeferred } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';

export default function ChatPage() {
    const { currentUser } = useAuth();
    const params = useParams();
    const router = useRouter();
    const chatId = params?.chatId as string;
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedChatIdRef = useRef<string | null>(null);
    const markChatReadMutation = useMarkChatAsRead();
    const initialScrollDoneRef = useRef(false);

    const { data: chats, isPending: chatsLoading } = useUserChats();
    const {
        data: chatById,
        isPending: chatByIdLoading,
        isError: chatByIdError,
    } = useChatById(chatId || '');
    const selectedChat =
        (chatById ? (chatById as Chat) : undefined) ??
        (chats as Chat[] | undefined)?.find((c) => c.id === chatId);
    const { data: messages, isPending: isMessagesPending } = useChatMessages(
        chatId || '',
        50,
        0,
    );
    const sortedMessages = messages ? (messages as MessageDto[]) : [];

    useEffect(() => {
        if (chatId && lastMarkedChatIdRef.current !== chatId) {
            lastMarkedChatIdRef.current = chatId;
            markChatReadMutation.mutate(chatId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    useChatSocket({
        chatId: chatId || null,
        userId: currentUser?.id,
        messagesEndRef,
    });

    const {
        sendMessage,
        retryFailedMessage,
        isPending: isSendingMessage,
    } = useSendMessage({
        chatId: chatId || null,
        currentUser,
        messagesEndRef,
        chat: selectedChat,
    });

    useLayoutEffect(() => {
        initialScrollDoneRef.current = false;
    }, [chatId]);

    useLayoutEffect(() => {
        if (!chatId || isMessagesPending || sortedMessages.length === 0) return;
        if (initialScrollDoneRef.current) return;
        scrollToBottomDeferred(messagesEndRef, 'auto');
        initialScrollDoneRef.current = true;
    }, [chatId, isMessagesPending, sortedMessages.length]);

    useEffect(() => {
        if (!chatId || chatByIdLoading) return;
        if (chatByIdError) {
            router.replace('/network/chats/list');
        }
    }, [chatId, chatByIdError, chatByIdLoading, router]);

    if (!currentUser) {
        return <LoadingScreen />;
    }

    const chatResolving = Boolean(chatId) && (chatsLoading || chatByIdLoading);

    if (isMessagesPending || chatResolving) {
        return <LoadingComponent />;
    }

    if (!chatId || chatByIdError || !selectedChat) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Чат не найден</p>
                    <Button
                        onClick={() => router.push('/network/chats/list')}
                        className="mt-4"
                    >
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    const handleSendMessage = () => {
        const text = messageText.trim();
        if (!text) return;
        setMessageText('');
        void sendMessage(text).catch((error) => {
            console.error('Failed to send message:', error);
        });
    };

    return (
        <div className="flex h-[calc(100dvh-10rem)] overflow-hidden rounded-3xl border-2 bg-background md:h-[82vh]">
            <div className="w-full">
                <div className="flex h-full flex-col overflow-hidden bg-card">
                    <ChatMessagesWidget
                        messagesEndRef={messagesEndRef}
                        onRetryFailed={retryFailedMessage}
                    />

                    {chatId ? (
                        <ChatInputWidget
                            messageText={messageText}
                            onMessageTextChange={setMessageText}
                            onSendMessage={handleSendMessage}
                            isPending={isSendingMessage}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
