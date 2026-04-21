'use client';

import type { Chat } from '@/modules/entities/chats';
import { FC } from 'react';

import { ChatListItem } from '../ChatListItem';

export type ChatListProps = {
    chats: Chat[];
    currentUserId: string;
};

export const ChatList: FC<ChatListProps> = ({ chats, currentUserId }) => {
    return (
        <div className="flex flex-col gap-2 p-0 py-2">
            {chats.map((chat) => (
                <ChatListItem
                    key={chat.id}
                    chat={chat}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};
