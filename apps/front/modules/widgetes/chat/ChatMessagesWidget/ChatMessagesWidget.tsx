'use client';

import { ArrowLeft, CircleCheck, CircleX, MessageCircle, Phone, Video } from 'lucide-react';
import { Chat, ChatType } from '@/modules/entities/chats';
import { MessageList, Message, useChatMessages, NO_MESSAGES_MESSAGE } from '@/modules/entities/messages';
import { ChatMemberDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';
import { AudioCallButton } from '@/modules/features/audio-call';
import { VideoCallInitButton } from '@/modules/features/video-call';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import Link from 'next/link';
import { usePresence } from '@/modules/entities';
import { getPathToPerson } from '@/modules/processes/routing';
import { cn } from '@workspace/ui/lib/utils';
import { Empty } from '@/modules/shared';

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
    const { getIsUserOnline } = usePresence();

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
    const chatName = selectedChat?.type === ChatType.PRIVATE
        ? otherUser?.user?.name || 'Пользователь'
        : selectedChat?.name || 'Групповой чат';
    const otherUserId = otherUser?.userId || '';
    // Вычисляем напрямую - React перерисует компонент при изменении presence через usePresence
    const isOnline = getIsUserOnline(otherUserId);
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Заголовок чата - sticky на мобильных */}
            <div className="sticky top-0 z-40 border-b p-4 bg-card flex-shrink-0 flex items-center justify-between md:static">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Link href="/network/chats/list">
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link href={getPathToPerson(otherUserId)}>
                        <h3 className="font-semibold">
                            {chatName}
                            <span className={cn('text-xs ml-2', isOnline ? 'text-green-500' : 'text-red-500')}>{isOnline ? 'online' : 'offline'}</span>
                        </h3>
                    </Link>
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
            {
                sortedMessages.length === 0 ? (
                    <div className="min-h-[100%] bg-background flex items-center justify-center">
                        <Empty text={NO_MESSAGES_MESSAGE} />
                    </div>
                ) : (
                    <div className="overflow-y-auto p-4 min-h-0">
                        {messagesLoading ? (<LoadingComponent />

                        ) : (

                            <MessageList
                                messages={sortedMessages}
                                currentUserId={currentUserId}
                                messagesEndRef={messagesEndRef}
                            />
                        )}
                    </div>
                )
            }

        </div>
    );
};

