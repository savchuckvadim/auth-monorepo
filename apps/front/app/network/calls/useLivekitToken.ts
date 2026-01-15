import { useAuth } from "@/modules/processes";
import { useQuery } from "@tanstack/react-query";
import { getCalls } from "@workspace/nest-api";

export const useLivekitToken = (roomName: string) => {
    const { currentUser } = useAuth();
    const api = getCalls()
    const { data, isPending: isLoading, error } = useQuery({
        queryKey: ['livekit-token', currentUser?.id, roomName],
        queryFn: () => currentUser?.id
            ? api.callsGetToken({
                roomName,
                userId: currentUser?.id
            })
            : null,
    })

    return { data, isLoading, error };
}
