'use client';
import { Button } from "@workspace/ui/components/button";
import { Video } from "lucide-react";
import { useCallContext } from "../call/lib/context/call-context";



export const VideoCallInitButton = ({ chatId, otherUserId }: { chatId: string, otherUserId: string }) => {
    const { handleCallUser } = useCallContext();
    return (
        <Button
            onClick={() => handleCallUser('VIDEO')}
            className="flex items-center gap-2"
        >
            <Video className="h-4 w-4" />

        </Button>
    );
};
