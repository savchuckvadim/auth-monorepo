'use client'
import { Avatar } from "@/modules/shared"
import { PostDto } from "@workspace/nest-api"
import { getPostDate } from "../../../lib/util/post-date.util"
import Link from "next/link"
import { usePresence } from "@/modules/entities/presence"


export const PostHeader = ({ post }: { post: PostDto }) => {
    const authorAvatarUrl = post.author?.avatar || '';
    const authorName = post.author?.name || '';
    const isOnWall = post.authorId && post.authorId !== post.userId;
    const createdAt = post.createdAt;
    const authorId = post.author?.id || '';
    const { getIsUserOnline } = usePresence();
    // Вычисляем напрямую - React перерисует компонент при изменении presence через usePresence
    const isOnline = getIsUserOnline(authorId);
    return (
        <div className='flex items-center gap-2'>
            <Link href={`/network/people/${authorId}`}>
                <Avatar src={authorAvatarUrl} name={authorName} isOnline={isOnline} size="md" />
            </Link>
            <Link href={`/network/people/${authorId}`}>
                <div>
                    <p className='font-bold'>{authorName}</p>
                    {isOnWall && (
                        <p className='text-xs text-gray-400'>posted on {post?.author?.name || ''}'s wall</p>
                    )}
                    <p className='text-sm text-gray-500'>{getPostDate(createdAt)}</p>
                </div>
            </Link>
        </div>
    )
}
