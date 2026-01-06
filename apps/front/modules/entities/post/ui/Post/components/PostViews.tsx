import { PostDto } from "@workspace/nest-api"
import { EyeIcon } from "lucide-react"

export const PostViews = ({ post }: { post: PostDto }) => {
    const views = post.views;
    return (
        <div className=' flex items-start gap-2'>
            <EyeIcon className='w-4 h-4' />
            <p>{views}</p>
        </div>
    )
}
