import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { FC } from "react";

export interface ChatListSearchProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}
export const ChatListSearch: FC<ChatListSearchProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="flex-1 relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-foreground/10 border-0 rounded-xl"
            />
        </div>
    );
};
