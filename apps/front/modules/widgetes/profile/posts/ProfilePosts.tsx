'use client';
import dynamic from 'next/dynamic';
import { NO_POST_MESSAGE, Post, RepostedPost, usePostsByUserId, usePostsSocket } from "@/modules/entities";
import { useAuth } from "@/modules/processes";
import { Empty, ErrorComponent, LoadingComponent } from "@/modules/shared";

const CreatePost = dynamic(() => import("@/modules/features/").then(mod => ({ default: mod.CreatePost })), {
    ssr: false,
    loading: () => <div className='bg-card flex flex-row items-start justify-center min-w-full p-4 border rounded-xl mb-4 min-h-[60px]' />
});

export default function ProfilePosts({ userId }: { userId: string }) {
    const { currentUser } = useAuth()
    usePostsSocket();
    // Подписываемся на WebSocket события постов


    if (!currentUser) {
        return <ErrorComponent text="You are not logged in" />
    }
    const { posts, isLoading, error } = usePostsByUserId(userId);
    const isOwnProfile = currentUser?.id === userId;
    if (isLoading) {
        return <LoadingComponent />
    }
    if (error) {
        return <ErrorComponent />
    }

    return (
        <div className='mt-1 '>
            <CreatePost wallUserId={isOwnProfile ? undefined : userId} />
            {posts?.length === 0
                ? <Empty text={NO_POST_MESSAGE} />
                : posts?.map((post) => (
                    post.originalPostId
                        ? <RepostedPost key={post.id} post={post} currentUserId={currentUser?.id!} />
                        : <Post key={post.id} post={post} currentUserId={currentUser?.id!} />
                ))}
        </div>
    )
}
