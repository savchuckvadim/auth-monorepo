import { PostDto } from "@workspace/nest-api";
import { useCallback } from "react";
import { useAuth } from "@/modules/processes";
import { useAppToast } from "@/modules/shared/ui";

export const usePostNotification = () => {
    const { currentUser } = useAuth();
    const { showToast } = useAppToast();
    const handlePostCreated = useCallback((post: PostDto) => {
        if (currentUser?.id === post.author?.id) {
            return;
        }
        showToast({
            dedupeKey: `post:${post.id}`,
            title: `Новый пост от ${post.author?.name ?? 'пользователя'}`,
            description: `Пользователь ${post.author?.name ?? 'Пользователь'} опубликовал новый пост`,
            href: `/network/people/${post.userId}`,
        });
    }, [currentUser?.id, showToast]);

    return { handlePostCreated };
}
