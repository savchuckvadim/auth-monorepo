'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
import { Chat, ChatType, CreateChat, useCreateChat, useUserChats } from '@/modules/entities/chats';
import { ChatDtoEncryptionMode, CreateChatDto } from '@workspace/nest-api';


import { ChatListWidget, CreateChatDialogWidget } from '@/modules/widgets/chat';
import { useAllUsers } from '@/modules/entities/followers';
import { ChatListManager } from '@/modules/entities/chats/ui/ChatsList/ChatListManager';
import { IncomingInvitationsBanner } from '@/modules/features/invitations';

export default function ChatListPage() {

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [securePrivateChat, setSecurePrivateChat] = useState(false);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const createChatMutation = useCreateChat();

    const { data: allUsers } = useAllUsers();



    const { currentUser } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: chats, isLoading: chatsLoading } = useUserChats();


    if (!currentUser || !currentUser?.id) {
        return <LoadingScreen />
    }




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
                encryptionMode:
                    selectedUserIds.length === 1 && securePrivateChat
                        ? ChatDtoEncryptionMode.SIGNAL
                        : undefined,
            };
            const chat = await createChatMutation.mutateAsync(chatData as CreateChatDto);
            router.push(`/network/chats/${chat.id}`);
            setShowNewChatDialog(false);
            setSelectedUserIds([]);
            setSecurePrivateChat(false);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUserIds((prev) => {
            const next = prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId];
            if (next.length !== 1) {
                setSecurePrivateChat(false);
            }
            return next;
        });
    };



    return (
        <div className="h-screen flex flex-col">

            <ChatListManager
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowNewChatDialog={setShowNewChatDialog}
            />

            <IncomingInvitationsBanner />

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
                    setSecurePrivateChat(false);
                }}
                isPending={createChatMutation.isPending}
                securePrivateChat={securePrivateChat}
                onSecurePrivateChatChange={setSecurePrivateChat}
            />
        </div>
    );
}

