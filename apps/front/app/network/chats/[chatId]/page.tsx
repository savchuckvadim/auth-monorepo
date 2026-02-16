'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { Chat, useUserChats } from '@/modules/entities/chats';
import { ChatMemberDto, MessageDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';

import { useChatMessages } from '@/modules/entities/messages';
import { useChatSocket, useSendMessage } from '@/modules/entities/chats';

import { CallWrapperWidget } from '@/modules/widgetes/call/CallWrapper/CallWrapperWidget';
import { ChatInputWidget, ChatMessagesWidget, } from '@/modules/widgetes/chat';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { scrollToBottom } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';

export default function ChatPage() {
    const { currentUser } = useAuth();
    const params = useParams();
    const router = useRouter();
    const chatId = params?.chatId as string;
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: chats } = useUserChats();
    const selectedChat = (chats as Chat[] | undefined)?.find((c) => c.id === chatId);
    const otherUserId = selectedChat?.members?.find((m: ChatMemberDto) => m.userId !== currentUser?.id)?.userId || '';
    const { data: messages, isPending: isMessagesPending } = useChatMessages(chatId || '', 50, 0);
    const sortedMessages = messages ? (messages as MessageDto[]) : [];

    // WebSocket hook
    useChatSocket({
        chatId: chatId || null,
        userId: currentUser?.id,
        messagesEndRef,
    });

    // Send message hook
    const { sendMessage, isPending: isSendingMessage } = useSendMessage({
        chatId: chatId || null,
        currentUser,
        messagesEndRef,
    });

    // Auto-scroll to bottom when messages change
    // На мобильных скроллим только контейнер сообщений, а не всю страницу
    useEffect(() => {
        if (messagesEndRef.current && chatId) {
            // Небольшая задержка для рендера
            setTimeout(() => {
                scrollToBottom(messagesEndRef);
            }, 100);
        }
    }, [chatId, sortedMessages.length]);

    if (!currentUser) {
        return <LoadingScreen />;
    }
    if (isMessagesPending) {
        return <LoadingComponent />;
    }

    if (!chatId || !selectedChat) {
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

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        try {
            await sendMessage(messageText);
            setMessageText('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="md:h-[82vh] h-[calc(100dvh-10rem)]  bg-background flex overflow-hidden border-2 rounded-3xl">


            {/* <CallWrapperWidget> */}
            <div className="w-full">
                <div className=" flex flex-col h-full overflow-hidden bg-card">
                    <ChatMessagesWidget
                        chatId={chatId}
                        currentUserId={currentUser.id}
                        selectedChat={selectedChat}
                        messagesEndRef={messagesEndRef}
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

