import { Post } from "../../post";

export default function ProfilePosts({ userId }: { userId: string }) {
    return (
        <div className='mt-10 '>
            <Post />
            <Post />
            <Post />
        </div>
    )
}
