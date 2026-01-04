import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectPostsSocket, } from '@/modules/entities/post/socket/posts-socket';
import { PostDto } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';

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

        const socket = connectPostsSocket(currentUser.id);

        // Событие: новый пост создан
        const handlePostCreated = (post: PostDto) => {
            console.log('📝 Post created event received:', post);
            debugger; // BREAKPOINT ЗДЕСЬ для отладки


            // Обновляем feed
            queryClient.setQueryData<PostDto[]>(['posts', 'feed'], (old = []) => {
                // Проверяем, нет ли уже этого поста
                if (old.find(p => p.id === post.id)) {
                    return old;
                }
                return [post, ...old];
            });

            // Обновляем посты пользователя, если это его пост
            if (post.userId) {
                queryClient.setQueryData<PostDto[]>(['posts', post.userId], (old = []) => {
                    if (old.find(p => p.id === post.id)) {
                        return old;
                    }
                    return [post, ...old];
                });
            }

            // Инвалидируем для получения полных данных
            queryClient.invalidateQueries({ queryKey: ['post', post.id] });
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
        socket.on('post:created', handlePostCreated);
        socket.on('post:updated', handlePostUpdated);
        socket.on('post:deleted', handlePostDeleted);
        socket.on('post:liked', handlePostLiked);

        return () => {
            socket.off('post:created', handlePostCreated);
            socket.off('post:updated', handlePostUpdated);
            socket.off('post:deleted', handlePostDeleted);
            socket.off('post:liked', handlePostLiked);
        };
    }, [currentUser?.id, queryClient]);

    // Отключаемся при размонтировании (если больше нет подписчиков)
    useEffect(() => {
        return () => {
            // Не отключаем сразу, так как могут быть другие компоненты, использующие сокет
            // disconnectPostsSocket();
        };
    }, []);
};

