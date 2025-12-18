import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getChats, CreateChatDto, UpdateChatDto, AddMemberDto } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';

const chatsApi = getChats();

export const useUserChats = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['chats', 'user'],
        queryFn: () => chatsApi.chatsGetUserChats(),
        enabled: !!currentUser?.id,
    });
};

export const useChatById = (chatId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['chats', chatId],
        queryFn: () => chatsApi.chatsGetChatById(chatId),
        enabled: !!currentUser?.id && !!chatId,
    });
};

export const useCreateChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChatDto) => chatsApi.chatsCreateChat(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });
};

export const useUpdateChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateChatDto }) =>
            chatsApi.chatsUpdateChat(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
        },
    });
};

export const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, data }: { chatId: string; data: AddMemberDto }) =>
            chatsApi.chatsAddMember(chatId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats', variables.chatId] });
        },
    });
};

export const useMarkChatAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId: string) => chatsApi.chatsMarkAsRead(chatId),
        onSuccess: (_, chatId) => {
            queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
        },
    });
};

