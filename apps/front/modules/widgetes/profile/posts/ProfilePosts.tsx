'use client';
import { CreatePost, Post, usePostsByUserId } from "@/modules/entities";
import { useAuth } from "@/modules/processes";
import { Empty, ErrorComponent, LoadingComponent } from "@/modules/shared";
import { usePostsSocket } from "@/modules/entities/post/lib/hook/post-socket.hook";

export default function ProfilePosts({ userId }: { userId: string }) {
    const { currentUser } = useAuth()

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
            <CreatePost />
            {posts?.length === 0
                ? <Empty />
                : posts?.map((post) => (
                    <Post key={post.id} post={post} currentUserId={currentUser?.id!} />
                ))}
        </div>
    )
}
