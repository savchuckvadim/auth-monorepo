'use client'
import { PostDto } from "@workspace/nest-api"
import { PostLike } from "./PostLike";
import { PostRepost } from "./PostRepost";
import { PostViews } from "./PostViews";

export const PostFooter = ({ post }: { post: PostDto }) => {
    return (
        <div className='flex w-full items-end justify-between mt-3'>
            <div className='flex items-center gap-2 '>
                <PostLike post={post} />
                {/* <PostRepost post={post} /> */}

            </div>
            {/* <PostViews post={post} /> */}
        </div>
    )
}
