export function getNetworkChatPath(chatId: string): string {
    return `/network/chats/${chatId}`;
}

export function getNetworkChatsListPath(): string {
    return '/network/chats/list';
}
