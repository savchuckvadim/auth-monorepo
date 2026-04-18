'use client';

import {
    Chat
} from '@/modules/entities/chats';
import { ChatDtoEncryptionMode, ChatMemberDto } from '@workspace/nest-api';
import { ChatHeaderLeading } from './ui/ChatHeaderLeading';
import { ChatHeaderPrivateRibbon } from './ui/ChatHeaderPrivateRibbon';
import { ChatHeaderToolbar } from './ui/ChatHeaderToolbar';
import { useCurrentChatHeader } from './hook/useCurrentChatHeader';

export type CurrentChatHeaderProps = {
    chatId: string;
    currentUserId: string;
    selectedChat: Chat | undefined;
};

export function CurrentChatHeader({
    chatId,
    currentUserId,
    selectedChat,
}: CurrentChatHeaderProps) {


    const {
        chatName,
        otherUserId,
        isOnline, isPrivate,
        isSignal,
        hasScheduledChatDeletion,
        hasDisappearingMessages,
        isGroup,
        otherUser,
        disappearingSec,
        navigateToPrivateChat,
        navigatePending } =
        useCurrentChatHeader(currentUserId, selectedChat);

    return (
        <div className="sticky top-0 z-40 flex flex-shrink-0 items-start justify-between gap-x-2 gap-y-1 border-b bg-card p-3 md:static md:items-center md:p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <ChatHeaderLeading
                    chatName={chatName}
                    otherUserId={otherUserId}
                    isOnline={isOnline}
                    isGroup={isGroup}
                    groupMemberCount={selectedChat?.members?.length ?? 0}
                />
                {isPrivate ? (
                    <ChatHeaderPrivateRibbon
                        isSignal={isSignal}
                        hasScheduledChatDeletion={hasScheduledChatDeletion}
                        hasDisappearingMessages={hasDisappearingMessages}
                        disappearingSec={disappearingSec}
                    />
                ) : null}
            </div>
            <ChatHeaderToolbar
                chatId={chatId}
                isPrivate={isPrivate}
                isSignal={isSignal}
                otherUser={otherUser}
                selectedChat={selectedChat}
                navigatePending={navigatePending}
                onOpenPlainChat={() =>
                    void navigateToPrivateChat(
                        otherUserId,
                        ChatDtoEncryptionMode.NONE,
                    )
                }
                onOpenSecureChat={() =>
                    void navigateToPrivateChat(
                        otherUserId,
                        ChatDtoEncryptionMode.SIGNAL,
                    )
                }
            />
        </div>
    );
}
