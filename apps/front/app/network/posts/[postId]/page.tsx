'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Post } from '@/modules/entities/post/ui/Post/Post';
import { usePost } from '@/modules/entities/post/lib/hook/post.hook';
import { useAuth } from '@/modules/processes';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';

/**
 * Страница поста. В этой волне — PostCard + placeholder под комменты.
 * Комментарии целиком пойдут отдельной волной (см. posts-comments.md taskdoc).
 */
export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const postId = params?.postId as string;

    const { post, isLoading, error } = usePost(postId || '');

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (error || !post) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Пост не найден</p>
                <Button onClick={() => router.back()}>Назад</Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-2xl p-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Назад
            </button>

            <Post post={post} currentUserId={currentUser?.id ?? ''} />

            <section
                className="mt-6 rounded-3xl border border-dashed bg-card/50 p-6 text-center"
                aria-label="Комментарии"
            >
                <MessageCircle className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <h2 className="text-base font-medium">Комментарии</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Обсуждения скоро появятся — это следующая волна функционала.
                </p>
            </section>
        </div>
    );
}
