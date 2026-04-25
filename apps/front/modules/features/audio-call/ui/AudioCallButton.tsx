'use client';
import { Button } from "@workspace/ui/components/button";
import { Phone, Loader2 } from "lucide-react";
import { useGlobalCallContext } from "../../call/lib/context/global-call-provider";
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { callUserThunk } from "../../call/model/thunk/CallThunk";

export const AudioCallButton = ({ chatId, otherUserId }: { chatId: string, otherUserId: string }) => {
    const { handleCallUser } = useGlobalCallContext();
    const dispatch = useAppDispatch();
    const isRequestingMedia = useAppSelector((state) => state.call.isRequestingMedia);

    const handleClick = () => {
        dispatch(callUserThunk({
            chatId,
            otherUserId,
            type: 'AUDIO',
            handleCallUser: (type: 'VIDEO' | 'AUDIO') => handleCallUser(otherUserId, chatId, type),
        }));
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            disabled={isRequestingMedia}
            className="flex items-center gap-2"
        >
            {isRequestingMedia ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Phone className="h-15 w-15 text-primary fill-current" />
            )}
        </Button>
    );
};
