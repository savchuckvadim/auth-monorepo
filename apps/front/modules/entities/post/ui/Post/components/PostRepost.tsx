'use client'
import { RepostIcon } from "@/modules/shared"
import { PostDto } from "@workspace/nest-api"
import { cn } from "@workspace/ui/lib/utils";

export const PostRepost = ({ post }: { post: PostDto }) => {
    const repostsCount = post.repostsCount;
    const hasReposts = Number(repostsCount) !== 0;
    const isReposted = post.originalPostId !== null;
    const handleRepost = () => {
        console.log('repost');
    }
    return (
        <div className={
            cn('relative w-full  rounded-xl  ', 'bg-card hover:bg-primary/10')
        } onClick={handleRepost}
            style={{
                cursor: 'pointer',
            }}
        >
            <RepostIcon isActive={isReposted} />
            {hasReposts && <div className='absolute
            bg-primary -bottom-2 left-5/6 -translate-x-1/2 bg-card text-white
            w-5 h-5 flex items-center justify-center
            border border-white border-2
            text-xs p-1 rounded-full'


            >
                {repostsCount}
            </div>}
        </div>
    )
}
