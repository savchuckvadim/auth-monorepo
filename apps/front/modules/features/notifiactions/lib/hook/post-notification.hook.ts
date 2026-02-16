import { useAppDispatch } from "@/modules/app";
import { postCreatedHandler } from "../utils/events/post-events.utils";
import { PostDto } from "@workspace/nest-api";
import { useCallback } from "react";
import { useAuth } from "@/modules/processes";

export const usePostNotification = () => {
    const dispatch = useAppDispatch();
    const { currentUser } = useAuth();
    const handlePostCreated = useCallback((post: PostDto) => {
        if (currentUser?.id === post.author?.id) {
            return;
        }
        postCreatedHandler(post, dispatch);
    }, [dispatch, currentUser?.id]);

    return { handlePostCreated };
}
