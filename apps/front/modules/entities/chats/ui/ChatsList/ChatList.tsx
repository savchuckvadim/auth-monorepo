import { FC } from "react";
import { Chat } from "../../lib/types/chats.types";
import { ChatsListItem } from "./ChatsListItem";

export interface IChatListProps {
    chats: Chat[];
    currentUserId: string;
}
export const ChatList: FC<IChatListProps> = ({
    chats,
    currentUserId,
}) => {
    return (
        <div className=" flex flex-col gap-2 p-0 py-2">
            {chats.map((chat: Chat) => (
                <ChatsListItem key={chat.id} chat={chat} currentUserId={currentUserId} />
            ))}
        </div>
    );
};
