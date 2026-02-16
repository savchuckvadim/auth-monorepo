import React, { FC } from 'react'

import { PostDto } from '@workspace/nest-api'
import { PostManage } from './components/PostManage'
import { PostHeader } from './components/PostHeader'
import { Post } from './Post'
import { PostFooter } from './components/PostFooter'


export interface IRepostedPostProps {
    post: PostDto
    currentUserId: string
}
export const RepostedPost: FC<IRepostedPostProps> = ({ post, currentUserId }) => {
    // const { user } = useUser(post.userId);
    // Используем author, если он указан, иначе используем владельца стены

    const isOwner = currentUserId === post.userId || currentUserId === post.authorId; // Владелец стены или автор

    const repost = post.originalPost;
    const repostUser = repost?.author;


    return (
        <div className=' h-full w-full p-4 m-0 mb-3 border rounded-3xl overflow-hidden bg-card
        flex
        flex-col
        justify-between
        '>
            <div>
                <div className='flex w-full items-start justify-between'>

                    <PostHeader post={post} />

                    {isOwner && <PostManage post={post} />}
                </div>

                <div className='mt-5'>
                    <Post post={post} currentUserId={currentUserId} isReposted={true} />
                </div>
            </div>
            <PostFooter post={post} />

        </div>
    )
}
