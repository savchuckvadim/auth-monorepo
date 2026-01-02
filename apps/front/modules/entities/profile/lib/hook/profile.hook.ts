import { UserService } from "@/modules/entities/user/lib/api/UserService";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (userId: string) => {
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => UserService.getUser(userId),
    });
    const posts = 0
    const followers = 0
    const following = 0
    const slogan = ' Идейные соображения высшего порядка, а также внедрение современных методик предопределяет высокую востребованность кластеризации усилий.'
    return { profile, isLoading, error, posts, followers, following, slogan };
}
