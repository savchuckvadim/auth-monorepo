import React, { FC } from 'react'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { BreadcrumbEllipsis, BreadcrumbItem } from '@workspace/ui/components/breadcrumb'

import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '@workspace/ui/components/dropdown-menu'
import { AvatarImage } from '@workspace/ui/components/avatar'
import Link from 'next/link'
import { LikeIcon, EyeIcon, RepostIcon } from '@/modules/shared'

import Image from 'next/image'

import { getPostDate } from '../../lib/util/post-date.util'
import { useDeletePost } from '../../lib/hook/post.hook'
import { PostDto } from '@workspace/nest-api'
import { PostManage } from './components/PostManage'
import { PostHeader } from './components/PostHeader'
import { PostContent } from './components/PostContent'
import { PostFooter } from './components/PostFooter'
import { cn } from '@workspace/ui/lib/utils'


export interface IPostProps {
    post: PostDto
    currentUserId: string
    isReposted?: boolean
}
export const Post: FC<IPostProps> = ({ post, currentUserId, isReposted = false }) => {
    // const { user } = useUser(post.userId);
    // Используем author, если он указан, иначе используем владельца стены

    const isOwner = currentUserId === post.userId || currentUserId === post.authorId; // Владелец стены или автор

    const repost = post.originalPost;
    const repostUser = repost?.author;


    return (
        <div className={cn(
            ' h-full w-full p-4 m-0 mb-3  rounded-3xl overflow-hidden bg-card flex flex-col justify-between',
            isReposted ? 'border-l border-primary' : 'border'
        )}>
            <div>
                <div className='flex w-full items-start justify-between'>

                    <PostHeader post={post} />

                    {isOwner && <PostManage post={post} />}
                </div>

                <PostContent post={post} />
            </div>

            {!isReposted && <PostFooter post={post} />}
        </div>
    )
}
