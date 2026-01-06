'use client'
import { PostDto } from "@workspace/nest-api"
import Image from "next/image"

export const PostContent = ({ post }: { post: PostDto }) => {
    return (
        <div className='min-h-full mt-2 flex flex-col items-start'>
            {post.text && <p className='text-sm '>
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
    )
}
