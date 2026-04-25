import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getMessages,
    CreateMessageDto,
    customAxios,
    MessageDto,
} from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';
import type { Message } from '../types/messages.types';

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

/**
 * Редактирует текст сообщения. Оптимистично обновляет ленту и откатывает
 * при ошибке. Использует `customAxios`, потому что PUT /messages/:id
 * принимает body `{ content }` — orval заново сгенерируется после regen.
 */
export const useUpdateMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => {
            return customAxios<MessageDto>({
                url: `/api/messages/${id}`,
                method: 'PUT',
                data: { content },
                headers: { 'Content-Type': 'application/json' },
            });
        },
        onMutate: async ({ id, content }) => {
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            const snapshots: Array<{
                key: readonly unknown[];
                data: Message[] | undefined;
            }> = [];
            queryClient
                .getQueriesData<Message[]>({ queryKey: ['messages', 'chat'] })
                .forEach(([key, data]) => {
                    snapshots.push({ key, data });
                    if (!data) return;
                    queryClient.setQueryData<Message[]>(
                        key,
                        data.map((m) =>
                            m.id === id
                                ? {
                                      ...m,
                                      content,
                                      editedAt: new Date().toISOString(),
                                      isEdited: true,
                                  }
                                : m,
                        ),
                    );
                });
            return { snapshots };
        },
        onError: (_err, _vars, ctx) => {
            ctx?.snapshots.forEach(({ key, data }) => {
                queryClient.setQueryData(key, data);
            });
        },
        onSettled: () => {
            void queryClient.invalidateQueries({
                queryKey: ['messages', 'chat'],
            });
        },
    });
};

/**
 * Soft-delete сообщения (бэк ставит `deletedAt` и не возвращает его в выдаче).
 * Оптимистично убирает сообщение из ленты.
 */
export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => messagesApi.messagesDeleteMessage(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            const snapshots: Array<{
                key: readonly unknown[];
                data: Message[] | undefined;
            }> = [];
            queryClient
                .getQueriesData<Message[]>({ queryKey: ['messages', 'chat'] })
                .forEach(([key, data]) => {
                    snapshots.push({ key, data });
                    if (!data) return;
                    queryClient.setQueryData<Message[]>(
                        key,
                        data.filter((m) => m.id !== id),
                    );
                });
            return { snapshots };
        },
        onError: (_err, _id, ctx) => {
            ctx?.snapshots.forEach(({ key, data }) => {
                queryClient.setQueryData(key, data);
            });
        },
        onSettled: (_data, _err, _id) => {
            void queryClient.invalidateQueries({
                queryKey: ['messages', 'chat'],
            });
            void queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
        },
    });
};

/** Ответ `POST /messages/:id/like`. */
export interface ToggleMessageLikeResult {
    messageId: string;
    chatId: string;
    isLiked: boolean;
    likesCount: number;
}

/**
 * Toggle лайка. Оптимистично обновляет `isLiked`/`likesCount` в ленте,
 * откатывает при ошибке, подстраивается под реальное значение из ответа
 * в onSettled (на случай гонки с WS-евентом от другого устройства).
 */
export const useToggleMessageLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId: string) =>
            customAxios<ToggleMessageLikeResult>({
                url: `/api/messages/${messageId}/like`,
                method: 'POST',
            }),
        onMutate: async (messageId) => {
            await queryClient.cancelQueries({ queryKey: ['messages', 'chat'] });
            const snapshots: Array<{
                key: readonly unknown[];
                data: Message[] | undefined;
            }> = [];
            queryClient
                .getQueriesData<Message[]>({ queryKey: ['messages', 'chat'] })
                .forEach(([key, data]) => {
                    snapshots.push({ key, data });
                    if (!data) return;
                    queryClient.setQueryData<Message[]>(
                        key,
                        data.map((m) => {
                            if (m.id !== messageId) return m;
                            const wasLiked = Boolean(m.isLiked);
                            const prevCount =
                                typeof m.likesCount === 'number'
                                    ? m.likesCount
                                    : 0;
                            return {
                                ...m,
                                isLiked: !wasLiked,
                                likesCount: wasLiked
                                    ? Math.max(0, prevCount - 1)
                                    : prevCount + 1,
                            };
                        }),
                    );
                });
            return { snapshots };
        },
        onError: (_err, _messageId, ctx) => {
            ctx?.snapshots.forEach(({ key, data }) => {
                queryClient.setQueryData(key, data);
            });
        },
        onSuccess: (result) => {
            queryClient
                .getQueriesData<Message[]>({ queryKey: ['messages', 'chat'] })
                .forEach(([key, data]) => {
                    if (!data) return;
                    queryClient.setQueryData<Message[]>(
                        key,
                        data.map((m) =>
                            m.id === result.messageId
                                ? {
                                      ...m,
                                      isLiked: result.isLiked,
                                      likesCount: result.likesCount,
                                  }
                                : m,
                        ),
                    );
                });
        },
    });
};

/**
 * Форвард N сообщений в M чатов. Возвращает массив созданных сообщений,
 * бэк инвалидирует ленты и Un-read-счётчики через WS `message:created`.
 */
export const useForwardMessages = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: {
            messageIds: string[];
            targetChatIds: string[];
        }) => {
            return customAxios<Array<{ id: string; chatId: string }>>({
                url: '/api/messages/forward',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: vars,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', 'total'] });
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

