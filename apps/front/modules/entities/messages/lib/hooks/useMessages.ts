import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages, CreateMessageDto } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';

const messagesApi = getMessages();

export const useChatMessages = (chatId: string, limit?: number, offset?: number) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['messages', 'chat', chatId, limit, offset],
        queryFn: () => {
            const params: { limit?: string; offset?: string } = {};
            if (limit !== undefined) params.limit = limit.toString();
            if (offset !== undefined) params.offset = offset.toString();
            debugger;
            console.log('params', params);
            return messagesApi.messagesGetChatMessages(chatId, params as any);
        },
        enabled: !!currentUser?.id && !!chatId,
    });
};

export const useMessageById = (messageId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['messages', messageId],
        queryFn: () => messagesApi.messagesGetMessageById(messageId),
        enabled: !!currentUser?.id && !!messageId,
    });
};

export const useCreateMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMessageDto) => {

            const response = await messagesApi.messagesCreateMessage(data);
            debugger;
            return response;
        },
        // Не инвалидируем здесь - обновление делается вручную в компоненте
        // для лучшего контроля над оптимистичным обновлением
        onSuccess: (_, variables) => {
            // Обновляем только список чатов, сообщения обновятся через WebSocket или вручную
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
        },
    });
};

export const useUpdateMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => {
            // TODO: Исправить когда API будет обновлен
            // Пока используем прямой вызов
            return messagesApi.messagesUpdateMessage(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => messagesApi.messagesDeleteMessage(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'chat', data.chatId] });
        },
    });
};

export const useMarkMessageAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId: string) => messagesApi.messagesMarkAsRead(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
};

export const useMarkChatAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId: string) => messagesApi.messagesMarkChatAsRead(chatId),
        onSuccess: (_, chatId) => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'chat', chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
        },
    });
};

export const useUnreadCount = (chatId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['messages', 'unread', chatId],
        queryFn: () => messagesApi.messagesGetUnreadCount(chatId),
        enabled: !!currentUser?.id && !!chatId,
        refetchInterval: 30000, // Обновлять каждые 30 секунд
    });
};

