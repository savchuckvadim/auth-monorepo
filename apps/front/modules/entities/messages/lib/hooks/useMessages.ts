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
            return messagesApi.messagesGetChatMessages(chatId, params as any);
        },
        enabled: !!currentUser?.id && !!chatId,
        refetchOnWindowFocus: true,
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
            ;
            return response;
        },
        // Не инвалидируем здесь - обновление делается вручную в компоненте
        // для лучшего контроля над оптимистичным обновлением
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', 'total'] });
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
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', 'total'] });
        },
    });
};

export const useUnreadCount = (chatId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['messages', 'unread', chatId],
        queryFn: async () => {
            const r = await messagesApi.messagesGetUnreadCount(chatId);
            return r.count;
        },
        enabled: !!currentUser?.id && !!chatId,
        refetchInterval: 30000,
    });
};

export const useTotalUnreadMessages = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['messages', 'unread', 'total'],
        queryFn: async () => {
            const r = await messagesApi.messagesGetTotalUnread();
            return r.total;
        },
        enabled: !!currentUser?.id,
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });
};

