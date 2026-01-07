'use client';

import { useRouter } from 'next/navigation';
import { Chat, ChatMemberDto, ChatType } from "../../lib/types/chats.types";
import { cn } from "@workspace/ui/lib/utils";
import { Avatar } from "@/modules/shared";
import { FC } from "react";
import { usePresence } from '@/modules/entities/presence';

export interface ChatsListItemProps {
    chat: Chat;
    currentUserId: string;

}
export const ChatsListItem: FC<ChatsListItemProps> = ({ chat, currentUserId }) => {
    const router = useRouter();
    const handleChatSelect = (chatId: string) => {
        router.push(`/network/chats/${chatId}`);
    };

    const otherMembers = chat.members?.filter(
        (m: ChatMemberDto) => m.userId !== currentUserId
    ) || [];

    const chatName =
        chat.type === ChatType.PRIVATE
            ? otherMembers[0]?.user?.name || 'Пользователь'
            : chat.name || 'Групповой чат';
    const otherUser = otherMembers[0]?.user;
    const otherUserId = otherUser?.id || '';
    const { getIsUserOnline } = usePresence();
    // Вычисляем напрямую - React перерисует компонент при изменении presence через usePresence
    const isOnline = getIsUserOnline(otherUserId);

    return (
        <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className={cn(
                'bg-card flex items-center gap-3 p-4 cursor-pointer hover:bg-foreground/10 transition-colors',

                'rounded-xl'
            )}
        >
            <div className="relative">
                <Avatar
                    src={''}
                    name={chatName}
                    size="md"
                    isOnline={isOnline}
                />
                {/* {isOnline && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-[#F44848]" />
                )} */}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{chatName}</p>
                {chat.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                        {chat.lastMessage.content}
                    </p>
                )}
            </div>
            {chat.unreadCount && chat.unreadCount > 0 && (
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#F44848]" />
                        <div className="w-2 h-2 rounded-full bg-[#F44848]" />
                    </div>
                </div>
            )}
        </div>
    );

}
