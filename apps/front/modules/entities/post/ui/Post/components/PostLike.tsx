'use client'
import { LikeIcon } from "@/modules/shared"
import { PostDto } from "@workspace/nest-api"
import { cn } from "@workspace/ui/lib/utils";
import { useLikePost, useUnlikePost } from "../../../lib/hook/post.hook";

export const PostLike = ({ post }: { post: PostDto }) => {
    const { mutate: likePost, isPending } = useLikePost(post.id);
    const { mutate: unlikePost, isPending: isUnlikePending } = useUnlikePost();
    const likesCount = post.likesCount;
    const hasLikes = Number(likesCount) !== 0;
    const isLiked = post.isLiked;

    const isDisliked = post.isDisliked;
    const handleLike = () => {
        if (isPending) return;
        if (isLiked) {
            unlikePost(post.id);
        } else {
            likePost(post.id);
        }
    }
    if (isPending) {
        return <div className='relative w-full rounded-xl bg-card'>
            <LikeIcon isLiked={isLiked} />
        </div>
    }
    return (
        <div className={
            cn('relative w-full  rounded-xl  p-0', isLiked ? 'bg-primary hover:bg-primary/80' : 'bg-card hover:bg-primary/10')
        } onClick={handleLike}
            style={{
                cursor: 'pointer',
            }}
        >
            <LikeIcon isLiked={isLiked} />
            {hasLikes && <div className='absolute
            bg-primary -bottom-2 left-5/6 -translate-x-1/2 bg-card text-white
            w-5 h-5 flex items-center justify-center
            border border-white border-2
            text-xs p-1 rounded-full'


            >
                {likesCount}
            </div>}
        </div>
    )
}
