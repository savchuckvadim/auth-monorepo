import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFollowers } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';

const followersApi = getFollowers();

export const useAllUsers = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'users'],
        queryFn: () => followersApi.followersGetAllUsers(),
        enabled: !!currentUser?.id,
    });
};

export const useUserById = (userId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'user', userId],
        queryFn: () => followersApi.followersGetUserById(userId),
        enabled: !!currentUser?.id && !!userId,
    });
};

export const useMyFollowers = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'me', 'followers'],
        queryFn: () => followersApi.followersGetMyFollowers(),
        enabled: !!currentUser?.id,
    });
};

export const useMyFollowing = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'me', 'following'],
        queryFn: () => followersApi.followersGetMyFollowing(),
        enabled: !!currentUser?.id,
    });
};

export const useMyFriends = () => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'me', 'friends'],
        queryFn: () => followersApi.followersGetMyFriends(),
        enabled: !!currentUser?.id,
    });
};

export const useFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followersApi.followersFollow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followers'] });
        },
    });
};

export const useUnfollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followersApi.followersUnfollow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followers'] });
        },
    });
};

export const useCheckFollowing = (userId: string) => {
    const { currentUser } = useAuth();

    return useQuery({
        queryKey: ['followers', 'check', userId],
        queryFn: () => followersApi.followersCheckFollowing(userId),
        enabled: !!currentUser?.id && !!userId,
    });
};

