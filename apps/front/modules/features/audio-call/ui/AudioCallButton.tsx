import { Button } from "@workspace/ui/components/button";
import { Phone } from "lucide-react";
import { useCallContext } from "../../call/lib/context/call-context";


export const AudioCallButton = ({ chatId, otherUserId }: { chatId: string, otherUserId: string }) => {
    const { handleCallUser } = useCallContext();
    return (
        <Button
            onClick={() => handleCallUser('AUDIO')}
            className="flex items-center gap-2"
        >
            <Phone className="h-4 w-4" />

        </Button>
    );
};
