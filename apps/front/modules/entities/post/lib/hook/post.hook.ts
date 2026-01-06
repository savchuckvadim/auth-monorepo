import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "../api/post.service";
import { CreatePostDto, PostDto, RepostDto } from "@workspace/nest-api";
import { useAuth } from "@/modules/processes";

export const usePost = (id: string) => {
    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getPostById(id),
    });
    return { post, isLoading, error };
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useAuth();

    return useMutation({
        mutationFn: (post: CreatePostDto) => postService.createPost(post),
        // Оптимистичное обновление
        onMutate: async (newPost) => {
            // Отменяем исходящие запросы, чтобы они не перезаписали оптимистичное обновление
            await queryClient.cancelQueries({ queryKey: ['posts'] });

            // Создаем временный пост для оптимистичного обновления
            const now = new Date().toISOString();
            const wallUserId = newPost.wallUserId || currentUser?.id || '';
            const tempPost: PostDto = {
                id: `temp-${Date.now()}`,
                userId: wallUserId,  // Владелец стены
                authorId: currentUser?.id || undefined,  // Автор поста
                text: newPost.text,
                image: newPost.image,
                video: newPost.video,
                audio: newPost.audio,
                link: newPost.link,
                views: 0,
                likesCount: 0,
                dislikesCount: 0,
                repostsCount: 0,
                isLiked: false,
                isDisliked: false,
                createdAt: now,
                updatedAt: now,
                author: currentUser ? {
                    id: currentUser.id,
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    avatar: currentUser.avatarUrl ? currentUser.avatarUrl : undefined,
                } : undefined,
            };

            // Обновляем все списки постов
            // 1. Feed
            queryClient.setQueryData<PostDto[]>(['posts', 'feed'], (old = []) => {
                return [tempPost, ...old];
            });

            // 2. Посты пользователя (на чьей стене создан пост)
            if (wallUserId) {
                queryClient.setQueryData<PostDto[]>(['posts', wallUserId], (old = []) => {
                    return [tempPost, ...old];
                });
            }

            // Возвращаем контекст для отката
            return { tempPostId: tempPost.id };
        },
        onError: (err, newPost, context) => {
            // Откатываем изменения при ошибке
            if (context?.tempPostId) {
                // Удаляем временный пост из всех списков
                queryClient.setQueryData<PostDto[]>(['posts', 'feed'], (old = []) => {
                    return old?.filter(p => p.id !== context.tempPostId) || [];
                });
                if (currentUser?.id) {
                    queryClient.setQueryData<PostDto[]>(['posts', currentUser.id], (old = []) => {
                        return old?.filter(p => p.id !== context.tempPostId) || [];
                    });
                }
            }
        },
        onSuccess: (data, variables, context) => {
            // Заменяем временный пост на реальный
            const replaceTempPost = (old: PostDto[] = []) => {
                // Сначала проверяем, нет ли уже реального поста (может прийти через WebSocket)
                const existingIndex = old.findIndex(p => p.id === data.id);
                if (existingIndex !== -1) {
                    // Если пост уже есть, обновляем его
                    const newPosts = [...old];
                    newPosts[existingIndex] = data;
                    return newPosts;
                }

                // Если есть временный пост, заменяем его
                if (context?.tempPostId) {
                    const tempIndex = old.findIndex(p => p.id === context.tempPostId);
                    if (tempIndex !== -1) {
                        const newPosts = [...old];
                        newPosts[tempIndex] = data;
                        return newPosts;
                    }
                }

                // Если ни временного, ни реального поста нет, добавляем в начало
                return [data, ...old];
            };

            // Обновляем feed
            queryClient.setQueryData<PostDto[]>(['posts', 'feed'], replaceTempPost);

            // Обновляем посты пользователя (на чьей стене создан пост)
            const wallUserId = variables.wallUserId || currentUser?.id;
            if (wallUserId) {
                queryClient.setQueryData<PostDto[]>(['posts', wallUserId], replaceTempPost);
            }

            // Обновляем посты автора (если автор отличается от владельца стены)
            if (data.authorId && data.authorId !== wallUserId) {
                queryClient.setQueryData<PostDto[]>(['posts', data.authorId], replaceTempPost);
            }

            // Обновляем конкретный пост в кэше
            queryClient.setQueryData<PostDto>(['post', data.id], data);
        },
        onSettled: () => {
            // Финальная синхронизация
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => postService.deletePost(id),
        // Оптимистичное удаление
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            // Сохраняем удаляемый пост для отката
            const post = queryClient.getQueryData<PostDto>(['post', postId]);
            const allPostsQueries = queryClient.getQueriesData<PostDto[]>({ queryKey: ['posts'] });

            // Удаляем пост из всех списков
            allPostsQueries.forEach(([queryKey, data]) => {
                if (data) {
                    queryClient.setQueryData<PostDto[]>(queryKey, (old = []) => {
                        return old.filter(p => p.id !== postId);
                    });
                }
            });

            // Удаляем сам пост
            queryClient.setQueryData<PostDto>(['post', postId], undefined);

            return { post, allPostsQueries };
        },
        onError: (err, postId, context) => {
            // Откатываем удаление
            if (context?.post) {
                queryClient.setQueryData<PostDto>(['post', postId], context.post);
            }
            if (context?.allPostsQueries) {
                context.allPostsQueries.forEach(([queryKey, oldData]) => {
                    if (oldData && context.post) {
                        queryClient.setQueryData<PostDto[]>(queryKey, (old = []) => {
                            // Проверяем, нет ли уже этого поста
                            if (old.find(p => p.id === postId)) {
                                return old;
                            }
                            // Добавляем обратно
                            return [context.post!, ...old];
                        });
                    }
                });
            }
        },
        onSuccess: (_, postId) => {
            // Удаляем из кэша
            queryClient.removeQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}



export const useLikePost = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => postService.likePost(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            return { postId };
        },
        onError: (err, postId, context) => {
            queryClient.setQueryData<PostDto>(['post', postId], undefined);
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData<PostDto>(['post', postId], undefined);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

}

export const useUnlikePost = () => {
    return useMutation({
        mutationFn: (postId: string) => postService.unlikePost(postId),
    });
}

export const useRepostPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, data }: { postId: string, data: RepostDto }) => postService.repostPost(postId, data),
        onMutate: async (postId, data) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            return { postId, data };
        },
  
    });
}
