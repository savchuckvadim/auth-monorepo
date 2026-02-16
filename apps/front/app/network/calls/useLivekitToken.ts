import { useAuth } from "@/modules/processes";
import { useQuery } from "@tanstack/react-query";
import { getCalls } from "@workspace/nest-api";

export const useLivekitToken = (roomName: string | null) => {
    const { currentUser } = useAuth();
    const api = getCalls();

    const { data, isPending: isLoading, error } = useQuery({
        queryKey: ['livekit-token', currentUser?.id, roomName],
        queryFn: () => {
            if (!currentUser?.id || !roomName) {
                return null;
            }
            return api.callsGetToken({
                roomName,
                userId: currentUser.id
            });
        },
        enabled: !!currentUser?.id && !!roomName, // ✅ Запрос только если есть roomName
    });

    return { data, isLoading, error };
}
