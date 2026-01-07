'use client';

import { ArrowLeft, MessageCircle, Phone, Video } from 'lucide-react';
import { Chat, ChatType } from '@/modules/entities/chats';
import { MessageList, Message, useChatMessages } from '@/modules/entities/messages';
import { ChatMemberDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';
import { AudioCallButton } from '@/modules/features/audio-call';
import { VideoCallInitButton } from '@/modules/features/video-call';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import Link from 'next/link';

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
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        Выберите диалог или создайте новый
                    </p>
                </div>
            </div>
        );
    }

    const otherUser = selectedChat?.members?.find((m: ChatMemberDto) => m.userId !== currentUserId) || null;
    return (
        <div className="flex flex-col h-full overflow-hidden ">
            {/* Заголовок чата */}
            <div className="border-b p-4 bg-card flex-shrink-0 flex items-center justify-between">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Link href="/network/chats/list">
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    <h3 className="font-semibold">
                        {selectedChat?.type === ChatType.PRIVATE
                            ? otherUser?.user?.name || 'Пользователь'
                            : selectedChat?.name || 'Групповой чат'}
                    </h3>
                    {selectedChat?.type === ChatType.GROUP && (
                        <p className="text-sm text-muted-foreground">
                            {selectedChat.members?.length} участников
                        </p>
                    )}


                </div>
                <div className="flex gap-2 justify-center">
                    {otherUser && <AudioCallButton chatId={chatId} otherUserId={
                        otherUser.userId || ''
                    } />}
                    {otherUser && <VideoCallInitButton chatId={chatId} otherUserId={
                        otherUser.userId || ''
                    } />}
                </div>
            </div>
            {/* Сообщения */}
            <div className="overflow-y-auto p-4 min-h-0">
                {messagesLoading ? (<LoadingComponent />
                    // <div className="h-full flex items-center justify-center">
                    //     <div className="text-center text-muted-foreground">
                    //         Загрузка сообщений...
                    //     </div>
                    // </div>
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

