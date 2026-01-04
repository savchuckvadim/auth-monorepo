import React, { FC } from 'react'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { BreadcrumbEllipsis, BreadcrumbItem } from '@workspace/ui/components/breadcrumb'

import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '@workspace/ui/components/dropdown-menu'
import { AvatarImage } from '@workspace/ui/components/avatar'
import Link from 'next/link'
import { LikeIcon, EyeIcon, RepostIcon } from '@/modules/shared'

import Image from 'next/image'
import { PostDto } from '@workspace/nest-api'
import { useUser } from '@/modules/entities/user/lib/hook/user.hook'
import { VideoPlayer } from '@/modules/features/video-call'
import { getPostDate } from '../lib/util/post-date.util'
import { useDeletePost } from '../lib/hook/post.hook'


export interface IPostProps {
    post: PostDto
    currentUserId: string
}
export const Post: FC<IPostProps> = ({ post, currentUserId }) => {
    const { user } = useUser(post.userId);
    const isOwner = currentUserId === post.userId;
    const isRepost = post.originalPostId !== null;
    const repost = post.originalPost;
    const repostUser = repost?.author;
    const deletePostMutation = useDeletePost();
    const handleDeletePost = () => {
        deletePostMutation.mutate(post.id);
    }
    return (
        <div className='min-h-[300px] h-full w-full p-4 m-0 mb-3 border rounded-3xl overflow-hidden bg-card
        flex
        flex-col
        justify-between
        '>
            <div>
                <div className='flex w-full items-start justify-between'>
                    <div className='flex items-center gap-2'>
                        <Link href={'/profile'}>
                            <Avatar>
                                <AvatarImage src={user?.avatarUrl || ''} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <p className='font-bold'>{user?.name}</p>
                            <p className='text-sm text-gray-500'>{getPostDate(post?.createdAt)}</p>
                        </div>
                    </div>

                    {isOwner && <div className='flex items-start gap-2 '>
                        <BreadcrumbItem className='flex items-center gap-1 hover:text-primary '
                            onClick={handleDeletePost}
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className='bg-white rounded-xl p-2'>
                                    <DropdownMenuItem className='cursor-pointer' onClick={handleDeletePost}>Delete</DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </div>}
                </div>

                <div className='min-h-full mt-2 flex flex-col items-start'>
                    {post.text && <p className='text-sm text-gray-500'>
                        {post.text}
                    </p>}

                    {/* Image Container */}
                    {post.image && <div className='w-full mt-4 relative' style={{ aspectRatio: '4/3' }}>
                        <Image
                            src={post.image}
                            alt='post image'
                            fill
                            className='object-cover rounded-2xl'
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>}
                    {/* Video Container */}
                    {post.video && <div className='w-full mt-4 relative' style={{ aspectRatio: '4/3' }}>
                        <video
                            src={post.video}
                            controls
                            className='object-cover rounded-2xl w-full h-full'
                        />
                    </div>}
                </div>
            </div>

            <div className='flex w-full items-end justify-between mt-3'>
                <div className='flex items-center gap-2 '>
                    <LikeIcon isLiked={post.isLiked} />
                    <RepostIcon />
                </div>
                <div className=' flex items-start gap-2'>
                    <EyeIcon />
                    <p>{post.views}</p>
                </div>
            </div>
        </div>
    )
}
