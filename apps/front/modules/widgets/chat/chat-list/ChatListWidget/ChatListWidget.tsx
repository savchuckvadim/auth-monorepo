'use client';

import type { Chat } from '@/modules/entities/chats';
import { FC } from 'react';

import { ChatList } from '../ChatList';
import { ChatListWidgetEmpty } from './ChatListWidgetEmpty';
import { ChatListWidgetLoading } from './ChatListWidgetLoading';

export type ChatListWidgetProps = {
    chats: Chat[];
    currentUserId: string;
    isLoading: boolean;
};

export const ChatListWidget: FC<ChatListWidgetProps> = ({
    chats,
    currentUserId,
    isLoading,
}) => {
    return (
        <div className="flex-1 overflow-y-auto">
            {isLoading ? (
                <ChatListWidgetLoading />
            ) : chats.length === 0 ? (
                <ChatListWidgetEmpty />
            ) : (
                <ChatList chats={chats} currentUserId={currentUserId} />
            )}
        </div>
    );
};
