// 'use client';

import { Chat } from "@/modules/entities/chats";
import { ChatList } from "@/modules/entities/chats/ui/ChatsList/ChatList";
import { FC } from "react"

// import { useState } from 'react';
// import { Button } from '@workspace/ui/components/button';
// import { Input } from '@workspace/ui/components/input';
// import { Plus, Search } from 'lucide-react';
// import { Chat } from '@/modules/entities/chats';
// import { ChatCard } from '@/modules/entities/chats';
// import { useUserChats } from '@/modules/entities/chats';

// interface ChatListWidgetProps {
//     currentUserId: string;
//     selectedChatId: string | null;
//     onChatSelect: (chatId: string) => void;
//     onNewChatClick: () => void;
// }

// export const ChatListWidget = ({
//     currentUserId,
//     selectedChatId,
//     onChatSelect,
//     onNewChatClick,
// }: ChatListWidgetProps) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const { data: chats, isLoading: chatsLoading } = useUserChats();

//     const filteredChats = (chats as Chat[] | undefined)?.filter((chat) => {
//         if (!searchQuery) return true;
//         const searchLower = searchQuery.toLowerCase();
//         return (
//             chat.name?.toLowerCase().includes(searchLower) ||
//             chat.members?.some((m) =>
//                 m.user?.name.toLowerCase().includes(searchLower) ||
//                 m.user?.email.toLowerCase().includes(searchLower)
//             )
//         );
//     }) || [];

//     return (
//         <div className="w-80 border-r bg-card flex flex-col h-full">
//             <div className="p-4 border-b">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-bold">Диалоги</h2>
//                     <Button
//                         size="sm"
//                         onClick={onNewChatClick}
//                         variant="outline"
//                     >
//                         <Plus className="h-4 w-4" />
//                     </Button>
//                 </div>
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                     <Input
//                         type="text"
//                         placeholder="Поиск..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="pl-10"
//                     />
//                 </div>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//                 {chatsLoading ? (
//                     <div className="p-4 text-center text-muted-foreground">
//                         Загрузка...
//                     </div>
//                 ) : filteredChats.length === 0 ? (
//                     <div className="p-4 text-center text-muted-foreground">
//                         Нет диалогов
//                     </div>
//                 ) : (
//                     <div className="p-2">
//                         {filteredChats.map((chat: Chat) => (
//                             <ChatCard
//                                 key={chat.id}
//                                 chat={chat}
//                                 currentUserId={currentUserId}
//                                 isSelected={selectedChatId === chat.id}
//                                 onClick={() => onChatSelect(chat.id)}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
export interface IChatListWidgetProps {
    chats: Chat[];
    currentUserId: string;
    isLoading: boolean;
}
export const ChatListWidget: FC<IChatListWidgetProps> = ({ chats, currentUserId, isLoading }) => {


    return (
        <div className="flex-1 overflow-y-auto ">
            {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                    Загрузка...
                </div>
            ) : chats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                    Нет диалогов
                </div>
            ) : (
                <ChatList chats={chats} currentUserId={currentUserId} />
            )}
        </div>
    )

}
