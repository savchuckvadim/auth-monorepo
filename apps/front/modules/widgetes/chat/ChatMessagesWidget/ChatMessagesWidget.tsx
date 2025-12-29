'use client';

import { MessageCircle } from 'lucide-react';
import { Chat, ChatType } from '@/modules/entities/chats';
import { MessageList, Message, useChatMessages } from '@/modules/entities/messages';
import { ChatMemberDto } from '@workspace/nest-api';

interface ChatMessagesWidgetProps {
    chatId: string | null;
    currentUserId: string;
    selectedChat: Chat | undefined;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessagesWidget = ({
    chatId,
    currentUserId,
    selectedChat,
    messagesEndRef,
}: ChatMessagesWidgetProps) => {
    const { data: messages, isLoading: messagesLoading } = useChatMessages(
        chatId || '',
        50,
        0
    );

    const sortedMessages = messages ? (messages as unknown as Message[]) : [];

    if (!chatId) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        Выберите диалог или создайте новый
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Заголовок чата */}
            <div className="border-b p-4 bg-card flex-shrink-0">
                <h3 className="font-semibold">
                    {selectedChat?.type === ChatType.PRIVATE
                        ? selectedChat.members
                            ?.find((m: ChatMemberDto) => m.userId !== currentUserId)
                            ?.user?.name || 'Пользователь'
                        : selectedChat?.name || 'Групповой чат'}
                </h3>
                {selectedChat?.type === ChatType.GROUP && (
                    <p className="text-sm text-muted-foreground">
                        {selectedChat.members?.length} участников
                    </p>
                )}
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {messagesLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            Загрузка сообщений...
                        </div>
                    </div>
                ) : (
                    <MessageList
                        messages={sortedMessages}
                        currentUserId={currentUserId}
                        messagesEndRef={messagesEndRef}
                    />
                )}
            </div>
        </div>
    );
};

