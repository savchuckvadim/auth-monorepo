'use client';

import React from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { MessageCircle, Lock } from 'lucide-react';
import { Chat, ChatType, ChatMemberDto } from '../../lib/types/chats.types';
import { useRouter } from 'next/navigation';

interface ChatCardProps {
    chat: Chat;
    currentUserId: string;
    isSelected: boolean;
    onClick: () => void;
}

export const ChatCard = ({ chat, currentUserId, isSelected, onClick }: ChatCardProps) => {
    const router = useRouter();
    const otherMembers = chat.members?.filter(
        (m: ChatMemberDto) => m.userId !== currentUserId
    ) || [];
    const chatName =
        chat.type === ChatType.PRIVATE
            ? otherMembers[0]?.user?.name || 'Пользователь'
            : chat.name || 'Групповой чат';

    return (
        <Card
            className={`mb-2 cursor-pointer hover:bg-accent transition-colors ${isSelected ? 'bg-accent' : ''
                }`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chatName}</p>
                        {chat.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                                {chat.lastMessage.content}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {chat.type === ChatType.PRIVATE && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/network/secret-chat/${chat.id}`);
                                }}
                                title="Секретный чат"
                            >
                                <Lock className="h-4 w-4" />
                            </Button>
                        )}
                        {chat.unreadCount && chat.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {chat.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

