import { useQueryClient } from '@tanstack/react-query';
import { useCreateMessage } from '@/modules/entities/messages';
import { Message, MessageType } from '@/modules/entities/messages';
import { UserDto } from '@workspace/nest-api';

interface UseSendMessageProps {
    chatId: string | null;
    currentUser: UserDto | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const useSendMessage = ({ chatId, currentUser, messagesEndRef }: UseSendMessageProps) => {
    const queryClient = useQueryClient();
    const createMessageMutation = useCreateMessage();

    const sendMessage = async (content: string) => {
        if (!chatId || !content.trim() || !currentUser) return;

        const messageText = content.trim();

        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            chatId: chatId,
            senderId: currentUser.id,
            content: messageText,
            type: MessageType.TEXT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sender: {
                id: currentUser.id,
                name: currentUser.name || '',
                email: currentUser.email || '',
            },
        };

        queryClient.setQueryData(
            ['messages', 'chat', chatId, 50, 0],
            (oldData: Message[] | undefined) => {
                if (!oldData) return [tempMessage];
                return [...oldData, tempMessage];
            }
        );

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);

        try {
            const sentMessage = await createMessageMutation.mutateAsync({
                chatId: chatId,
                content: messageText,
            });

            console.log('✅ Message sent via REST API:', sentMessage);

            const messageData = sentMessage as Message;
            console.log('📝 Message data to add to cache:', messageData);

            queryClient.setQueryData(
                ['messages', 'chat', chatId, 50, 0],
                (oldData: Message[] | undefined) => {
                    console.log('📝 Updating cache, old data length:', oldData?.length);
                    if (!oldData) {
                        console.log('📝 No old data, returning new message');
                        return [messageData];
                    }
                    const filtered = oldData.filter((msg: Message) => !msg.id?.startsWith('temp-'));
                    console.log('📝 After filtering temp messages, length:', filtered.length);
                    const exists = filtered.some((msg: Message) => msg.id === messageData.id);
                    if (exists) {
                        console.log('⚠️ Message already exists in cache');
                        return filtered;
                    }
                    const newData = [...filtered, messageData];
                    console.log('✅ New cache data length:', newData.length);
                    return newData;
                }
            );

            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Failed to send message:', error);
            queryClient.setQueryData(
                ['messages', 'chat', chatId, 50, 0],
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [];
                    return oldData.filter((msg: Message) => !msg.id?.startsWith('temp-'));
                }
            );
            throw error;
        }
    };

    return {
        sendMessage,
        isPending: createMessageMutation.isPending,
    };
};

