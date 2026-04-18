'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { Chat, useChatById, useUserChats } from '@/modules/entities/chats';
import { ChatMemberDto, MessageDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';

import { useChatMessages, useMarkChatAsRead } from '@/modules/entities/messages';
import { useChatSocket, useSendMessage } from '@/modules/entities/chats';

import { CallWrapperWidget } from '@/modules/widgets/call/CallWrapper/CallWrapperWidget';
import { ChatInputWidget, ChatMessagesWidget, } from '@/modules/widgets/chat';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { scrollToBottom } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';

export default function ChatPage() {
    const { currentUser } = useAuth();
    const params = useParams();
    const router = useRouter();
    const chatId = params?.chatId as string;
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedChatIdRef = useRef<string | null>(null);
    const markChatReadMutation = useMarkChatAsRead();

    const { data: chats, isPending: chatsLoading } = useUserChats();
    const {
        data: chatById,
        isPending: chatByIdLoading,
        isError: chatByIdError,
    } = useChatById(chatId || '');
    const selectedChat =
        (chatById ? (chatById as Chat) : undefined) ??
        (chats as Chat[] | undefined)?.find((c) => c.id === chatId);
    const otherUserId = selectedChat?.members?.find((m: ChatMemberDto) => m.userId !== currentUser?.id)?.userId || '';
    const { data: messages, isPending: isMessagesPending } = useChatMessages(chatId || '', 50, 0);
    const sortedMessages = messages ? (messages as MessageDto[]) : [];

    useEffect(() => {
        if (chatId && lastMarkedChatIdRef.current !== chatId) {
            lastMarkedChatIdRef.current = chatId;
            markChatReadMutation.mutate(chatId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    // WebSocket hook
    useChatSocket({
        chatId: chatId || null,
        userId: currentUser?.id,
        messagesEndRef,
    });

    // Send message hook
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

    useEffect(() => {
        if (messagesEndRef.current && chatId) {
            requestAnimationFrame(() => {
                scrollToBottom(messagesEndRef, 'auto');
            });
        }
    }, [chatId, sortedMessages.length]);

    if (!currentUser) {
        return <LoadingScreen />;
    }

    const chatResolving =
        Boolean(chatId) && (chatsLoading || chatByIdLoading);

    if (isMessagesPending || chatResolving) {
        return <LoadingComponent />;
    }

    if (!chatId || chatByIdError || !selectedChat) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Чат не найден</p>
                    <Button onClick={() => router.push('/network/chats/list')} className="mt-4">
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    // const otherUser = selectedChat.members?.find(
    //     (m: ChatMemberDto) => m.userId !== currentUser.id
    // ) || null;
    // const chatName =
    //     selectedChat.type === ChatType.PRIVATE
    //         ? otherUser?.user?.name || 'Пользователь'
    //         : selectedChat.name || 'Групповой чат';

    const handleSendMessage = () => {
        const text = messageText.trim();
        if (!text) return;
        setMessageText('');
        void sendMessage(text).catch((error) => {
            console.error('Failed to send message:', error);
        });
    };

    return (
        <div className="md:h-[82vh] h-[calc(100dvh-10rem)]  bg-background flex overflow-hidden border-2 rounded-3xl">


            {/* <CallWrapperWidget> */}
            <div className="w-full">
                <div className=" flex flex-col h-full overflow-hidden bg-card">
                    <ChatMessagesWidget
                        messagesEndRef={messagesEndRef}
                        onRetryFailed={retryFailedMessage}
                    />

                    {chatId && (
                        <ChatInputWidget
                            messageText={messageText}
                            onMessageTextChange={setMessageText}
                            onSendMessage={handleSendMessage}
                            isPending={isSendingMessage}
                        />

                    )}
                </div>
            </div>
            {/* </CallWrapperWidget> */}


        </div>
    );
}

