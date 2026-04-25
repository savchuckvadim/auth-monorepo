'use client';

import { ArrowRightLeft, Lock, MessageSquare } from 'lucide-react';
import type { Chat } from '@/modules/entities/chats';
import type { ChatMemberDto } from '@workspace/nest-api';
import { AppButton, AppTooltip } from '@/modules/shared';
import { AudioCallButton } from '@/modules/features/audio-call';
import { VideoCallInitButton } from '@/modules/features/video-call';
import { SecretChatSettingsMenu } from '../../../../SecretChatSettingsMenu';

type ChatHeaderToolbarProps = {
    chatId: string;
    isPrivate: boolean;
    isSignal: boolean;
    otherUser: ChatMemberDto | null;
    selectedChat: Chat | undefined;
    navigatePending: boolean;
    onOpenPlainChat: () => void;
    onOpenSecureChat: () => void;
};

export function ChatHeaderToolbar({
    chatId,
    isPrivate,
    isSignal,
    otherUser,
    selectedChat,
    navigatePending,
    onOpenPlainChat,
    onOpenSecureChat,
}: ChatHeaderToolbarProps) {
    const otherUserId = otherUser?.userId || '';

    return (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 md:gap-2">
            {isPrivate && otherUserId ? (
                <>
                    {isSignal ? (
                        <AppTooltip content="Перейти в обычный чат">
                            <AppButton
                                type="button"
                                variant="outline"
                                appSize="sm"
                                disabled={navigatePending}
                                onClick={onOpenPlainChat}
                                className="h-8 min-w-0 shrink-0 gap-1 px-2 md:h-9 md:gap-1 md:px-3"
                                aria-label="Перейти в обычный чат"
                            >
                                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
                                <ArrowRightLeft
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                    aria-hidden
                                />
                            </AppButton>
                        </AppTooltip>
                    ) : (
                        <AppTooltip content="Перейти в защищённый чат">
                            <AppButton
                                type="button"
                                variant="outline"
                                appSize="sm"
                                disabled={navigatePending}
                                onClick={onOpenSecureChat}
                                className="h-8 min-w-0 shrink-0 gap-1 px-2 md:h-9 md:gap-1 md:px-3"
                                aria-label="Перейти в защищённый чат"
                            >
                                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                                <ArrowRightLeft
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                    aria-hidden
                                />
                            </AppButton>
                        </AppTooltip>
                    )}
                </>
            ) : null}
            {!isSignal && otherUser ? (
                <AudioCallButton
                    chatId={chatId}
                    otherUserId={otherUser.userId || ''}
                />
            ) : null}
            {!isSignal && otherUser ? (
                <VideoCallInitButton
                    chatId={chatId}
                    otherUserId={otherUser.userId || ''}
                />
            ) : null}
            {isPrivate && isSignal && selectedChat ? (
                <SecretChatSettingsMenu chatId={chatId} />
            ) : null}
        </div>
    );
}
