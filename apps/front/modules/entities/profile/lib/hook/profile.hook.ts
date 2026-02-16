import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "../api/ProfileService";
import { ProfileDto } from "@workspace/nest-api";

export const useProfile = (userId: string) => {
    const { data: profile, isLoading, error } = useQuery<ProfileDto>({
        queryKey: ['profile', userId],
        queryFn: () => ProfileService.getProfileByUserId(userId),
        enabled: !!userId,
    });

    return {
        profile,
        isLoading,
        error,
        posts: profile?.postsCount || 0,
        followers: profile?.followersCount || 0,
        following: profile?.followingCount || 0,
        slogan: profile?.about || '',
    };
};

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => ProfileService.uploadAvatar(file),
        onSuccess: (data) => {
            // Обновляем кеш профиля
            queryClient.setQueryData<ProfileDto>(['profile', 'me'], data);
            queryClient.setQueryData<ProfileDto>(['profile', data.userId], data);
            // Инвалидируем все запросы профиля
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
};

export const useUploadHero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => ProfileService.uploadHero(file),
        onSuccess: (data) => {
            // Обновляем кеш профиля
            queryClient.setQueryData<ProfileDto>(['profile', 'me'], data);
            queryClient.setQueryData<ProfileDto>(['profile', data.userId], data);
            // Инвалидируем все запросы профиля
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
};
