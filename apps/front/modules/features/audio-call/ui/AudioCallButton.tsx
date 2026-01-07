'use client';
import { Button } from "@workspace/ui/components/button";
import { Phone, Loader2 } from "lucide-react";
import { useCallContext } from "../../call/lib/context/call-context";
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { callUserThunk } from "../../call/model/thunk/CallThunk";

export const AudioCallButton = ({ chatId, otherUserId }: { chatId: string, otherUserId: string }) => {
    const { handleCallUser } = useCallContext();
    const dispatch = useAppDispatch();
    const isRequestingMedia = useAppSelector((state) => state.call.isRequestingMedia);

    const handleClick = () => {
        dispatch(callUserThunk({
            chatId,
            otherUserId,
            type: 'AUDIO',
            handleCallUser,
        }));
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isRequestingMedia}
            className="flex items-center gap-2"
        >
            {isRequestingMedia ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Phone className="h-4 w-4" />
            )}
        </Button>
    );
};
