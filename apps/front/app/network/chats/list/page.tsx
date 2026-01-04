'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { Chat, ChatType, CreateChat, useCreateChat, useUserChats } from '@/modules/entities/chats';
import { ChatDto, ChatMemberDto, CreateChatDto } from '@workspace/nest-api';


import { ChatListWidget, CreateChatDialogWidget } from '@/modules/widgetes/chat';
import { useAllUsers } from '@/modules/entities/followers';
import { ChatListManager } from '@/modules/entities/chats/ui/ChatsList/ChatListManager';

export default function ChatListPage() {

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const createChatMutation = useCreateChat();

    const { data: allUsers } = useAllUsers();



    const { currentUser } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: chats, isLoading: chatsLoading } = useUserChats();







    const filteredChats = (chats as Chat[] | undefined)?.filter((chat) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            chat.name?.toLowerCase().includes(searchLower) ||
            chat.members?.some((m) =>
                m.user?.name.toLowerCase().includes(searchLower) ||
                m.user?.email.toLowerCase().includes(searchLower)
            )
        );
    }) || [];

    if (!currentUser) {
        return <LoadingScreen />;
    }

    // const handleChatSelect = (chatId: string) => {
    //     router.push(`/network/chats/${chatId}`);
    // };



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
            router.push(`/network/chats/${chat.id}`);
            // setSelectedChatId((chat as unknown as Chat).id);
            // setShowNewChatDialog(false);
            // setSelectedUserIds([]);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const handleUserToggle = (userId: string) => {
        // setSelectedUserIds((prev) =>
        //     prev.includes(userId)
        //         ? prev.filter((id) => id !== userId)
        //         : [...prev, userId]
        // );
        const chatId = chats?.find((c: ChatDto) =>
            c.members?.some((m: ChatMemberDto) => m.userId === userId))?.id;
        if (chatId) {
            router.push(`/network/chats/${chatId}`);
        }
    };



    return (
        <div className="h-screen flex flex-col">

            <ChatListManager
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowNewChatDialog={setShowNewChatDialog}
            />

            <ChatListWidget
                chats={filteredChats}
                currentUserId={currentUser.id}
                isLoading={chatsLoading}
            />
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

