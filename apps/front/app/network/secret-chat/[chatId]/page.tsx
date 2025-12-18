'use client';

import { useParams, useRouter } from 'next/navigation';
import { SecretChatPage } from '@/modules/features/secret-chat/ui/SecretChatPage';
import { useAuth } from '@/modules/processes';
import { useUserChats } from '@/modules/entities/chats/lib/hooks/useChats';
import { LoadingScreen } from '@/modules/shared';

export default function SecretChatRoute() {
    const params = useParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const chatId = params?.chatId as string;
    const { data: chats, isLoading } = useUserChats();

    if (isLoading) {
        return <LoadingScreen />;
    }

    const chat = Array.isArray(chats) ? chats.find((c: any) => c.id === chatId) : null;
    if (!chat) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Чат не найден</p>
            </div>
        );
    }

    // Находим другого пользователя (для приватного чата)
    const members = (chat as any).members || [];
    const otherMember = members.find(
        (m: any) => m.userId !== currentUser?.id
    );
    const otherUserId = otherMember?.userId || '';
    const otherUserName = otherMember?.user?.name || 'Пользователь';

    return (
        <SecretChatPage
            chatId={chatId}
            otherUserId={otherUserId}
            otherUserName={otherUserName}
            onClose={() => router.push('/network/chats')}
        />
    );
}

