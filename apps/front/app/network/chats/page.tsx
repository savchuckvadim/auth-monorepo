'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { ChatMessagesWidget, ChatInputWidget, CreateChatDialogWidget } from '@/modules/widgetes/chat';
import { useUserChats, useCreateChat, useMarkChatAsRead, useChatSocket, useSendMessage } from '@/modules/entities/chats';
import { scrollToBottom } from '@/modules/entities/messages/lib/utils/scroll-to-bottom.util';
import { Chat, ChatType, CreateChat } from '@/modules/entities/chats';
import { useAllUsers } from '@/modules/entities/followers';
import { ChatMemberDto, CreateChatDto } from '@workspace/nest-api';

export default function ChatsPage() {
    const { currentUser } = useAuth();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedChatIdRef = useRef<string | null>(null);

    const { data: chats } = useUserChats();
    const { data: allUsers } = useAllUsers();
    const createChatMutation = useCreateChat();
    const markChatReadMutation = useMarkChatAsRead();

    const selectedChat = (chats as Chat[] | undefined)?.find((c) => c.id === selectedChatId);

    // WebSocket hook
    useChatSocket({
        chatId: selectedChatId,
        userId: currentUser?.id,
        messagesEndRef,
    });

    // Send message hook
    const { sendMessage, isPending: isSendingMessage } = useSendMessage({
        chatId: selectedChatId,
        currentUser,
        messagesEndRef,
    });

    // Mark chat as read when selected (only once per chat)
    useEffect(() => {
        if (selectedChatId && lastMarkedChatIdRef.current !== selectedChatId) {
            lastMarkedChatIdRef.current = selectedChatId;
            markChatReadMutation.mutate(selectedChatId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChatId]);

    // Auto-scroll to bottom when messages change
    // На мобильных скроллим только контейнер сообщений, а не всю страницу
    useEffect(() => {
        if (messagesEndRef.current && selectedChatId) {
            // Небольшая задержка для рендера
            setTimeout(() => {
                scrollToBottom(messagesEndRef);
            }, 100);
        }
    }, [selectedChatId]);

    if (!currentUser) {
        return <LoadingScreen />;
    }

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        try {
            await sendMessage(messageText);
            setMessageText('');
        } catch (error) {
            console.error('Failed to send message:', error);
            // Error handling is done in the hook
        }
    };

    const handleCreateChat = async () => {
        if (selectedUserIds.length === 0) return;

        try {
            const chatData: CreateChat = {
                type: selectedUserIds.length === 1 ? ChatType.PRIVATE : ChatType.GROUP,
                memberIds: selectedUserIds,
                name: '',
                description: '',
            };
            const chat = await createChatMutation.mutateAsync(chatData as CreateChatDto);
            setSelectedChatId((chat as unknown as Chat).id);
            setShowNewChatDialog(false);
            setSelectedUserIds([]);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };
    const otherUserId = selectedChat?.members?.find((m: ChatMemberDto) => m.userId !== currentUser?.id)?.userId || '';
    return (
        <div className="md:h-[88vh] h-[calc(100dvh-10rem)] bg-background flex overflow-hidden border-2 rounded-3xl">


                <div className=" flex flex-col h-full overflow-hidden bg-card">
                    <ChatMessagesWidget
                        chatId={selectedChatId}
                        currentUserId={currentUser.id}
                        selectedChat={selectedChat}
                        messagesEndRef={messagesEndRef}
                    />

                    {selectedChatId && (
                        <ChatInputWidget
                            messageText={messageText}
                            onMessageTextChange={setMessageText}
                            onSendMessage={handleSendMessage}
                            isPending={isSendingMessage}
                        />

                    )}
                </div>

            <CreateChatDialogWidget
                isOpen={showNewChatDialog}
                currentUserId={currentUser.id}
                allUsers={allUsers}
                selectedUserIds={selectedUserIds}
                onUserToggle={handleUserToggle}
                onCreateChat={handleCreateChat}
                onCancel={() => {
                    setShowNewChatDialog(false);
                    setSelectedUserIds([]);
                }}
                isPending={createChatMutation.isPending}
            />

        </div>
    );
}
