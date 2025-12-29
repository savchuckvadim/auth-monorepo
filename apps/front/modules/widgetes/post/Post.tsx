import React from 'react'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { BreadcrumbEllipsis, BreadcrumbItem } from '@workspace/ui/components/breadcrumb'

import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem  } from '@workspace/ui/components/dropdown-menu'
import { AvatarImage } from '@workspace/ui/components/avatar'
import Link from 'next/link'
import { LikeIcon, EyeIcon, RepostIcon } from '@/modules/shared'

import Image from 'next/image'

export default function Post() {
    return (
        <div className='min-h-[300px] h-full w-full p-4 m-0 mb-10 border rounded-3xl overflow-hidden bg-card
        flex
        flex-col
        justify-between
        '>
            <div>
                <div className='flex w-full items-start justify-between'>
                    <div className='flex items-center gap-2'>
                        <Link href={'/profile'}>
                            <Avatar>
                                <AvatarImage src="/profile-hero-test.jpg" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <p className='font-bold'>John Doe</p>
                            <p className='text-sm text-gray-500'>2 hours ago</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2'>
                        <BreadcrumbItem className='flex items-center gap-1'>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className='bg-white rounded-xl p-2'>
                                    <DropdownMenuItem className='cursor-pointer'>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer'>Themes</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer'>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </div>
                </div>

                <div className='min-h-full mt-2 flex flex-col items-start'>
                    <p className='text-sm text-gray-500'>
                        Как уже неоднократно упомянуто, представители современных социальных резервов
                        набирают популярность среди определенных слоев населения, а значит, должны
                        быть призваны к ответу. Безусловно, синтетическое тестирование прекрасно
                        подходит для реализации дальнейших направлений развития.
                    </p>

                    {/* Image Container */}
                    <div className='w-full mt-4 relative' style={{ aspectRatio: '4/3' }}>
                        <Image
                            src={'/profile-hero-test.jpg'}
                            alt='post image'
                            fill
                            className='object-cover rounded-2xl'
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className='flex w-full items-end justify-between mt-3'>
                <div className='flex items-center gap-2'>
                    <LikeIcon />
                    <RepostIcon />
                </div>
                <div className=' flex items-start gap-2'>
                    <EyeIcon />
                    <p>51</p>
                </div>
            </div>
        </div>
    )
}
