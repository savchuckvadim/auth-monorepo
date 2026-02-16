import { useQuery } from "@tanstack/react-query";
import { postService } from "../api/post.service";


export const usePostsByUserId = (userId: string) => {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts', userId],
        queryFn: () => postService.getPostsByUserId(userId),
    });
    return { posts, isLoading, error };
}
export const usePostsFeed = () => {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts', 'feed'],
        queryFn: () => postService.getPostsFeed(),
    });
    return { posts, isLoading, error };
}
