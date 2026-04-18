'use client';

import {
    ArrowLeft,
    Hourglass,
    Lock,
    MessageCircle,
    MessageSquare,
    Timer,
} from 'lucide-react';
import {
    Chat,
    ChatType,
    useChatById,
    useEnsurePrivateChat,
    useUserChats,
} from '@/modules/entities/chats';
import { MessageList, Message, useChatMessages, NO_MESSAGES_MESSAGE } from '@/modules/entities/messages';
import { ChatDtoEncryptionMode, ChatMemberDto } from '@workspace/nest-api';
import { Button } from '@workspace/ui/components/button';
import { AudioCallButton } from '@/modules/features/audio-call';
import { VideoCallInitButton } from '@/modules/features/video-call';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePresence } from '@/modules/entities';
import { useAuth } from '@/modules/processes';
import { getPathToPerson } from '@/modules/processes/routing';
import { cn } from '@workspace/ui/lib/utils';
import { Empty } from '@/modules/shared';
import { getNetworkChatsListPath } from '@/modules/entities/chats/lib/routes/network-chat.routes';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { SecretChatSettingsMenu } from '@/modules/widgets/chat/SecretChatSettingsMenu';

interface ChatMessagesWidgetProps {
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    /** When not under `/network/chats/[chatId]` (e.g. legacy `/network/chats`). */
    chatId?: string | null;
    onRetryFailed?: (tempMessageId: string) => void;
}

export const ChatMessagesWidget = ({
    messagesEndRef,
    chatId: chatIdProp,
    onRetryFailed,
}: ChatMessagesWidgetProps) => {
    const params = useParams();
    const chatId =
        chatIdProp !== undefined ? chatIdProp : ((params?.chatId as string) || null);
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.id ?? '';

    const { data: chats } = useUserChats();
    /** `GET /api/chats/:id` — актуальные поля (таймеры и т.д.) после PATCH; список как fallback. */
    const { data: chatById } = useChatById(chatId ?? '');
    const selectedChat =
        (chatById ? (chatById as Chat) : undefined) ??
        (chats as Chat[] | undefined)?.find((c) => c.id === chatId);

    const { navigateToPrivateChat, isPending: isChatModeNavPending } =
        useEnsurePrivateChat();
    const { data: messages, isLoading: messagesLoading } = useChatMessages(
        chatId || '',
        50,
        0,
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

    const otherUser =
        selectedChat?.members?.find((m: ChatMemberDto) => m.userId !== currentUserId) ||
        null;
    const chatName =
        selectedChat?.type === ChatType.PRIVATE
            ? otherUser?.user?.name || 'Пользователь'
            : selectedChat?.name || 'Групповой чат';
    const otherUserId = otherUser?.userId || '';
    const isOnline = getIsUserOnline(otherUserId);
    const isPrivate = selectedChat?.type === ChatType.PRIVATE;
    const isSignal = selectedChat?.encryptionMode === ChatDtoEncryptionMode.SIGNAL;
    const hasScheduledChatDeletion = Boolean(selectedChat?.scheduledDeletionAt);
    const disappearingSec = selectedChat?.disappearingMessageSeconds ?? 0;
    const hasDisappearingMessages = disappearingSec > 0;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="sticky top-0 z-40 border-b p-4 bg-card flex-shrink-0 flex flex-wrap items-center justify-between gap-2 md:static">
                <div className="flex-shrink-0 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link href={getNetworkChatsListPath()}>
                            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link href={getPathToPerson(otherUserId)}>
                            <h3 className="font-semibold">
                                {chatName}
                                <span
                                    className={cn(
                                        'text-xs ml-2',
                                        isOnline ? 'text-green-500' : 'text-red-500',
                                    )}
                                >
                                    {isOnline ? 'online' : 'offline'}
                                </span>
                            </h3>
                        </Link>
                    </div>
                    {selectedChat?.type === ChatType.GROUP && (
                        <p className="text-sm text-muted-foreground">
                            {selectedChat.members?.length} участников
                        </p>
                    )}
                    {isPrivate && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span
                                className={cn(
                                    'rounded-full px-2 py-0.5 border',
                                    isSignal
                                        ? 'border-amber-500/60 text-amber-700 dark:text-amber-400 cursor-pointer'
                                        : 'text-muted-foreground border-border',
                                )}
                            >
                                {isSignal ? (
                                    <span className="inline-flex items-center gap-1">
                                        <Lock className="h-3 w-3" />
                                        Защищённый чат
                                    </span>
                                ) : (
                                    'Обычный чат'
                                )}
                            </span>
                            {isSignal && (hasScheduledChatDeletion || hasDisappearingMessages) ? (
                                <span className="inline-flex flex-wrap items-center gap-1.5">
                                    {hasScheduledChatDeletion ? (
                                        <span
                                            className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200"
                                            title="Запланировано удаление чата"
                                        >
                                            <Timer className="h-3 w-3 shrink-0" />
                                            чат
                                        </span>
                                    ) : null}
                                    {hasDisappearingMessages ? (
                                        <span
                                            className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-200"
                                            title="Исчезающие сообщения"
                                        >
                                            <Hourglass className="h-3 w-3 shrink-0" />
                                            {Math.max(1, Math.round(disappearingSec / 60))} мин
                                        </span>
                                    ) : null}
                                </span>
                            ) : null}
                            {otherUserId ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="text-muted-foreground cursor-help border-b border-dotted border-muted-foreground">
                                                Отдельная переписка
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            Обычный и защищённый чат — разные диалоги. История не
                                            переносится при переключении.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : null}
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 justify-end items-center">
                    {isPrivate && isSignal && selectedChat && chatId ? (
                        <SecretChatSettingsMenu chatId={chatId} />
                    ) : null}
                    {isPrivate && otherUserId && (
                        <>
                            {isSignal ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isChatModeNavPending}
                                    onClick={() =>
                                        void navigateToPrivateChat(
                                            otherUserId,
                                            ChatDtoEncryptionMode.NONE,
                                        )
                                    }
                                    className="gap-1"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Обычный чат
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isChatModeNavPending}
                                    onClick={() =>
                                        void navigateToPrivateChat(
                                            otherUserId,
                                            ChatDtoEncryptionMode.SIGNAL,
                                        )
                                    }
                                    className="gap-1"
                                >
                                    <Lock className="h-4 w-4" />
                                    Защищённый чат
                                </Button>
                            )}
                        </>
                    )}
                    {otherUser && (
                        <AudioCallButton chatId={chatId} otherUserId={otherUser.userId || ''} />
                    )}
                    {otherUser && (
                        <VideoCallInitButton chatId={chatId} otherUserId={otherUser.userId || ''} />
                    )}
                </div>
            </div>
            {sortedMessages.length === 0 ? (
                <div className="min-h-[100%] bg-background flex items-center justify-center">
                    <Empty text={NO_MESSAGES_MESSAGE} />
                </div>
            ) : (
                <div className="overflow-y-auto p-4 min-h-0">
                    {messagesLoading ? (
                        <LoadingComponent />
                    ) : (
                        <MessageList
                            messages={sortedMessages}
                            currentUserId={currentUserId}
                            messagesEndRef={messagesEndRef}
                            onRetryFailed={onRetryFailed}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
