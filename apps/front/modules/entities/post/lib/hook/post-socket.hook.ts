import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PostDto } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';
import { socketManager } from '@/modules/shared';
import { EnumPostSocketEvent } from '../../type/consts';

/**
 * Хук для подписки на WebSocket события постов
 * Автоматически обновляет кэш React Query при получении событий
 */



export const usePostsSocket = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const socket = socketManager.getSocket();
        console.log('🔌 Posts WebSocket connected');
        console.log('🔌 ', socket);
        // Событие: новый пост создан
        const handlePostCreated = (post: PostDto) => {
            console.log('📝 Post created event received:', post);

            // Если пост создан автором, то не обновляем кэш так как
            // кеш обновится через useCreatePost
            if (currentUser?.id === post.authorId) {
                return;
            }
            // Обновляем feed - используем функцию для предотвращения дубликатов
            queryClient.setQueryData<PostDto[]>(['posts', 'feed'], (old = []) => {
                // Проверяем, нет ли уже этого поста
                const existingIndex = old.findIndex(p => p.id === post.id);
                if (existingIndex !== -1) {
                    // Если пост уже есть, обновляем его вместо добавления дубликата
                    const newPosts = [...old];
                    newPosts[existingIndex] = post;
                    return newPosts;
                }
                return [post, ...old];
            });

            // Обновляем посты пользователя (на чьей стене пост)
            if (post.userId) {
                queryClient.setQueryData<PostDto[]>(['posts', post.userId], (old = []) => {
                    const existingIndex = old.findIndex(p => p.id === post.id);
                    if (existingIndex !== -1) {
                        // Если пост уже есть, обновляем его вместо добавления дубликата
                        const newPosts = [...old];
                        newPosts[existingIndex] = post;
                        return newPosts;
                    }
                    return [post, ...old];
                });
            }

            // Обновляем посты автора (если автор отличается от владельца стены)
            if (post.authorId && post.authorId !== post.userId) {
                queryClient.setQueryData<PostDto[]>(['posts', post.authorId], (old = []) => {
                    const existingIndex = old.findIndex(p => p.id === post.id);
                    if (existingIndex !== -1) {
                        const newPosts = [...old];
                        newPosts[existingIndex] = post;
                        return newPosts;
                    }
                    return [post, ...old];
                });
            }

            // Обновляем конкретный пост в кэше
            queryClient.setQueryData<PostDto>(['post', post.id], post);
        };

        // Событие: пост обновлен
        const handlePostUpdated = (post: PostDto) => {
            console.log('✏️ Post updated event:', post);

            // Обновляем конкретный пост
            queryClient.setQueryData<PostDto>(['post', post.id], post);

            // Обновляем во всех списках
            queryClient.setQueriesData<PostDto[]>({ queryKey: ['posts'] }, (old = []) => {
                const index = old.findIndex(p => p.id === post.id);
                if (index !== -1) {
                    const newPosts = [...old];
                    newPosts[index] = post;
                    return newPosts;
                }
                return old;
            });

            queryClient.invalidateQueries({ queryKey: ['post', post.id] });
        };

        // Событие: пост удален
        const handlePostDeleted = (data: { postId: string } | string) => {
            // Поддерживаем оба формата для обратной совместимости
            const postId = typeof data === 'string' ? data : data.postId;
            console.log('🗑️ Post deleted event:', postId);

            // Удаляем из всех списков
            queryClient.setQueriesData<PostDto[]>({ queryKey: ['posts'] }, (old = []) => {
                return old.filter(p => p.id !== postId);
            });

            // Удаляем сам пост
            queryClient.removeQueries({ queryKey: ['post', postId] });
        };

        // Событие: лайк/дизлайк
        const handlePostLiked = (data: { postId: string; userId: string; isLike: boolean }) => {
            console.log('👍 Post liked event:', data);

            // Обновляем счетчики лайков
            queryClient.setQueriesData<PostDto>({ queryKey: ['post'] }, (old) => {
                if (!old || old.id !== data.postId) return old;
                return {
                    ...old,
                    likesCount: data.isLike ? old.likesCount + 1 : old.likesCount,
                    dislikesCount: !data.isLike ? old.dislikesCount + 1 : old.dislikesCount,
                    isLiked: data.isLike,
                    isDisliked: !data.isLike,
                };
            });

            // Обновляем в списках
            queryClient.setQueriesData<PostDto[]>({ queryKey: ['posts'] }, (old = []) => {
                return old.map(p => {
                    if (p.id !== data.postId) return p;
                    return {
                        ...p,
                        likesCount: data.isLike ? p.likesCount + 1 : p.likesCount,
                        dislikesCount: !data.isLike ? p.dislikesCount + 1 : p.dislikesCount,
                    };
                });
            });
        };

        // Подписываемся на события
        socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
        socket.on(EnumPostSocketEvent.CREATED, handlePostCreated);

        socket.off(EnumPostSocketEvent.UPDATED, handlePostUpdated);
        socket.on(EnumPostSocketEvent.UPDATED, handlePostUpdated);

        socket.off(EnumPostSocketEvent.DELETED, handlePostDeleted);
        socket.on(EnumPostSocketEvent.DELETED, handlePostDeleted);

        socket.off(EnumPostSocketEvent.LIKED, handlePostLiked);
        socket.on(EnumPostSocketEvent.LIKED, handlePostLiked);


        return () => {
            socket.off(EnumPostSocketEvent.CREATED, handlePostCreated);
            socket.off(EnumPostSocketEvent.UPDATED, handlePostUpdated);
            socket.off(EnumPostSocketEvent.DELETED, handlePostDeleted);
            socket.off(EnumPostSocketEvent.LIKED, handlePostLiked);
        };
    }, [currentUser?.id, queryClient]);


};

