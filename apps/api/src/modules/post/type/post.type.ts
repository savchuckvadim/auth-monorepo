import { Post } from "generated/prisma";

export type PostAuthor = {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;

}


export type FullPost = Post & {
    likesCount?: number;
    dislikesCount?: number;
    repostsCount?: number;
    userLike?: { isLike: boolean } | null;
    originalPost?: FullPost | null;
    author: PostAuthor;

}

