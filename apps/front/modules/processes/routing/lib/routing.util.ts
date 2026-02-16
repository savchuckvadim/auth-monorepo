export const getPathToChat = (chatId: string) => {
    return `/network/chats/${chatId}`;
};
export const getPathToPerson = (userId: string) => {
    return `/network/people/${userId}`;
};

