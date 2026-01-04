import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Plus } from "lucide-react";
import { ChatListSearch, ChatListSearchProps } from "./ChatListSearch";
import { useRouter } from 'next/navigation';
import { FC } from "react";

export interface ChatListManagerProps extends ChatListSearchProps {

    setShowNewChatDialog: (show: boolean) => void;
}
export const ChatListManager: FC<ChatListManagerProps> = ({
    searchQuery,
    setSearchQuery,
    setShowNewChatDialog,
}) => {
    const router = useRouter();



    return (
        <div className="h-[72px] bg-card flex items-center px-4 gap-4 flex-shrink-0 rounded-xl">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-10 w-10"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <ChatListSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}

            />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewChatDialog(true)}
                className="h-10 w-10"
            >
                <Plus className="h-5 w-5" />
            </Button>
        </div>
    );
};
